(function (win) {
    function SurroundMap(mapId, lng, lat, searchCallback, centerName = '', options = {}) {
        // 创建Map实例
        let _this = this;
        let map = new BMap.Map(mapId);
        let point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom(true);
        map.addControl(new BMap.NavigationControl());

        // 设定1000米圆形范围
        let circle = new BMap.Circle(point, 1000, {
            fillColor: "blue",
            strokeWeight: 1,
            fillOpacity: 0.1,
            strokeOpacity: 0.1
        });
        map.addOverlay(circle);
        this.options = {};
        this.options.pageCapacity = 50;
        this.options.renderOptions = { map, autoViewport: false, selectFirstResult: false };
        this.options.onSearchComplete = function (results) {
            let resultList = [];
            map.clearOverlays();
            map.addOverlay(circle);
            for (let item of results.Hr) {
                resultList.push({
                    point: item.point,
                    title: item.title,
                    address: item.address,
                    distance: parseInt(map.getDistance(point, item.point))
                });
            }
            //需要改变this指向
            _this._setCenterLabel(map, point, centerName);
            _this._insertSearchResult(_this._currentSelector, resultList);
            searchCallback(_this._currentSelector, resultList);
        }
        $.extend(true, this.options, options || {});
        let local = new BMap.LocalSearch(map, this.options);

        this._map = map;
        this._point = point;
        this._local = local;
        this._circle = circle;
        return this;
    }
    SurroundMap.prototype = {
        constructor: SurroundMap,
        _range: 1000,
        _setCenterLabel: function (map, point, centerName) {
            let labelTemplate = `<div class="surround-bubble">
            <p>${centerName}</p>
            <div class="triangle-down"></div>
            </div>`;
            let centerLabel = new BMap.Label(labelTemplate, {
                position: point,
                offset: new BMap.Size(-45, -40)
            });

            centerLabel.setStyle({
                height: "35px", //高度
                border: "0",  //边
                backgroundColor: "rgba(17,164,60)",
                borderRadius: "4px",
                cursor: "pointer"
            });
            map.addOverlay(centerLabel);
        },
        _searchNearby: function (keymaps, currentSelector) {
            let localSearch = this._local;
            let range = this._range;
            let point = this._point;
            this._currentSelector = currentSelector;
            localSearch.searchNearby(keymaps, point, range);
        },
        _openInfoWindow: function (currentItem) {
            let content = `
                <div class="map-popup">
                    <div class="popup-title">${currentItem.title}</div>
                    <div class="popup-content">${currentItem.address}</div>
                </div>
            `;
            let infowindow = new BMap.InfoWindow(content, { offset: new BMap.Size(0, -10) });
            this._map.openInfoWindow(infowindow, currentItem.point);
            return this;
        },
        _insertSearchResult: function (insertSelector, resultList) {
            let _html = '';
            if (resultList.length < 1) {
                _html = '<li>范围内没有相应的周边内容, 看看其他的内容吧</li>';
            } else {
                for (const item of resultList) {
                    _html = _html +
                        `<li>
                            <p class="clearfix">
                                <span class="location fl"><i></i>${item.title}</span>
                                <span class="distance fr">${item.distance}米</span>
                            </p>
                            <p class="address">${item.address}</p>
                        </li>`;
                }
            }
            $(insertSelector).html(_html);
            return this;
        }
    }
    win.SurroundMap = SurroundMap;
})(window)