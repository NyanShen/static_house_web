
(function (win, $) {
    FCZX.globalNamespace('FCZX.map.Index');

    FCZX.map.Index = function (opt) {
        this.opt = {
            type: 1,
            defaultZoom: 11,
            regionZoom: 12,
            navSelector: '.main-nav',
            menuOpt: {
                menuSelector: '.map-search-menu',
                itemSelector: '.menu-item',
                switchSelector: '.switch-list',
                selectTextS: '.item-select',
                selectListS: '.item-select-list',
                optionS: 'li',
                city_regions: opt.city_regions
            }
        }
        $.extend(true, this.opt, opt || {});

        this.headerHeight = this._getHeaderHeight();
        this._init();
    }
    $.extend(FCZX.map.Index.prototype, {
        _init: function () {
            let _this = this;
            let _opt = _this.opt;

            this.bMap = new FCZX.map.SearchMap(_this, {
                headerHeight: _this.headerHeight,
                city: _opt.city,
                type: _opt.type,
                position: _opt.position,
                defaultZoom: _opt.defaultZoom,
                regionZoom: _opt.regionZoom
            });

            this.load = new FCZX.map.Load(_this, _opt.source_url);

            this.list = new FCZX.map.List(_this);

            this.menu = new FCZX.map.Menu(_this, _this.opt.menuOpt);

            _this._resize();

            $(win).resize(function () {
                _this._resize();
            });
        },
        _getHeaderHeight: function () {
            return $(this.opt.navSelector).outerHeight(true) + $(this.opt.menuOpt.menuSelector).outerHeight(true)
        },
        _resize: function () {
            let winHeight = $(win).outerHeight(true);
            this.bMap.setMapHeight(winHeight);
        },
        _getAllParams: function () {
            let mapParams = this.bMap.getMapParams();
            let menuParams = this.menu.getMenuParams();
            return $.extend({}, mapParams, menuParams);
        },
        updateParams: function (params = {}) {
            let _this = this;
            let allParams = $.extend(true, this._getAllParams(), params);
            _this.load._setParamsFetch(allParams);
        },
        setMapCenter: function (zoom, position) {
            this.bMap.setMapCenter(zoom, position);
            this.updateParams();
        },
        updateData: function (result) {
            let listData = [];
            if (this.opt.type != 1) {
                listData = result.list_rows;
            } else {
                listData = result.label_rows;
            }
            this.list.updateListData(listData);
            this.bMap.updateMapDataOverlays(result);
        },
        regionClick: function (region_id) {
            let menuOpt = this.menu.opt;
            let targetRegion = menuOpt.$selectList.find(`${menuOpt.optionS}[data-value=${region_id}]`);
            targetRegion.trigger('click.mapMenuItem', false);
        }
    });
})(window, jQuery);

(function ($) {
    FCZX.globalNamespace('FCZX.map.Load');

    FCZX.map.Load = function (mapIndex, url) {
        this.mapIndex = mapIndex;
        this.url = url;
        this.timestamp = 0;
        this.timer = null;
    }

    $.extend(FCZX.map.Load.prototype, {
        _setParamsFetch: function (params) {
            let _this = this;
            if ($.type(params) !== 'object') {
                return;
            }
            this.timestamp += 1;
            $.extend(params, {
                timestamp: _this.timestamp
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                _this._fetchPromise(_this.url, params);
            }, 200);
        },
        _fetchPromise: function (url, params, callback) {
            let _this = this;
            app.request({
                url: url,
                data: params,
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function (res) {
                    let result = res.data;
                    if ($.type(callback) === 'function') {
                        callback(r);
                    } else {
                        _this.mapIndex.updateData(result);
                    }
                }
            });
        }
    })
})(jQuery);

(function ($) {
    FCZX.globalNamespace('FCZX.map.Menu');

    FCZX.map.Menu = function (mapIndex, opt) {
        this.mapIndex = mapIndex;
        this.keyList = ['fang_area_id', 'fang_house_id', 'fang_building_type', 'fang_room_type', 'fang_renovation_status'];
        this._init(opt);
    }

    $.extend(FCZX.map.Menu.prototype, {
        _init: function (opt) {
            this.opt = {
                switchSelector: '',
                menuSelector: '',
                itemSelector: '',
                selectTextS: '',
                selectListS: '',
                optionS: '',
                city_regions: []
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$switch = $(_opt.switchSelector);
            _opt.$cont = $(_opt.menuSelector);
            _opt.$item = _opt.$cont.find(_opt.itemSelector);
            _opt.$selectList = _opt.$cont.find(_opt.selectListS);

            _opt.$switch.each(function () {
                $(this).hover(function () {
                    $(this).find(_opt.selectListS).show();
                }, function () {
                    $(this).find(_opt.selectListS).hide();
                })
            });
            _opt.$item.each(function () {
                $(this).hover(function () {
                    $(this).find(_opt.selectListS).show();
                }, function () {
                    $(this).find(_opt.selectListS).hide();
                })
            });
            _opt.$selectList.find(_opt.optionS).each(function () {
                $(this).on('click.mapMenuItem', function (event, fromMenu = true) {
                    let text = $(this).text()
                    let id = $(this).attr('id');
                    let value = $(this).data('value');
                    let selectText = $(this).parent().siblings(_opt.selectTextS);
                    let $span = selectText.find('span');
                    let $input = selectText.find('input');
                    if (id) {
                        $span.text(text);
                        $input.val(value);
                        selectText.addClass('actived');
                    } else {
                        $span.text($span.data('name'));
                        $input.val('');
                        selectText.removeClass('actived');
                    }
                    _opt.$selectList.hide();
                    $(this).siblings().removeClass('actived');
                    $(this).addClass('actived');
                    _this._change($(this).parents(_opt.itemSelector).index(), value, fromMenu);
                });
            });
        },
        _change: function (index, value, fromMenu) {
            if (index == 0) {//更新区域值
                let _this = this;
                let indexOpt = _this.mapIndex.opt;
                let position = _this._getPositionById(value);
                if (position) {
                    fromMenu ? _this.mapIndex.setMapCenter(indexOpt.regionZoom, position) : _this.mapIndex.setMapCenter(_this.mapIndex.bMap.map.getZoom() + 1, position);
                } else {
                    _this.mapIndex.setMapCenter(indexOpt.defaultZoom);
                }
                return;
            }
            this._updateParams();
        },
        _getPositionById: function (region_id) {
            let position = {};
            for (const item of this.opt.city_regions) {
                if (item.id == region_id) {
                    position.lng = item.longitude;
                    position.lat = item.latitude;
                    return position;
                }
            }
        },
        getMenuParams: function () {
            let obj = {};
            let param = {};
            for (const key of this.keyList) {
                obj[key] = $(`#${key}`).val() || "";
                param = $.extend({}, param, obj);
            }
            return param;
        },
        _updateParams: function () {
            this.mapIndex.updateParams();
        }
    });

})(jQuery);

(function ($) {
    FCZX.globalNamespace('FCZX.map.List');

    FCZX.map.List = function (mapIndex, opt) {
        this.mapIndex = mapIndex;
        this.scrollInstance = null;
        this._init(opt);
    }

    $.extend(FCZX.map.List.prototype, {
        _init: function (opt) {
            this.opt = {
                scrollId: 'mapListWrap',
                foldSelector: '.fold-btn',
                contSelector: '.map-list-content',
                listSelector: '.map-list',
                itemSelector: '.mli-item',
                emptySelector: '.map-list-empty'
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
            if (!this.scrollInstance) {
                this.scrollInstance = getCustomScrollBarInstance(this.opt.scrollId);
            }
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$foldBtn = $(_opt.foldSelector);
            _opt.$content = $(_opt.contSelector);
            _opt.$empty = $(_opt.emptySelector);
            _opt.$list = $(_opt.contSelector).find(_opt.listSelector);

            _opt.$foldBtn.click(function () {
                let $icon = _opt.$foldBtn.find('i');
                if ($icon.hasClass('open')) {
                    $(this).css('left', 0);
                    $icon.removeClass('open');
                    $icon.addClass('close');
                    _opt.$content.hide();
                } else {
                    $(this).css('left', '420px');
                    $icon.removeClass('close');
                    $icon.addClass('open');
                    _opt.$content.show();
                }
            });
        },
        updateListData: function (listData) {
            let _this = this;
            let _opt = _this.opt;
            let _template = '';
            if (!listData || listData.length <= 0) {
                _opt.$empty.show();
                _opt.$list.html(_template);
                _this.scrollInstance._initSliderHeight();
                return;
            }
            for (const item of listData) {
                _template = _template + _this._generateListHtml(item);
            };
            _opt.$empty.hide();
            _opt.$list.html(_template);
            _this.scrollInstance._initSliderHeight();
        },
        _generateListHtml: function (item) {
            let _this = this;
            let _opt = _this.mapIndex.opt;
            switch (_opt.type) {
                case 1:
                    return `
                    <li class="mli-item clearfix" data-id="${item.id}">
                        <div class="fl">
                            <a class="mli-img" href="/house/${item.alias}/home.html" target="_blank">
                                <img src="${item.image_path}" alt="">
                            </a>
                        </div>
                        <div class="mli-detail fl">
                            <a class="item house-name" href="/house/${item.alias}/home.html" target="_blank">${item.title}</a>
                            <p class="item">
                                <span class="house-price">${item.price}</span>
                                <span class="small-desc">${PRICE_TYPE[item.price_type]}</span>
                            </p>
                            <p class="item desc-color" title="[${item.area.name}]${item.address}">[${item.area.name}]${item.address}</p>
                            <p class="item tags">
                                <span class="sale-status-${item.sale_status}">${SALE_STATUS[item.sale_status]}</span>
                            </p>
                        </div>
                    </li>`
                case 2:
                case 3:
                    let houseRoom = item.fangHouseBuildingRoom
                    return `
                    <li class="mli-item clearfix" data-id="${item.id}">
                        <div class="fl">
                            <a class="mli-img" href="" target="_blank">
                                <img src="${item.image_path}" alt="">
                            </a>
                        </div>
                        <div class="mli-detail fl">
                            <a class="item house-name" href="" target="_blank">${item.title}</a>
                            <p class="item">
                                <span class="mr8">${houseRoom.room}室${houseRoom.office}厅${houseRoom.toilet}卫</span>
                                <span class="mr8">${houseRoom.building_area}㎡</span>
                                <span class="house-price">${item.price}</span>
                                <span class="small-desc">${PRICE_TYPE[item.price_type]}</span>
                            </p>
                            <p class="item desc-color" title="[${item.area.name}]${item.address}">[${item.area.name}]${item.address}</p>
                            <p class="item">
                                <span class="tag">经纪人</span>
                                <span class="text-color">${item.consultant || ''}</span>
                            </p>
                        </div>
                    </li>`
                default: return ''
            }
        }
    });

})(jQuery);

(function ($) {
    FCZX.globalNamespace('FCZX.map.SearchMap');

    FCZX.map.SearchMap = function (mapIndex, opt) {
        this.mapIndex = mapIndex;
        this._init(opt);
    }

    $.extend(FCZX.map.SearchMap.prototype, {
        _init: function (opt) {
            this.map = undefined; //地图实例
            this.point = undefined; //地图中心点
            this.polygon = undefined; //行政区域折线
            this.opt = {
                mapWrapId: 'mapContainer',
                lng: '',
                lat: '',
                defaultZoom: 11,
                regionZoom: 12,
                minZoom: 11,
                maxZoom: 18,
                city: '北京'
            }
            $.extend(true, this.opt, opt || {});
            this._initMap();
        },
        _initMap: function () {
            let _this = this;
            let _opt = _this.opt;
            this.setMapHeight($(window).height());
            this.map = new BMap.Map(_opt.mapWrapId, { enableMapClick: false });
            this.setMapCenter(_opt.defaultZoom, _opt.position); // lng ,lat, zoom
            this.map.addControl(new BMap.NavigationControl()); //地图平移缩放控件
            this.map.setMinZoom(_opt.minZoom);
            this.map.setMaxZoom(_opt.maxZoom);
            this.map.enableScrollWheelZoom(); // 启用地图缩放
            this.map.enableInertialDragging(); // 启用地图惯性拖拽
            this.map.addControl(new BMap.ScaleControl()); // 比例尺控件，默认位于地图左下方，显示地图的比例关系

            this.map.addEventListener('load', function () {
                _this._bindMapEvent();
            })
        },
        _bindMapEvent: function () {
            var func = $.proxy(this._updateParams, this);
            this.map.addEventListener('zoomend', func);
            this.map.addEventListener('moveend', func);
            this.map.addEventListener('dragend', func);
            this.map.addEventListener('resize', func);
        },
        // 更新参数，刷新地图数据
        _updateParams: function () {
            this.map.clearOverlays();
            this.mapIndex.updateParams();
        },
        setMapCenter: function (zoom, position = {}) {
            let point = null;
            if ($.isEmptyObject(position)) {
                this.map.centerAndZoom(this.opt.city, zoom)
            } else {
                point = new BMap.Point(position.lng, position.lat);
                this.map.centerAndZoom(point, zoom);
            }
        },
        setMapHeight: function (winHeight) {
            $(`#${this.opt.mapWrapId}`).height(winHeight - this.opt.headerHeight);
        },
        //获取地图可视范围
        getMapParams: function () {
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
        },
        updateMapDataOverlays: function (result) {
            let _this = this;
            let zoomLevel = _this.map.getZoom();
            this.regions = result.gather_regions;
            this.houseLabels = result.label_rows;
            if (zoomLevel <= _this.opt.regionZoom) {
                _this.addRegionLabels(result.gather_regions);
            } else {
                _this.addHouseLabels(result.label_rows);
            }
        },
        // 根据行政区划绘制边界
        _getBoundary: function (regionName) {
            let _this = this;
            let _map = _this.map;
            let boundary = new BMap.Boundary();
            boundary.get(regionName, function (rs) {
                //行政区域的点有多少个
                if (rs.boundaries.length === 0) {
                    // alert('未能获取当前输入行政区域');
                    return;
                }
                for (const itemBoundary of rs.boundaries) {
                    if (!_this.polygon) {
                        _this.polygon = new BMap.Polygon(itemBoundary, {
                            strokeWeight: 2,
                            strokeColor: "rgb(17,164,60)",
                            fillColor: "rgba(17,164,60, .1)",
                            enableClicking: false
                        }); //建立多边形覆盖物
                        _map.addOverlay(_this.polygon);  //添加覆盖物
                    } else {
                        _this.polygon.setPath(itemBoundary);
                        _map.addOverlay(_this.polygon);  //添加覆盖物
                    }
                    _this.polygon.enableMassClear();
                }
            });
        },
        // 根据行政区划绘制聚合点位
        addRegionLabels: function (dataArr) {
            // 添加marks时先清除之前的覆盖物
            let _this = this;
            _this.map.clearOverlays();
            for (const item of dataArr) {
                _this.addLabel('region', item);
            }

        },
        //绘制详细楼盘点位信息
        addHouseLabels: function (dataArr) {
            let _this = this;
            _this.map.clearOverlays();
            for (const item of dataArr) {
                _this.addLabel('house_label', item);
            }
        },
        addLabel: function (type, data) {
            let _this = this;
            let _thisConfig = this.labelConfig(_this, data)[type];
            let point = new BMap.Point(data.longitude, data.latitude);
            let size = new BMap.Size(_thisConfig.offset.x, _thisConfig.offset.y);
            let label = new BMap.Label(_thisConfig.template, { position: point, offset: size });
            label.setStyle(_thisConfig.style)
            label.setTitle(_thisConfig.title);
            _this.map.addOverlay(label);
            _thisConfig.bindEvent(label);
        },
        labelConfig: function (_this, data) {
            let currentType = _this.opt.type;
            return {
                region: {
                    type: "region",
                    title: data.name,
                    template: `
                    <div class="circle-bubble" data-id="${data.id}">
                        <p class="name">${data.name}</p>
                        <p class="count"><span>${data.count}</span>个${currentType == 1 ? '楼盘' : '小区'}</p>
                    </div>`,
                    style: {
                        width: "92px",  //宽
                        height: "92px", //高度
                        border: "0",  //边
                        background: "rgba(17,164,60,.9)",    //背景颜色
                        borderRadius: "50%",
                        cursor: "pointer"
                    },
                    offset: {
                        x: -65,
                        y: -45
                    },
                    bindEvent: function (label) {
                        // 当鼠标悬停在label上时显示行政区划边界
                        label.addEventListener("mouseover", function () {
                            label.setStyle({ background: "rgba(255,102,0,.9)" }); //修改覆盖物背景颜色
                            var regionName = label.getTitle();
                            _this._getBoundary(regionName);
                        });
                        // 当鼠标离开时在删除边界折线数据
                        label.addEventListener("mouseout", function () {
                            label.setStyle({ background: "rgba(17,164,60,.9)" }); //修改覆盖物背景颜色
                            if (_this.polygon) {
                                _this.map.removeOverlay(_this.polygon);//清除折线数据
                            }
                        });

                        label.addEventListener("click", function () {
                            let currZoom = _this.map.getZoom();
                            if (currZoom <= _this.opt.regionZoom) {
                                _this.mapIndex.regionClick(data.id);
                            } else {
                                _this.map.centerAndZoom(label.point, currZoom + 1);
                            }
                        });
                    }
                },
                house_label: {
                    type: "house_label",
                    title: data.title,
                    template: _this._generateLabelHtml(data),
                    style: {
                        height: "30px", //高度
                        border: "0",  //边
                        padding: "0",  //边
                        backgroundColor: "rgba(17,164,60,.9)",
                        borderRadius: "4px",
                        cursor: "pointer"
                    },
                    offset: {
                        x: -65,
                        y: -45
                    },
                    bindEvent: function (label) {
                        //鼠标点击时打开新标签并关闭上一个标签内容
                        label.addEventListener("mouseover", function () {
                            label.setStyle({ background: "rgba(255,102,0,.9)" });
                        });
                        label.addEventListener("mouseout", function () {
                            label.setStyle({ background: "rgba(17,164,60,.9)" }); //修改覆盖物背景颜色
                        });
                        label.addEventListener("click", function () {
                            if (currentType != 1) {
                                _this.mapIndex.updateParams({ fang_house_id: data.id });
                                _this.mapIndex.opt.loupan = {
                                    id: data.id,
                                    title: data.title
                                };
                            }
                        });
                    }
                }
            }
        },
        _generateLabelHtml: function (data) {
            let loupan = this.mapIndex.opt.loupan || {};
            switch (this.opt.type) {
                case 1:
                    return `
                    <a class="house-bubble" data-id="${data.id}" href="/house/${data.alias}/home.html" target="_blank">
                        <p>
                            <span class="price">${data.price}</span>
                            <span class="unit">${PRICE_TYPE[data.price_type]}</span>
                            <em>|</em>
                            <span class="name">${data.title}</span>
                        </p>
                        <div class="triangle-down"></div>
                    </a>`;
                case 2:
                    return `
                    <div class="house-bubble ${loupan.id == data.id ? 'actived' : ''}" data-id="${data.id}">
                        <p>
                            <span class="price">${data.price}</span>
                            <span class="unit">${PRICE_TYPE[data.price_type]}</span>
                            <em>|</em>
                            <span>123套</span>
                            <em>|</em>
                            <span class="name">${data.title}</span>
                        </p>
                        <div class="triangle-down"></div>
                    </div>`;
                case 3:
                    return `
                    <div class="house-bubble ${loupan.id == data.id ? 'actived' : ''}" data-id="${data.id}">
                        <p>
                            <span>123套</span>
                            <em>|</em>
                            <span class="name">${data.title}</span>
                        </p>
                        <div class="triangle-down"></div>
                    </div>`;
                default:
                    return '';
            }
        }
    });
})(jQuery)