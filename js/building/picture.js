$(document).ready(function () {

    // 显示固定标题
    showFixHeader();
    function showFixHeader() {
        let scrollTop = $(document).scrollTop();
        window.addEventListener('scroll', function () {
            scrollTop = $(document).scrollTop();
            if (scrollTop > 200) {
                $('.fix-header').show();
            } else {
                $('.fix-header').hide();
            }
        });
        if (scrollTop > 200) {
            $('.fix-header').show();
        } else {
            $('.fix-header').hide();
        }
    }
    // 显示大屏图片
    let albumData = [
        {
            name: '视频',
            count: 1,
            images: [
                {
                    image_id: '1001',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                }
            ]
        },
        {
            name: '沙盘图',
            count: 3,
            images: [
                {
                    image_id: '2001',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                },
                {
                    image_id: '2002',
                    image_src: '//static.fczx.com/www/assets/images/860x10000.jpg'
                },
                {
                    image_id: '2003',
                    image_src: '//static.fczx.com/www/assets/images/login_bg.jpg'
                }
            ]
        },
        {
            name: '样板间',
            count: 12,
            images: [
                {
                    image_id: '3001',
                    image_src: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
                },
                {
                    image_id: '3002',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                },
                {
                    image_id: '3003',
                    image_src: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
                },
                {
                    image_id: '3004',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                },
                {
                    image_id: '3005',
                    image_src: '//static.fczx.com/www/assets/images/860x10000.jpg'
                },
                {
                    image_id: '3006',
                    image_src: '//static.fczx.com/www/assets/images/login_bg.jpg'
                },
                {
                    image_id: '3007',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                },
                {
                    image_id: '3008',
                    image_src: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
                },
                {
                    image_id: '3009',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                },
                {
                    image_id: '3010',
                    image_src: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
                },
                {
                    image_id: '3011',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                },
                {
                    image_id: '3012',
                    image_src: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
                }
            ]
        },
        {
            name: '配套图',
            count: 2,
            images: [
                {
                    image_id: '4001',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                },
                {
                    image_id: '4002',
                    image_src: '//static.fczx.com/www/assets/images/login_bg.jpg'
                }
            ]
        }
    ];

    let albumInstance = new FCZX.album.AlbumIndex({ albumData });

    $('#albumCloseBtn').click(function () {
        albumInstance.closeModal();
    });
});

// 相册模态框创建
(function ($) {
    FCZX.globalNamespace('FCZX.album.AlbumIndex');

    FCZX.album.AlbumIndex = function (opt) {
        this._init(opt);
    }
    $.extend(FCZX.album.AlbumIndex.prototype, {
        _init: function (opt) {
            this.opt = {
                albumData: null,
                albumList: $('.album-item').find('.album'),
                albumTabInstance: null,
                albumModal: $('#albumFullScreen')
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
        },
        _initDomEvent: function () {
            let _this = this;
            let albumData = _this.opt.albumData;
            let albumList = _this.opt.albumList;
            let albumModal = _this.opt.albumModal;
            let albumTabInstance = _this.opt.albumTabInstance;

            albumList.each(function () {
                $(this).on('click.album', function () {
                    let image_id = $(this).attr('image-id');
                    let { tabIndex, imgIndex } = _this.getAlbumIndex(albumData, image_id);
                    if (!albumTabInstance) {
                        albumTabInstance = new FCZX.album.AlbumTab({
                            albumData,
                            tabIndex,
                            imgIndex,
                            tabSelector: '.album-tabs .tab-item',
                            showOpt: {
                                maxWidth: 840,
                                overHeightClass: 'album-wrapper',
                                wrapSelector: '#albumWrap',
                                showSelector: '.album-carousel-show',
                                imgSelector: '#albumShowImage',
                                oriSelector: '#originalPicture',
                                leftSelector: '#showArrowLeft',
                                rightSelector: '#showArrowRight',
                            },
                            listOpt: {
                                listSelector: '#albumCarouselList',
                                itemSelector: '#albumCarouselList li',
                                leftSelector: '#listArrowLeft',
                                rightSelector: '#listArrowRight',
                                showItemCount: 7
                            }
                        });
                        _this.opt.albumTabInstance = albumTabInstance;
                    }
                    albumTabInstance.opt.$tab.eq(tabIndex).trigger('click.album', true);
                    albumTabInstance.setActivedItem(imgIndex);
                    albumModal.show();
                    $('html').addClass('modal-open');
                });
            });
        },
        closeModal: function () {
            let _this = this;
            let albumTabOpt = _this.opt.albumTabInstance.opt;
            albumTabOpt.tabIndex = 0;
            albumTabOpt.imgIndex = 0;
            albumTabOpt.listCarousel.$list.css('left', 0)
            _this.opt.albumModal.hide();
            $('html').removeClass('modal-open');
        },
        /*通过图片id获取图片在相册中的位置*/
        getAlbumIndex: function (albumData, image_id) {
            let imgIndex, tabIndex = 0;
            for (let i = 0; i < albumData.length; i++) {
                let images = albumData[i].images;
                for (let j = 0; j < images.length; j++) {
                    if (images[j].image_id == image_id) {
                        imgIndex = j;
                        tabIndex = i;
                        break;
                    }
                }
            }
            return { tabIndex, imgIndex };
        }
    });
})(jQuery);

// 相册分类创建
(function ($) {
    FCZX.globalNamespace('FCZX.album.AlbumTab');

    FCZX.album.AlbumTab = function (opt) {
        this._init(opt);
    }

    $.extend(FCZX.album.AlbumTab.prototype, {
        _init: function (opt) {
            this.opt = {
                albumData: null,
                tabIndex: 0,
                imgIndex: 0,
                tabSelector: '',
                showOpt: null,
                listOpt: null
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$tab = $(_opt.tabSelector);
            _opt.$showImg = $(_opt.showOpt.imgSelector);
            _opt.$showOri = $(_opt.showOpt.oriSelector);
            _opt.$showWrap = $(_opt.showOpt.showSelector);
            _opt.$showLeft = $(_opt.showOpt.leftSelector);
            _opt.$showRight = $(_opt.showOpt.rightSelector);
            _opt.$albumWrap = $(_opt.showOpt.wrapSelector);
            _opt.listCarousel = new FCZX.Switch(_opt.listOpt);

            _opt.$tab.each(function (index) {
                $(this).on('click.album', function (event, auto) {
                    _opt.$tab.not($(this)).removeClass('actived');
                    $(this).addClass('actived');
                    _this._createAlbum(index);
                    if (auto) return; //自动触发
                    _this.setActivedItem(0);
                    _opt.listCarousel.$list.css('left', 0); // todo:统一计算移动位置位置
                });
            });
        },
        _createAlbum: function (index) {
            let _this = this;
            let _opt = _this.opt;
            let currAlbumData = _opt.albumData[index];
            let listHtml = '';
            for (const item of currAlbumData.images) {
                listHtml = listHtml + `<li><img src="${item.image_src}" alt=""></li>`;
            }
            _opt.listCarousel.$list.html(listHtml);
            _opt.listCarousel = new FCZX.Switch(_opt.listOpt);
            _this._itemEventHandler();
            _this._showEventHandler();
        },
        _itemEventHandler: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.listCarousel.$item.each(function (index) {
                $(this).on('click.albumItem', function () {
                    _this.setActivedItem(index);
                });
            })
        },
        // 抽出独立函数
        _showEventHandler: function () {
            let _this = this;
            let _opt = _this.opt;
            let listItemsCount = _opt.listCarousel.$item.length;

            _opt.$showLeft.off('click.albumShow').on('click.albumShow', function () {
                console.log(_opt.imgIndex)
                if (_opt.imgIndex <= 0) {
                    alert('已经是第一张了');
                    return;
                }
                _opt.imgIndex = _opt.imgIndex - 1;
                _this.setActivedItem(_opt.imgIndex);
            });

            _opt.$showRight.off('click.albumShow').on('click.albumShow', function () {
                console.log(_opt.imgIndex)
                if (_opt.imgIndex >= listItemsCount - 1) {
                    alert('已经是最后一张了');
                    return;
                }
                _opt.imgIndex = _opt.imgIndex + 1;
                _this.setActivedItem(_opt.imgIndex);
            });
        },
        _changeImgSrc: function (index) {
            let _this = this;
            let _opt = _this.opt;
            let $img = _opt.listCarousel.$item.eq(index).find('img');
            let imgSrc = $img.attr('src')
            _opt.$showImg.attr('src', imgSrc);
            _opt.$showOri.attr('href', imgSrc);
            _this._changeHeight(imgSrc);
        },
        _changeHeight: function (targetImgSrc) {
            let _this = this;
            let _opt = _this.opt;
            // 计算图片显示
            getImageRealSize(targetImgSrc, function (width, height) {
                let showImgHeight = (_opt.showOpt.maxWidth / width) * height;
                _opt.$showWrap.css('height', showImgHeight);
                let clientHeight = document.documentElement.clientHeight;
                // 80 + 20 + 20 + 20
                if (showImgHeight + 140 > clientHeight) {
                    _opt.$albumWrap.addClass(_opt.showOpt.overHeightClass);
                } else {
                    _opt.$albumWrap.removeClass(_opt.showOpt.overHeightClass);
                }
            });
        },
        setActivedItem: function (currentIndex) {
            let _this = this;
            let _opt = _this.opt;
            let $item = _opt.listCarousel.$item;
            _this._changeImgSrc(currentIndex);

            if ($item.hasClass('actived')) {
                $item.removeClass('actived');
            }
            $item.eq(currentIndex).addClass('actived');
            _opt.imgIndex = currentIndex;
        }
    });
})(jQuery);

(function ($) {
    FCZX.globalNamespace('FCZX.Switch');

    FCZX.Switch = function (opt) {
        this._init(opt)
    }

    $.extend(FCZX.Switch.prototype, {
        isMoveOver: true, //是否完成位移
        _init: function (opt) {
            let _this = this;
            _this.opt = {
                listSelector: '', //轮播列表选择器
                itemSelector: '', //轮播列表项选择器
                leftSelector: '', //左轮播按钮选择器
                rightSelector: '', //右轮播按钮选择器
                pointItemWidth: 0, //轮播判断点
                showItemCount: 5, //显示轮播个数
                arrowDisClass: 'arrow-disabled'
            }
            $.extend(true, _this.opt, opt || {});
            _this._initDomEvent();
            return _this;
        },
        _initDomEvent: function () {
            let _this = this;
            let opt = this.opt;
            this.$list = $(opt.listSelector);
            this.$item = $(opt.itemSelector);
            this.$left = $(opt.leftSelector);
            this.$right = $(opt.rightSelector);

            opt.totalItemCount = this.$item.length;
            opt.itemWidth = this.$item.outerWidth(true);
            opt.stepWidth = opt.itemWidth * opt.showItemCount;

            _this._initListWith();

            if (opt.totalItemCount <= opt.showItemCount) {
                this.$left.addClass(opt.arrowDisClass);
                this.$right.addClass(opt.arrowDisClass);
            } else {
                this.$left.removeClass(opt.arrowDisClass);
                this.$right.removeClass(opt.arrowDisClass);
            }

            //默认整块轮播
            if (opt.pointItemWidth === 0) {
                opt.pointItemWidth = (1 - this.getTotalPage(opt.totalItemCount)) * opt.stepWidth;
            }

            this.$left.off('click.switch').on('click.switch', function () {
                if (_this.$left.hasClass(opt.arrowDisClass)) return;
                if (!_this.isMoveOver) return;
                _this.isMoveOver = false;
                _this._movePrev(opt);
            });

            this.$right.off('click.switch').on('click.switch', function () {
                if (_this.$right.hasClass(opt.arrowDisClass)) return;
                if (!_this.isMoveOver) return;
                _this.isMoveOver = false;
                _this._moveNext(opt);
            });
        },
        _initListWith: function () {
            let opt = this.opt;
            this.$list.css('width', opt.itemWidth * opt.totalItemCount);
        },
        _initListLeft: function () {
            this.$list.css('left', 0);
        },
        _movePrev: function (opt) {
            let _this = this;
            let $list = _this.$list;
            let itemLeft = parseInt($list.css('left'));
            if (itemLeft === 0) {
                $list.animate({ left: `${opt.pointItemWidth}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            } else {
                let newItemLeft = itemLeft + opt.stepWidth;
                $list.animate({ left: `${newItemLeft}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            }
            return _this;
        },
        _moveNext: function (opt) {
            let _this = this;
            let $list = _this.$list;
            let itemLeft = parseInt($list.css('left'));
            if (itemLeft === opt.pointItemWidth) {
                $list.animate({ left: 0 }, 300, function () {
                    _this.isMoveOver = true;
                });
            } else {
                let newItemLeft = itemLeft - opt.stepWidth;
                $list.animate({ left: `${newItemLeft}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            }
            return _this;
        },
        getTotalPage: function () {
            let totalPage = 0;
            let opt = this.opt;
            totalPage = Math.ceil(opt.totalItemCount / opt.showItemCount);
            return totalPage;
        },
        movePosition: function (index) {
            let opt = this.opt;
            let targetItem = opt.$item.eq(index);
            // 子元素与直接上级元素的距离
            let itemPosition = targetItem.position().left;
            //计算当前页
            let currentPage = Math.floor(itemPosition / opt.stepWidth);
            let relativePosition = opt.$list.parent().offset().left - targetItem.offset().left;
            // 计算可视范围内相对偏移量
            if (relativePosition < moveCondition || relativePosition > 0) {
                opt.$list.css('left', `-${currentPage * opt.stepWidth}px`);
            }
        }
    })
})(jQuery);
