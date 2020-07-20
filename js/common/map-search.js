//参考https://blog.csdn.net/wbx_wlg/article/details/85783774
(function (win, $) {
    class SearchMap {
        constructor(options, sourceData, listener) {
            this.map = undefined; //地图实例
            this.point = undefined; //地图中心点
            this.polygon = undefined;
            this.options = options || {}; //参数选项
            this.sourceData = sourceData; //原始数据
            this.listener = listener; //地图缩放或平移的事件监听器
            this.initMap();
        }

        initMap() {
            let _this = this;
            this.map = new BMap.Map('mapContainer', { minZoom: 9, maxZoom: 18 });
            this.point = new BMap.Point(this.options.lng, this.options.lat);
            this.map.centerAndZoom(this.point, 9);
            this.map.enableScrollWheelZoom(true);
            this.addMarks();
            this.map.addEventListener("zoomend", function () {
                var zoomLevel = _this.map.getZoom(); //获取地图缩放级别
                if (zoomLevel <= 10) {
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
            let _polygon = this.polygon;
            _map.clearOverlays();
            // 模拟郑州市聚点数据
            let clusterList = [
                { "name": "郑州市", "code": "410100000", "longitude": "113.451854", "latitude": "34.556306", "count": "445" },
                { "name": "开封市", "code": "410200000", "longitude": "114.356733", "latitude": "34.506238", "count": "377" },
                { "name": "洛阳市", "code": "410300000", "longitude": "112.134468", "latitude": "34.263041", "count": "370" },
                { "name": "平顶山市", "code": "410400000", "longitude": "112.992161", "latitude": "33.773999", "count": "300" },
                { "name": "安阳市", "code": "410500000", "longitude": "114.098163", "latitude": "36.106852", "count": "290" },
                { "name": "鹤壁市", "code": "410600000", "longitude": "114.208643", "latitude": "35.653125", "count": "245" },
                { "name": "新乡市", "code": "410700000", "longitude": "113.933677", "latitude": "35.31059", "count": "236" },
                { "name": "焦作市", "code": "410800000", "longitude": "113.050848", "latitude": "35.124706", "count": "210" },
                { "name": "濮阳市", "code": "410900000", "longitude": "115.169299", "latitude": "35.769421", "count": "225" },
                { "name": "许昌市", "code": "411000000", "longitude": "113.956834", "latitude": "34.043383", "count": "155" }
            ];
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
                    if (win.polygon) {
                        var polyPathArray = new Array();
                        win.polygon.setPath(polyPathArray);
                        _map.removeOverlay(polygon);//清除折线数据
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
            let _map = this.map;
            let boundary = new BMap.Boundary();
            boundary.get(regionName, function (rs) {
                //行政区域的点有多少个
                if (rs.boundaries.length === 0) {
                    alert('未能获取当前输入行政区域');
                    return;
                }
                for (const itemBoundary of rs.boundaries) {
                    if (!win.polygon) {
                        win.polygon = new BMap.Polygon(itemBoundary, {
                            strokeWeight: 2,
                            strokeColor: "rgb(17,164,60)",
                            fillColor: "rgba(17,164,60, .1)"
                        }); //建立多边形覆盖物
                        _map.addOverlay(polygon);  //添加覆盖物
                    } else {
                        win.polygon.setPath(itemBoundary);
                        _map.addOverlay(polygon);  //添加覆盖物
                    }
                    polygon.enableMassClear();
                }
            });
        }

        //绘制详细楼盘点位信息
        getAllLabel() {
            let _map = this.map;
            _map.clearOverlays();
            //模拟点位数据
            var labelList = [
                { "name": "楼盘一", "code": "01", "longitude": "113.515919", "latitude": "34.799769", "price": "10000" },
                { "name": "楼盘二", "code": "02", "longitude": "113.509444", "latitude": "34.4475", "price": "999" },
                { "name": "楼盘三", "code": "03", "longitude": "113.68175", "latitude": "34.737633", "price": "888" },
                { "name": "楼盘四", "code": "04", "longitude": "113.280769", "latitude": "34.814961", "price": "777" },
                { "name": "楼盘五", "code": "05", "longitude": "113.611175", "latitude": "34.784972", "price": "666" },
                { "name": "楼盘六", "code": "06", "longitude": "113.609436", "latitude": "34.770558", "price": "555" },
                { "name": "楼盘七", "code": "07", "longitude": "113.687778", "latitude": "34.861111", "price": "444" },
                { "name": "楼盘八", "code": "08", "longitude": "113.333333", "latitude": "34.833333", "price": "333" },
                { "name": "楼盘九", "code": "09", "longitude": "114.0537", "latitude": "34.7273", "price": "222" },
                { "name": "楼盘十", "code": "10", "longitude": "113.419642", "latitude": "34.809192", "price": "111" },
                { "name": "楼盘十一", "code": "11", "longitude": "113.068653", "latitude": "34.382344", "price": "1111" },
                { "name": "楼盘十二", "code": "12", "longitude": "113.1491", "latitude": "34.389", "price": "2222" }
            ];
            $.each(labelList, function (index, data) {
                let point = new BMap.Point(data.longitude, data.latitude);
                let houseTemplate = `
                <div class="house-bubble" data-longitude="${data.longitude}" data-latitude="${data.latitude}">
                    <p>
                        <span class="price">${data.price}</span>
                        <span class="unit">元/㎡</span>
                        <em>|</em>
                        <span class="name">${data.name}</span>
                    </p>
                    <div class="triangle-down"></div>
                </div>`;
                let houseLabel = new BMap.Label(houseTemplate,
                    {
                        position: point, //label 在此处添加点位位置信息
                        offset: new BMap.Size(-12, -15)
                    });
                houseLabel.setStyle({
                    height: "30px", //高度
                    border: "0",  //边
                    backgroundColor: "rgba(17,164,60,.9)",
                    borderRadius: "4px",
                    cursor: "pointer"
                });
                houseLabel.setTitle(data.name);
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
    }
    win.SearchMap = SearchMap;
})(window, jQuery)