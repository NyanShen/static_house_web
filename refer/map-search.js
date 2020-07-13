
/**
 * 百度地图
 */
var BMapApplication = {
    'map' : null,                      // 百度地图实例
    'panorama' : null,                 // 街景地图实例
    'sPoint' : null,                   // 基础地图坐标点实例
    'pPoint' : null,                   // 街景地图坐标点
    'bssw'   : null,                  //可视化区域左下角坐标
    'bsne'   : null,                  //可视化区域右上角坐标
    'viewArea' : true,//是否只搜索可视区域内
    'requestUrl' : null,//请求地址
    'requestParam' : null,//请求参数
    'requestNum'   : 0,
    '_point' : null,
    '_text'  : null,
    '_overText' : null,
    '_type'     : 0,
    '_url'      : '',
    'zoom'      : 13,
    'positions' : ["0", "-20", "-10", "-30"],//三角箭头位置
    'backgroundColors' : ["#33C0D0", "#fc5172", "#ff9600", "#9e9e9e"],//背景颜色
    'borders' : ["#0D5780", "#CC0066", "#FF6600", "#4B4B4B"],//边框颜色
    /**
     * 初始化方法
     * @param lng
     * @param lat
     * @param elemId
     */
    'init' : function (args){
        var lng = args.lng ? args.lng : 0;
        var lat = args.lat ? args.lat : 0;
        var mapContainerId = args.mapContainerId ? args.mapContainerId : '';
        var streetContainerId = args.streetContainerId ? args.streetContainerId : '';
        if (mapContainerId != '')
        {
            this.setBmapContainer(mapContainerId);
            this.setSPoint(lng, lat);
        }
        if (streetContainerId != '')
        {
            this.setPanoramaContainer(streetContainerId);
            this.setPPoint(lng, lat);
        }
    },
    /**
     * 设置基本地图容器
     * @param elemId
     */
    'setBmapContainer' : function (elemId){
        elemId = elemId == undefined ? 'allmap' : elemId;
        this.map = (this.map == null) ? new BMap.Map(elemId,{ enableMapClick: false,minZoom : 12 }) : this.map;
    },
    /* 清空基本地图容器 */
    'clearBmapContainer' : function (){
        this.map = null;
    },
    /**
     * 设置街景地图容器
     * @param elemId
     */
    'setPanoramaContainer' : function (elemId){
        this.panorama = (this.panorama == null) ? new BMap.Panorama(elemId, {
            albumsControl: true    // 显示相册控件
        }) : this.panorama;
    },
    /**
     * 设置经纬坐标点
     * @param lng
     * @param lat
     */
    'setSPoint' : function (lng, lat){
        this.sPoint = (this.sPoint == null) ? new BMap.Point(lng, lat) : this.sPoint;
    },
    /**
     * 设置
     * @param lng
     * @param lat
     */
    'setPPoint' : function (lng, lat){
        this.pPoint = (this.pPoint == null) ? new BMap.Point(lng, lat) : this.pPoint;
    },
    /**
     * 根据球面坐标获得平面坐标
     * @param poi
     * @returns {*}
     */
    'getMecator' : function (poi){
        return this.map.getMapType().getProjection().lngLatToPoint(poi);
    },
    /**
     * 根据平面坐标获得球面坐标
     * @param mecator
     * @returns {*}
     */
    'getPoi' : function (mecator){
        return this.map.getMapType().getProjection().pointToLngLat(mecator);
    },
    getMap : function(){
        var _this = this;                         // 解决闭包作用域问题
        this.map.enableScrollWheelZoom();
        this.map.centerAndZoom(this.sPoint,10);
        //监听地图加载完成事件
        this.map.addEventListener("tilesloaded",function(){_this.getData();});
    },
    setCenter :function(lng,lat,name){
        if(lng!=0 && lat!=0)
        {
            this.map.centerAndZoom(new BMap.Point(lng,lat),this.zoom);
        }else{
            this.map.centerAndZoom(name,this.zoom);
        }

    },
    //获取可视化区域
    getMapBounds : function(){
        var bounds = this.map.getBounds();   //获取可视区域
        this.bssw = bounds.getSouthWest();   //可视区域左下角
        this.bsne = bounds.getNorthEast();
    },
    getData : function(){
        var that = this,pointArr = [];
        this.getMapBounds();
        //按条件筛选在地图可视范围内 按楼盘名搜索不限制
        if(this.viewArea)
        {
            this.requestParam.bssw_lat = this.bssw.lat;
            this.requestParam.bssw_lng = this.bssw.lng;
            this.requestParam.bsne_lat = this.bsne.lat;
            this.requestParam.bsne_lng = this.bsne.lng;
        }else{
            this.requestNum++;
        }
        this.requestParam.zoom     = this.map.getZoom();//获取地图缩放级别
        //解决按楼盘名称搜索死循环问题
        if(this.requestNum > 1){
            this.requestNum = 0;
            this.viewArea = true;
            this.requestParam.keyword = null;
            return false;
        }
        that.map.clearOverlays();
        if(this.requestUrl){
            $.get(this.requestUrl,this.requestParam,function(result){
                if(result.code == 1 && result.data)
                {
                    $("#lists").attr('data-total',result.data.last_page);
                    var gettpl = document.getElementById('template').innerHTML;
                    laytpl(gettpl).render(result.data.data, function(html){
                        $('#lists').html(html);
                    });
                    if(result.zoom < 16)
                    {
                        $(result.countData).each(function (i, ite) {
                            var txt = ite.name+'<br />'+ite.price+'<br />'+ite.total;
                            var point = new BMap.Point(ite.lng,ite.lat);
                            pointArr.push(point);
                            that.setClustererComplexPrototype();
                            var myCompOverlay = new that.ComplexCustomOverlay(point,txt,txt,1);
                            that.map.addOverlay(myCompOverlay);
                        });
                    }else{
                        var data = result.countData;
                        $(data).each(function (i, ite) {
                            var txt = ite.title, mouseoverTxt = txt + " " + ite.price;
                            var point = new BMap.Point(ite.lng,ite.lat);
                            pointArr.push(point);
                            that.setComplexPrototype();
                            var myCompOverlay = new that.ComplexCustomOverlay(point,mouseoverTxt,mouseoverTxt,ite.sale_status,ite.url);
                            that.map.addOverlay(myCompOverlay);
                        });
                    }
                    //按楼盘名称搜索所有结果显示在可视区域内
                    if(!that.viewArea)
                    {
                        var view = that.map.getViewport(pointArr);
                        var mapZoom = view.zoom;
                        var centerPoint = view.center;
                        that.map.centerAndZoom(centerPoint,mapZoom);
                    }

                }
            });
        }
    },
    ComplexCustomOverlay:function(point, text, mouseoverText,type,url){
        this._point = point;
        this._text = text;
        this._overText = mouseoverText;
        this._url = url;
        var _type = 0;
        switch(type){
            case 1:
                _type = 0;
                break;
            case 2:
                _type = 1;
                break;
            case 3:
            case 5:
                _type = 2;
                break;
            case 4:
                _type = 3;
                break;
            default :
                _type = 0;
                break;
        }
        this._type = _type;
    },
    setComplexPrototype : function(){
        this.ComplexCustomOverlay.prototype = new BMap.Overlay();
        var _this = this;
        this.ComplexCustomOverlay.prototype.initialize = function(){
            var that = this;
            var div = this._div = document.createElement("div");
            div.style.position = "absolute";
            div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
            div.style.backgroundColor = _this.backgroundColors[that._type];
            div.style.border = "1px solid " + _this.borders[that._type];
            div.style.color = "white";
            div.style.height = "18px";
            div.style.padding = "2px";
            div.style.lineHeight = "18px";
            div.style.whiteSpace = "nowrap";
            div.style.MozUserSelect = "none";
            div.style.fontSize = "12px";
            var span = this._span = document.createElement("span");
            div.appendChild(span);
            span.appendChild(document.createTextNode(that._text));


            var arrow = this._arrow = document.createElement("div");
            arrow.style.background = "url(/static/images/label.png) no-repeat";
            arrow.style.backgroundPosition = "0px " + _this.positions[that._type] + "px";
            arrow.style.position = "absolute";
            arrow.style.width = "11px";
            arrow.style.height = "10px";
            arrow.style.top = "22px";
            arrow.style.left = "10px";
            arrow.style.overflow = "hidden";
            div.appendChild(arrow);

            div.onmouseover = function(){
                this.style.backgroundColor =  _this.backgroundColors[that._type];
                this.style.borderColor = _this.borders[that._type];
                this.getElementsByTagName("span")[0].innerHTML = that._overText;
                this.style.cursor = 'pointer';
                arrow.style.backgroundPosition = "0px " + _this.positions[that._type] + "px";
            };

            div.onmouseout = function(){
                this.style.backgroundColor =  _this.backgroundColors[that._type];
                this.style.borderColor = _this.borders[that._type];
                this.getElementsByTagName("span")[0].innerHTML = that._text;
                arrow.style.backgroundPosition = "0px " + _this.positions[that._type] + "px";
            };
            div.onclick = function(){
                window.open(that._url);
                //window.location.href = that._url;
            };
            _this.map.getPanes().labelPane.appendChild(div);

            return div;
        };
        this.ComplexCustomOverlay.prototype.draw = function(){
            var map = _this.map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
            this._div.style.top  = pixel.y - 30 + "px";
        }
    },
    setClustererComplexPrototype : function(){
        this.ComplexCustomOverlay.prototype = new BMap.Overlay();
        var _this = this;
        this.ComplexCustomOverlay.prototype.initialize = function(){
            var that = this;
            var div = this._div = document.createElement("ul");
            div.style.position = "absolute";
            div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
            div.setAttribute("class","lpNum");
            var li = document.createElement("li");
            div.appendChild(li);
            var a = li.appendChild(document.createElement("a"));
            a.innerHTML = that._text;
            _this.map.getPanes().labelPane.appendChild(div);
            div.onclick = function(){
                _this.zoom = _this.map.getZoom()+1;
                _this.setCenter(that._point.lng,that._point.lat);
                _this.requestNum = 0;
            };
            return div;
        };
        this.ComplexCustomOverlay.prototype.draw = function(){
            var map = _this.map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x  + "px";
            this._div.style.top  = pixel.y - 30 + "px";
        }
    }
};

