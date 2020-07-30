/*模块轮播*/

(function (win) {
    function CustomCarousel(params) {
        this._init(params)
    }

    $.extend(CustomCarousel.prototype, {
        isMoveOver: true, //是否完成位移
        _init: function (params) {
            let _this = this;
            _this.params = {
                listSelector: '', //轮播列表选择器
                itemSelector: '', //轮播列表选择器
                leftSelector: '', //左轮播按钮选择器
                rightSelector: '', //右轮播按钮选择器
                itemWidth: 0, //每个轮播的宽度
                stepWidth: 0, //每次轮播步长
                pointItemWidth: 0, //轮播判断点
                showItemCount: 5, //显示轮播个数
                initHiddenArrow: true, //左右按钮（初始化）是否显示
            }
            $.extend(true, _this.params, params || {});
            _this._initDomEvent();
            return _this;
        },
        _initDomEvent: function () {
            let _this = this;
            let params = this.params;
            this.$list = $(params.listSelector);
            this.$item = $(params.itemSelector);
            this.$left = $(params.leftSelector);
            this.$right = $(params.rightSelector);
            let totalItemCount = this.$item.length;
            _this._initListWith(totalItemCount);

            //默认整块轮播
            if (params.pointItemWidth === 0) {
                params.pointItemWidth = (1 - this.getTotalPage(totalItemCount)) * params.stepWidth;
            }

            if (params.initHiddenArrow) {
                this._showArrow(totalItemCount);
            }

            this.$left.off('click.caroussel').on('click.caroussel', function () {
                if (!_this.isMoveOver) return;
                _this.isMoveOver = false;
                _this._movePrev(params);
            });

            this.$right.off('click.caroussel').on('click.caroussel', function () {
                if (!_this.isMoveOver) return;
                _this.isMoveOver = false;
                _this._moveNext(params);
            });
        },
        _initListWith: function (totalItemCount) {
            let params = this.params;
            this.$list.css('width', totalItemCount * params.itemWidth);
        },
        _initListLeft: function () {
            this.$list.css('left', 0);
        },
        _showArrow: function (totalItemCount) {
            let _this = this;
            let params = _this.params;
            //如果总的轮播个数大于显示的轮播个数就显示arrow
            if (totalItemCount > params.showItemCount) {
                _this.$left.show();
                _this.$right.show();
            } else {
                _this.$left.hide();
                _this.$right.hide();
            }
        },
        _movePrev: function (params) {
            let _this = this;
            let $list = _this.$list;
            let itemLeft = parseInt($list.css('left'));
            if (itemLeft === 0) {
                $list.animate({ left: `${params.pointItemWidth}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            } else {
                let newItemLeft = itemLeft + params.stepWidth;
                $list.animate({ left: `${newItemLeft}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            }
            return _this;
        },
        _moveNext: function (params) {
            let _this = this;
            let $list = _this.$list;
            let itemLeft = parseInt($list.css('left'));
            if (itemLeft === params.pointItemWidth) {
                $list.animate({ left: 0 }, 300, function () {
                    _this.isMoveOver = true;
                });
            } else {
                let newItemLeft = itemLeft - params.stepWidth;
                $list.animate({ left: `${newItemLeft}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            }
            return _this;
        },
        getTotalPage: function (totalItemCount) {
            let totalPage = 0;
            let params = this.params;
            totalPage = Math.ceil(totalItemCount / params.showItemCount);
            return totalPage;
        }
    })
    win.CustomCarousel = CustomCarousel;
})(window);