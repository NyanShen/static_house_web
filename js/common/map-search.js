//参考https://blog.csdn.net/wbx_wlg/article/details/85783774
// 问题：一直加载http://api.map.baidu.com/?qt=
(function ($) {
    FCZX.globalNamespace('FCZX.map.SearchMap');
    class SearchMap {
        constructor(options, dataSource, listener) {
            this.map = undefined; //地图实例
            this.point = undefined; //地图中心点
            this.polygon = undefined; //行政区域折线
            this.options = options || {}; //参数选项
            this.dataSource = dataSource; //原始数据
            this.listener = listener; //地图缩放或平移的事件监听器
            this.initMap();
        }

        initMap() {
            let _this = this;
            this.map = new BMap.Map('mapContainer', { minZoom: 11, maxZoom: 19 });
            this.point = new BMap.Point(this.options.lng, this.options.lat);
            this.map.centerAndZoom(this.point, 11);
            this.map.enableScrollWheelZoom(true);
            this.addMarks();
            // 必须load后绑定事件，保证可以取到地图坐标
            this.map.addEventListener('load', function () {
                _this._bindMapEvent();
            });
        }

        _bindMapEvent() {
            this.map.addEventListener("zoomend", function () { //地图缩放
                var zoomLevel = _this.map.getZoom(); //获取地图缩放级别
                if (zoomLevel <= 12) {
                    _this.addMarks();
                } else {
                    _this.getAllLabel();
                }
            });
        }
        // 根据行政区划绘制聚合点位
        addMarks() {
            // 添加marks时先清除之前的覆盖物
            let _this = this;
            let _map = this.map;
            _map.clearOverlays();
            // 模拟郑州市聚点数据
            let clusterList = _this.dataSource.gather_regions;
            //为了提高百度地图性能，本篇例子点位全用label来加载点位
            $.each(clusterList, function (index, data) {
                // 添加经纬的中心点
                let point = new BMap.Point(data.longitude, data.latitude);
                //自定义label样式
                let template = `
                <div class="circle-bubble" data-longitude="${data.longitude}" data-latitude="${data.latitude}">
                    <p class="name">${data.name}</p>
                    <p class="count"><span>${data.count}</span>个楼盘</p>
                </div>`;
                let clusterLabel = new BMap.Label(template,
                    {
                        position: point, //label 在此处添加点位位置信息
                        offset: new BMap.Size(-46, -46)
                    });
                clusterLabel.setStyle({
                    width: "92px",  //宽
                    height: "92px", //高度
                    border: "0",  //边
                    background: "rgba(17,164,60,.9)",    //背景颜色
                    borderRadius: "50%",
                    cursor: "pointer"
                });
                clusterLabel.setTitle(data.name);
                _map.addOverlay(clusterLabel);//添加点位
                // 当鼠标悬停在label上时显示行政区划边界
                clusterLabel.addEventListener("mouseover", function () {
                    clusterLabel.setStyle({ background: "rgba(255,102,0,.9)" }); //修改覆盖物背景颜色
                    var regionName = clusterLabel.getTitle();
                    _this.getBoundary(regionName);
                });
                // 当鼠标离开时在删除边界折线数据
                clusterLabel.addEventListener("mouseout", function () {
                    clusterLabel.setStyle({ background: "rgba(17,164,60,.9)" }); //修改覆盖物背景颜色
                    if (_this.polygon) {
                        _map.removeOverlay(_this.polygon);//清除折线数据
                    }
                });

                clusterLabel.addEventListener("click", function () {
                    _map.zoomIn();
                    _this.getAllLabel();//获取所有点位数据
                });

            })

        }
        // 根据行政区划绘制边界
        getBoundary(regionName) {
            let _this = this;
            let _map = _this.map;
            let boundary = new BMap.Boundary();
            boundary.get(regionName, function (rs) {
                //行政区域的点有多少个
                if (rs.boundaries.length === 0) {
                    alert('未能获取当前输入行政区域');
                    return;
                }
                for (const itemBoundary of rs.boundaries) {
                    if (!_this.polygon) {
                        _this.polygon = new BMap.Polygon(itemBoundary, {
                            strokeWeight: 2,
                            strokeColor: "rgb(17,164,60)",
                            fillColor: "rgba(17,164,60, .1)"
                        }); //建立多边形覆盖物
                        _map.addOverlay(_this.polygon);  //添加覆盖物
                    } else {
                        _this.polygon.setPath(itemBoundary);
                        _map.addOverlay(_this.polygon);  //添加覆盖物
                    }
                    _this.polygon.enableMassClear();
                }
            });
        }

        //绘制详细楼盘点位信息
        getAllLabel() {
            let _map = this.map;
            _map.clearOverlays();
            //模拟点位数据
            var labelList = this.dataSource.label_rows;
            $.each(labelList, function (index, data) {
                let point = new BMap.Point(data.longitude, data.latitude);
                let houseTemplate = `
                <a class="house-bubble" data-longitude="${data.longitude}" data-latitude="${data.latitude}" href="${data.house_link}">
                    <p>
                        <span class="price">${data.price}</span>
                        <span class="unit">${data.price_unit}</span>
                        <em>|</em>
                        <span class="name">${data.house_name}</span>
                    </p>
                    <div class="triangle-down"></div>
                </a>`;
                let houseLabel = new BMap.Label(houseTemplate,
                    {
                        position: point, //label 在此处添加点位位置信息
                        offset: new BMap.Size(-65, -45)
                    });
                houseLabel.setStyle({
                    height: "30px", //高度
                    border: "0",  //边
                    backgroundColor: "rgba(17,164,60,.9)",
                    borderRadius: "4px",
                    cursor: "pointer"
                });
                houseLabel.setTitle(data.house_name);
                labelList.push(houseLabel);
                _map.addOverlay(houseLabel);

                let lastHouseLabel = null;
                //鼠标点击时打开新标签并关闭上一个标签内容
                houseLabel.addEventListener("mouseover", function () {
                    houseLabel.setStyle({ background: "rgba(255,102,0,.9)" });
                });
                houseLabel.addEventListener("mouseout", function () {
                    houseLabel.setStyle({ background: "rgba(17,164,60,.9)" }); //修改覆盖物背景颜色
                });
                //鼠标点击时标签一直存在
                // houseLabel.addEventListener("click", function () {
                //     houseLabel.setStyle({ background: "rgba(255,102,0,.9)" });
                // });
            });
            //addViewLabel(labelData);//加载可视范围点
        }

        //获取地图可视范围
        getBoundsParams() {
            let param = {};
            let _this = this;
            let _map = _this.map;
            let bounds = _map.getBounds();
            let sw = bounds.getSouthWest();
            let ne = bounds.getNorthEast();
            param.zoom = _map.getZoom();
            param.swlng = sw.lng;
            param.swlat = sw.lat;
            param.nelng = ne.lng;
            param.nelat = ne.lat;
            return param
        }

        // 更新地图数据
        updateDataSource() {

        }
    }
    FCZX.map.SearchMap = SearchMap;
})(jQuery)