$(document).ready(function () {

    new FCZX.list.Filter({
        filterSelecor: '#bubbleFilter',
        itemSelector: '.item-a',
        tabSelector: '.data-tab',
        tabDataSelector: '.data-tab-item',
        selectSelector: '.select-filter'
    });

    // 新楼盘免费订阅
    $('#subscribHouseBtn').click(function () {
        let modalParams = {
            title: '订阅信息',
            message: '我们将为您保密个人信息！请填写您接收订阅的姓名及手机号码',
            okText: '立即订阅'
        }
        $.FormModal.userForm(modalParams);
    });
});

(function ($) {
    FCZX.globalNamespace('FCZX.list.Filter');

    FCZX.list.Filter = function (opt) {
        this._init(opt);
    }
    $.extend(FCZX.list.Filter.prototype, {
        _init: function (opt) {
            this.opt = {
                filterSelecor: '#bubbleFilter',
                itemSelector: '.item-a',
                tabSelector: '.data-tab', //扩展可能会有多个
                tabDataSelector: '.data-tab-item',
                selectSelector: '.select-filter'
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$filter = $(_opt.filterSelecor);
            _opt.$item = $(`${_opt.filterSelecor} ${_opt.itemSelector}`);
            _opt.$tab = $(_opt.tabSelector);
            _opt.$tabData = $(_opt.tabDataSelector);

            _this._initDomStatus();
            _this._tabShowEvent(_opt.$tab, _opt.$tabData);

            _opt.$filter.find(_opt.selectSelector).each(function () {
                $(this).hover(function () {
                    $(this).find('.select-list').show();
                }, function () {
                    $(this).find('.select-list').hide();
                })
            })

            _opt.$filter.click(function (event) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
                let target = event.target || event.srcElement;
                let tagName = event.target.tagName;
                let $target = $(target);

                if (tagName == 'SPAN') { return };

                if ($target.hasClass('filter-clear-all')) {
                    window.location.href = $target.attr('href');
                    return
                }
                if ($target.hasClass('multi-item')) {
                    _this._multiSelectItem($target);
                }
                else if ($target.parent().hasClass('multi-item')) {
                    _this._multiSelectItem($target.parent());
                }
                else if ($target.parent().hasClass('data-tab-item')) {
                    let switchs = []
                    for (let i = 0; i < $('.data-tab-item').length; i++) {
                        switchs.push($('.data-tab-item').eq(i).find('.item-a').eq(0).data('type'))
                    }
                    _this._switchSelectItem($target, switchs);
                }
                else {
                    _this._singleSelectItem($target);
                }
            });
        },
        _initDomStatus: function () {
            let _this = this;
            let _opt = _this.opt;
            let dataUrl = window.location.search;
            let urlParams = transferUrlParam(dataUrl);
            _opt.$item.each(function () {
                let $this = $(this);
                $this.attr('data-url', dataUrl);
                let dataId = $this.data('id');
                let dataType = $this.data('type');
                let activedId = urlParams[dataType];
                if (!activedId) {
                    $(`${_opt.itemSelector}[data-type=${dataType}]`).eq(0).addClass('actived');
                } else {
                    if ($this.hasClass('multi-item')) {
                        for (const itemId of activedId.split(',')) {
                            if (dataId == itemId) {
                                $this.addClass('actived');
                            }
                        }
                    } else if ($this.parent().hasClass('data-tab-item')) {
                        if (dataId == activedId) {
                            $this.addClass('actived');
                            if (!$this.parent().is(":visible")) {
                                let index = $('.data-tab-item').index($this.parent());
                                $('.data-tab').removeClass('actived');
                                $('.data-tab').eq(index).addClass('actived');
                                $('.data-tab-item').hide();
                                $this.parent().show();
                            }
                        }
                    } else if ($this.parent().hasClass('select-list')) {
                        if (dataId == activedId) {
                            let selectStatus = $this.parent().siblings();
                            selectStatus.find('span').text($this.text());
                            selectStatus.find('input').val(dataId);
                            $this.addClass('actived');
                        }
                    } else {
                        if (dataId == activedId) {
                            $this.addClass('actived');
                        }
                    }
                }
            })
        },
        _singleSelectItem: function ($target) {
            let _this = this;
            let dataId = $target.data('id');
            let dataType = $target.data('type');
            let dataUrl = $target.data('url');
            let urlParamObj = transferUrlParam(dataUrl);
            if (!dataType) {
                return
            }
            if (dataId == 'all') {
                delete urlParamObj[dataType];
            } else {
                urlParamObj[dataType] = dataId;
            }
            let newDataUrl = toUrlParam(urlParamObj);
            _this._setDataUrl(newDataUrl);
        },
        _multiSelectItem: function ($target) {
            let _this = this;
            let dataId = $target.data('id');
            let dataType = $target.data('type');
            let dataUrl = $target.data('url');
            let urlParamObj = transferUrlParam(dataUrl);
            let currUrlParam = urlParamObj[dataType];

            if (currUrlParam) {
                let paramList = currUrlParam.split(',');
                let index = paramList.indexOf(`${dataId}`);
                if (index > -1) {
                    paramList.splice(index, 1);
                    if (paramList.length <= 0) {
                        delete urlParamObj[dataType];
                    } else {
                        urlParamObj[dataType] = paramList.sort().join(',');
                    }
                } else {
                    paramList.push(`${dataId}`);
                    urlParamObj[dataType] = paramList.sort().join(',');
                }
            } else {
                urlParamObj[dataType] = dataId;
            }
            let newDataUrl = toUrlParam(urlParamObj);
            _this._setDataUrl(newDataUrl);
        },
        _switchSelectItem: function ($target, switchs) {
            let _this = this;
            let dataId = $target.data('id');
            let dataType = $target.data('type');
            let dataUrl = $target.data('url');
            let urlParamObj = transferUrlParam(dataUrl);
            for (const item of switchs) {
                delete urlParamObj[item];
            }
            if (dataId != 'all') {
                urlParamObj[dataType] = dataId;
            }
            let newDataUrl = toUrlParam(urlParamObj);
            _this._setDataUrl(newDataUrl);
        },
        _setDataUrl: function (dataUrl) {
            let _this = this;
            let _opt = _this.opt;
            _opt.$item.data('url', dataUrl);
            window.location.href = `http://${window.location.host}${window.location.pathname}${dataUrl}`;
        },
        _tabShowEvent: function (tab, tabData) {
            tab.on('mouseenter', function () {
                $(this).siblings().removeClass('actived');
                $(this).addClass('actived');
                let index = $(this).index();
                tabData.hide();
                tabData.eq(index).show();
            });
        }
    })
})(jQuery);