(function (win, doc, $) {
    function CustomScrollBar(options) {
        this._init(options);
    }
    $.extend(CustomScrollBar.prototype, {
        // this -> CustomScrollBar
        _init: function (options) {
            let _this = this;
            _this.options = {
                scrollDir: 'y', //滚动方向
                contentSelector: '', //滚动内容区选择器（样式带有overflow为hidden的）
                sliderSelector: '',  //滚水滑块选择器
                barSeletor: '', //滚动条选择器
                wheelStep: 10 //滚轮步长
            }
            $.extend(true, _this.options, options || {}); //深拷贝的方式合并两个对象
            _this._initDomEvent();
            return _this;
        },
        _initSliderHeight: function () {
            let _this = this;
            let sliderHeight;
            let contentHeight = _this.$scrollContent.height();
            let contentTotalHeight = _this.$scrollContent[0].scrollHeight;
            let offsetHeight = contentTotalHeight - contentHeight;
            if (offsetHeight <= 0) {
                sliderHeight = 0;
            } else {
                sliderHeight = contentHeight  * contentHeight / contentTotalHeight
            }
            _this.$scrollSlider.height(`${sliderHeight}px`);
            return _this;
        },
        _initDomEvent: function () {
            let opts = this.options;
            // 获取相应Jquery对象
            this.$scrollContent = $(opts.contentSelector);
            this.$scrollSlider = $(opts.sliderSelector);
            this.$scrollBar = opts.barSeletor ? $(opts.barSeletor) : _this.$scrollSlider.parent();
            this.$doc = $(doc);
            this._initSliderHeight();
            this._initSliderDragEvent();
            this._bindMousewheel();
            this._bindContentScroll();
        },
        _initSliderDragEvent: function () {
            let _this = this;
            let slider = _this.$scrollSlider;
            let sliderElement = slider[0];
            if (sliderElement) {
                let doc = _this.$doc;
                let startScrollTop;
                let startPagePosition;
                let contentBarRate;
                function mousemoveHandler(sliderEvent) {
                    event.preventDefault();
                    //判断是否按下鼠标
                    if (startPagePosition == null) {
                        return;
                    }
                    // 内容可移动距离/滑块可移动距离 = 内容移动距离/滑块移动距离
                    let endPagePosition = sliderEvent.pageY
                    let sliderMoveDistance = endPagePosition - startPagePosition;
                    let contentMoveDistance = contentBarRate * sliderMoveDistance;
                    let endScrollTop = startScrollTop + contentMoveDistance;
                    _this.scrollTo(endScrollTop);
                }
                slider.on('mousedown', function (sliderEvent) {
                    sliderEvent.preventDefault();
                    startPagePosition = sliderEvent.pageY; //clientY
                    //获取可视区Top到移出可视区Top的距离
                    startScrollTop = _this.$scrollContent.scrollTop();
                    //获取内容可滚动高度与滑块可滚动高度比率
                    contentBarRate = _this.getContentMaxMovableDistance() / _this.getSliderMaxMovableDistance();
                    //.scroll命名空间，防止停止doc事件
                    doc.on('mousemove.scroll', mousemoveHandler)
                        .on('mouseup.scroll', function () {
                            doc.off('.scroll');
                        })
                });
            }
            return _this;
        },
        //监听滚动内容，同步滑块位置
        _bindContentScroll: function () {
            let _this = this;
            _this.$scrollContent.on('scroll', function () {
                let sliderElement = _this.$scrollSlider && _this.$scrollSlider[0];
                if (sliderElement) {
                    sliderElement.style.top = _this.getSliderPosition() + 'px';
                }
            })
            return _this;
        },
        //监听滚轮事件
        _bindMousewheel: function () {
            let _this = this;
            let scrollContent = _this.$scrollContent;
            scrollContent.bind('mousewheel DOMMouseScroll', function (contentEvent) {
                contentEvent.preventDefault();
                let originEvent = contentEvent.originalEvent;
                //滚动幅度：wheelDelta 其他浏览器120， Firefox:3
                let wheelRange = originEvent.wheelDelta ? -originEvent.wheelDelta / 120 : (originEvent.detail || 0) / 3;
                let startScrollTop = scrollContent.scrollTop();
                let wheelMoveDistance = wheelRange * _this.options.wheelStep;
                _this.scrollTo(startScrollTop + wheelMoveDistance);
            });
            return _this;
        },
        //计算当前滑块位置
        getSliderPosition: function () {
            let _this = this;
            // 滑块移动距离/滑块可移动距离 = 内容移动距离/内容可移动距离
            let sliderMaxMovableDistance = _this.getSliderMaxMovableDistance();
            let contentMaxMovableDistance = _this.getContentMaxMovableDistance();
            let contentMoveDistance = _this.$scrollContent.scrollTop();
            let sliderMoveDistance = sliderMaxMovableDistance * contentMoveDistance / contentMaxMovableDistance;
            return Math.min(sliderMaxMovableDistance, sliderMoveDistance)
        },
        //获取内容可滚动高度 = 内容总高度 - 内容可视区高度
        getContentMaxMovableDistance: function () {
            let _this = this;
            let contentHeight = _this.$scrollContent.height();
            let contentTotalHeight = _this.$scrollContent[0].scrollHeight;
            return Math.max(contentHeight, contentTotalHeight) - contentHeight
        },
        // 获取滑块可移动高度 = 滚动条高度 - 滑块高度
        getSliderMaxMovableDistance: function () {
            let _this = this;
            let barHeight = _this.$scrollBar.height();
            let sliderHeight = _this.$scrollSlider.height();
            return barHeight - sliderHeight;
        },
        scrollTo: function (endScrollTop) {
            let _this = this;
            _this.$scrollContent.scrollTop(endScrollTop);
        }
    })
    win.CustomScrollBar = CustomScrollBar;
})(window, document, jQuery);