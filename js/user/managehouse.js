(function ($) {
    FCZX.globalNamespace('FCZX.user.HouseList');

    FCZX.user.HouseList = function (opt) {
        this._init(opt);
    }
    $.extend(FCZX.user.HouseList.prototype, {
        _init: function (opt) {
            this.opt = {
                emptyS: '.empty-container',
                houseContentS: '.house-content',
                houseListS: '.house-list',
                houseItemS: '.house-item',
                deleteS: '.delete',
                delete_url: '',
                type: ''
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$empty = $(_opt.emptyS);
            _opt.$houseContent = $(_opt.houseContentS);
            _opt.$houseList = $(_opt.houseListS);
            _this._initHouseItemEvent();
        },
        _initHouseList: function () {
            let _this = this;
            let _opt = _this.opt;
            app.request({
                // url: _opt.source_url,
                url: 'http://xiangyang.fczx.com/api/user/house',
                data: {
                    type: _opt.type
                },
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function ({ data }) {
                    if (!data || data.length <= 0) {
                        _opt.$houseContent.hide();
                        _opt.$empty.show();
                        return;
                    }
                    let _itemHtml = '';
                    for (const item of data) {
                        _itemHtml = _itemHtml + ``;
                    }
                    _opt.$empty.hide();
                    _opt.$houseContent.show();
                    _opt.$houseList.html(_itemHtml);
                    _this._initHouseItemEvent();
                }
            });
        },
        _initHouseItemEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$houseContent.find(_opt.deleteS).each(function () {
                let $delete = $(this);
                let dataId = $delete.parent().data('id');
                $delete.click(function () {
                    $.MsgModal.Confirm('提示', '确定要删除该房源信息吗？', function () {
                        $delete.parents(_opt.houseItemS).remove();
                        let listLen = _opt.$houseList.find(_opt.houseItemS).length;
                        if (listLen == 0) {
                            _opt.$houseContent.hide();
                            _opt.$empty.show();
                        }
                    });
                });
            });
        },
        _deleteHouseItem: function(id) {
            let _this = this;
            let _opt = _this.opt;
            app.request({
                url: _opt.delete_url,
                data: {
                    id,
                    type: _opt.type
                },
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function () {
                }
            });
        }
    });
})(jQuery)