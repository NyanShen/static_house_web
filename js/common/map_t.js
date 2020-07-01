
/**
 * 百度地图
 */
var BMapApplication = {
    'isMobile' : false,
    'map' : null,                      // 百度地图实例
    'panorama' : null,                 // 街景地图实例
    'sPoint' : null,                   // 基础地图坐标点实例
    'pPoint' : null,                   // 街景地图坐标点
    'pageSize' : 20,                    // 分页条数
    'count' : 0,                       // 搜索结果统计
    'resultList' : [],                 // 搜索结果列表
    'listShowState' : true,            // 搜索结果列表的显示状态
    'title' : '',
    'marker' : [],
    'saleStatus' : 1,
    '_point' : null,
    '_text'  : null,
    '_overText' : null,
    '_type'     : 0,
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
        this.map = (this.map == null) ? new BMap.Map(elemId) : this.map;
        this.map.disableDragging();
        var that = this;
        this.map.addEventListener("click", function(){
            that.map.enableDragging();
        });
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
     * 得到圆的内接正方形bounds
     * @param {Point} centerPoi 圆形范围的圆心
     * @param {Number} r 圆形范围的半径
     * @return 无返回值
     */
    'getSquareBounds' : function (centerPoi, r){
        var a = Math.sqrt(2) * r;    // 正方形边长
        mPoi = this.getMecator(centerPoi);
        var x0 = mPoi.x, y0 = mPoi.y;
        var x1 = x0 + a / 2 , y1 = y0 + a / 2;    // 东北点
        var x2 = x0 - a / 2 , y2 = y0 - a / 2;    // 西南点
        var ne = this.getPoi(new BMap.Pixel(x1, y1)), sw = this.getPoi(new BMap.Pixel(x2, y2));
        return new BMap.Bounds(sw, ne);
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
    /**
     * 搜索结果显示到页面上
     * @param keyword 关键词
     * @param result  搜索结果
     * @param iconFlagClass 显示ICON标识
     */
    'showResultToPage' : function (keyword, result, iconFlagClass){
        $('#bmap-keyword').text(keyword);
        $('#result-count').text('(' + result.length + ')');
        var markContainer = $('#result');
        var markElem = markContainer.find('li:first').clone();
        markContainer.find('li').remove();
        if (result.length > 0)
        {
            for(var i = 0; i < result.length; i++)
            {
                var list = result[i],lat = list.lat,lng = list.lng,title = list.title,address = list.address;
                markElem.find('.digit').text((i + 1) + '.');
                markElem.find('.text').text(list.title.length > 20 ? list.title.substr(0, 20) + '...' : list.title);
                markElem.find('.text').attr('title', list.title);
                markElem.find('.distance').text(list.distance + '米');
                markContainer.append('<li onclick="BMapApplication.clickPoiData(\''+title+'\',\''+address+'\',\''+lat+'\',\''+lng+'\')">' + markElem.html() + '</li>');
            }
        }
        else
        {
            markElem.find('.digit').text('');
            markElem.find('.text').text('');
            markElem.find('.text').attr('title', '');
            markElem.find('.distance').text('');
            markContainer.append(markElem);
        }
        //this.replaceIconClass(iconFlagClass);
    },
    clickPoiData : function (title,address,lat,lng) {
        var opts = {
            width : 200,     // 信息窗口宽度
           // height: 80,     // 信息窗口高度
            title : title , // 信息窗口标题
            enableMessage:false//设置允许信息窗发送短息
        };
        var infoWindow = new BMap.InfoWindow(address, opts);  // 创建信息窗口对象
        this.map.openInfoWindow(infoWindow,new BMap.Point(lng,lat)); //开启信息窗口
    },
    /**
     * 周边配套地图
     * @param lng
     * @param lat
     * @param keyword
     * @param iconFlagClass 显示的ICON标识
     */
    'getAreaMap' : function (keyword, iconFlagClass){
        var ePoint = '';                          // 搜索结果坐标点
        var distance = 0;                         // 搜索结果距离目标点距离(单位/米)
        var _this = this;                         // 解决闭包作用域问题
        this.map.disableScrollWheelZoom();
        this.map.centerAndZoom(this.sPoint,15);
        this.map.clearOverlays();    // 清除页面标记
        var circle = new BMap.Circle(this.sPoint, 1500, {fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.1, strokeOpacity: 0.1});
        var options = {
            pageCapacity: this.pageSize,
            renderOptions : {
                map : _this.map,
               // panel:"result",
                'autoViewport' : false
            }
        };
        if(!this.isMobile)
        {
            this.map.addOverlay(circle);    // 添加页面标记
            var top_left_navigation = new BMap.NavigationControl();
            this.map.addControl(top_left_navigation);           // 添加缩放比例
            options.onSearchComplete = function(results){
                _this.resultList = [];    // 清空搜索结果集合
                // 判断状态是否正确
                if (local.getStatus() == BMAP_STATUS_SUCCESS)
                {
                    _this.count = results.getCurrentNumPois();console.log(results);
                    for (var i = 0; i < results.getCurrentNumPois(); i ++)
                    {
                        ePoint = new BMap.Point(results.getPoi(i).point.lng, results.getPoi(i).point.lat);
                        distance = parseInt(_this.map.getDistance(_this.sPoint, ePoint));
                        _this.resultList.push({key:i,address:results.getPoi(i).address,title:results.getPoi(i).title,distance:distance,lat:results.getPoi(i).point.lat,lng:results.getPoi(i).point.lng});
                    }
                }
                _this.resultList.sort(function(j, i) {
                    return j.distance - i.distance;
                });
                _this.showResultToPage(results.keyword, _this.resultList, iconFlagClass);
            };
        }else{
            options.renderOptions.selectFirstResult = false;
        }

        //var marker = new BMap.Marker(this.sPoint);          // 创建标注
        //this.map.addOverlay(marker);                        // 将标注添加到地图中
        this.setComplexPrototype();
        var myCompOverlay = new this.ComplexCustomOverlay(this.sPoint,this.title,this.title,this.saleStatus);
        this.map.addOverlay(myCompOverlay);

        var local = new BMap.LocalSearch(this.map, options);
        var bounds = this.getSquareBounds(circle.getCenter(), circle.getRadius());
        local.searchInBounds(keyword, bounds);
    },
    /**
     * 街景地图
     */
    'getStreetMap' : function (){
        this.panorama.setPosition(this.pPoint);
        this.panorama.setPov({pitch: 5, heading: 343.92});
        //设置相册位置为右上角
        this.panorama.setOptions({
            albumsControlOptions: {
                anchor: BMAP_ANCHOR_BOTTOM_LEFT
            }
        });
        //设置偏移量，距离上面15px，距离左边100px（距离那边受anchor位置的影响）
        this.panorama.setOptions({
            albumsControlOptions: {
                offset: new BMap.Size(0, 0)
            }
        });
        //设置相册的长度和图片大小,相册的最大宽度为60%，相册内图片的大小为80px
        this.panorama.setOptions({
            albumsControlOptions: {
                maxWidth: '60%',
                imageHeight: 80,
                border:0
            }
        });
    },
    ComplexCustomOverlay:function(point, text, mouseoverText,type){
        this._point = point;
        this._text = text;
        this._overText = mouseoverText;
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
            div.style.padding = "2px";
            div.style.whiteSpace = "nowrap";
            div.style.MozUserSelect = "none";
            div.style.fontSize = "12px";
            div.className = 'map-attr';
            var span = this._span = document.createElement("span");
            div.appendChild(span);
            span.innerHTML = that._text;


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
                arrow.style.backgroundPosition = "0px " + _this.positions[that._type] + "px";
            };

            div.onmouseout = function(){
                this.style.backgroundColor =  _this.backgroundColors[that._type];
                this.style.borderColor = _this.borders[that._type];
                this.getElementsByTagName("span")[0].innerHTML = that._text;
                arrow.style.backgroundPosition = "0px " + _this.positions[that._type] + "px";
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
    }
};
/**
 * 百度地图周边配套数量  调取api配合BmapController使用
 */
var BMapSearchDetail = {
    'query' : '',             // 搜索关键词
    'radius' : 1000,          // 范围内搜索 单位米
    'lng' : 0,                // 经度
    'lat' : 0,                // 纬度
    'scope' : 1,              // 详细程度 1|2
    'pageSize' : 20,           // 分页条数
    'pageNum' : 0,            // 当前页数
    /* 设置分页条数 */
    'setPageSize' : function (pageSize){
        this.pageSize = pageSize;
    },
    /* 设置当前页数 */
    'setPageNum' : function (pageNum){
        this.pageNum = pageNum;
    },
    /* 设置返回数据的详细程度 1简单，2详细 */
    'setScope' : function (scope){
        this.scope = scope;
    },
    /* 设置搜索范围（单位米） */
    'setRadius' : function (radius){
        this.radius = radius;
    },
    /* 设置基本参数 */
    'getSearchResult' : function (query, lng, lat, url, callBack){
        this.query = query;
        this.lng = lng;
        this.lat = lat;
        this.execSearch(url, callBack);
    },
    /* 获取搜索总条数 */
    'getTotal' : function (){
        return this.total;
    },
    /* 执行搜索统计 */
    'execSearch' : function (url, callBack){
        var _this = this;
        $.ajax({
            'url' : url,
            'type' : 'post',
            'data' : {
                'query' : _this.query,
                'radius' : _this.radius,
                'lng' : _this.lng,
                'lat' : _this.lat,
                'scope' : _this.scope,
                'pageSize' : _this.pageSize,
                'pageNum' : _this.pageNum
            },
            'dataType' : 'json',
            'success' : function (msg){
                if (msg.state == 0)
                {
                    callBack(msg.data);
                }
            },
            'error' : function (){
                /* status 为0时请求成功，否则请求失败 */
                callBack({'status' : 99, 'message' : 'The Ajax request failed'});
            }
        });
    }
};
