$(document).ready(function () {

    // 显示固定标题
    showFixHeader(200);

    // 显示大屏图片
    let albumData = [
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
            count: 3,
            images: [
                {
                    image_id: '4001',
                    image_src: '//static.fczx.com/www/assets/images/login_bg.jpg'
                },
                {
                    image_id: '4002',
                    image_src: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
                },
                {
                    image_id: '4003',
                    image_src: '//static.fczx.com/www/assets/images/login_bg.jpg'
                }
            ]
        }
    ];

    let albumInstance = new FCZX.album.AlbumIndex({ albumData });

    $('#albumCloseBtn').click(function () {
        albumInstance.closeModal();
    });

    // 视频播放

    $('.album-item').find('.album-video').each(function (index) {
        $(this).click(function () {
            let videoSrc = $(this).attr('data-video');
            let imgSrc = $(this).find('img').attr('src');
            let $video = $('.video-player').find('video');
            $video.attr('src', videoSrc);
            $video.attr('poster', imgSrc);
            $('#albumVideoModal').show();
        });
    });

    $('#albumVideoCloseBtn').click(function () {
        $('.video-player').find('video').trigger('pause');
        $('#albumVideoModal').hide();
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
            this._tabLoopPlayer();
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            let albumData = _opt.albumData;
            let albumList = _opt.albumList;
            let albumModal = _opt.albumModal;
            let albumTabInstance = _opt.albumTabInstance;

            albumList.each(function () {
                $(this).on('click.album', function () {
                    if ($(this).hasClass('album-others')) {
                        return;
                    }
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
                                arrowDisClass: 'arrow-disabled',
                                showItemCount: 7
                            }
                        });
                        _opt.albumTabInstance = albumTabInstance;
                    }
                    _opt.albumTabInstance.opt.$tab.eq(tabIndex).trigger('click.album', true);
                    _opt.albumTabInstance.setActivedItem(imgIndex);
                    setTimeout(function () {
                        _opt.albumTabInstance._movePosition(imgIndex);
                    }, 100);
                    albumModal.show();
                    $('html').addClass('modal-open');
                });
            });
        },
        _tabLoopPlayer: function () {
            let curTabIndex = 0;
            let loopPrev = $('#showArrowLeft');
            let loopNext = $('#showArrowRight');
            let loopTabCont = $('.album-tabs');
            let loopTab = loopTabCont.find('.tab-item');
            let loopTabLen = loopTab.length - 1;

            loopPrev.off('click.loopPrev').on('click.loopPrev', function () {
                let currentTab = loopTabCont.find('.actived');
                curTabIndex = loopTab.index(currentTab);
                if (loopPrev.hasClass('arrow-disabled')) {
                    setTimeout(function () {
                        loopPrev.removeClass('arrow-disabled');
                        currentTab.prev().click();
                        if (curTabIndex == 0) {
                            loopTab.eq(loopTabLen).click();
                        }
                    }, 100);
                }
            });

            loopNext.off('click.loopNext').on('click.loopNext', function () {
                let currentTab = loopTabCont.find('.actived');
                curTabIndex = loopTab.index(currentTab);

                if (loopNext.hasClass('arrow-disabled')) {
                    setTimeout(function () {
                        loopNext.removeClass('arrow-disabled');
                        currentTab.next().click();
                        if (curTabIndex == loopTabLen) {
                            loopTab.eq(0).click();
                        }
                    }, 100)

                }
            });

        },
        /*通过图片id获取图片在相册中的位置*/
        getAlbumIndex: function (albumData, image_id) {
            let imgIndex = 0;
            let tabIndex = 0;
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
        },
        closeModal: function () {
            let _this = this;
            let _opt = _this.opt;
            let albumTabOpt = _opt.albumTabInstance.opt;
            albumTabOpt.tabIndex = 0;
            albumTabOpt.imgIndex = 0;
            albumTabOpt.listCarousel._initListLeft();
            _opt.albumModal.hide();
            $('html').removeClass('modal-open');
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
                    _opt.listCarousel._initListLeft();
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
            _opt.$showWrap.find('.album-text').text(`${currAlbumData.name}`);

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
        _showEventHandler: function () {
            let _this = this;
            let _opt = _this.opt;
            let itemLen = _opt.listCarousel.$item.length - 1;

            _opt.$showLeft.off('click.albumShow').on('click.albumShow', function () {
                if (_opt.imgIndex <= 0) {
                    _opt.$showLeft.addClass('arrow-disabled');
                    _opt.$showLeft.trigger('click.loopPrev');
                    return;
                }
                _opt.imgIndex = _opt.imgIndex - 1;
                _this.setActivedItem(_opt.imgIndex);
                _this._movePosition(_opt.imgIndex);
            });

            _opt.$showRight.off('click.albumShow').on('click.albumShow', function () {
                if (_opt.imgIndex >= itemLen) {
                    _opt.$showRight.addClass('arrow-disabled');
                    _opt.$showRight.trigger('click.loopNext');
                    return;
                }
                _opt.imgIndex = _opt.imgIndex + 1;
                _this.setActivedItem(_opt.imgIndex);
                _this._movePosition(_opt.imgIndex);
            });
        },
        _movePosition: function (index) {
            let _this = this;
            let _opt = _this.opt;
            let $list = _opt.listCarousel.$list;
            let targetItem = _opt.listCarousel.$item.eq(index);
            let stepWidth = _opt.listCarousel.opt.stepWidth;
            let movePosition = _opt.listCarousel.opt.movePosition;
            // 子元素与直接上级元素的距离
            let itemPosition = targetItem.position().left;
            //计算当前页
            let currentPage = Math.floor(itemPosition / stepWidth);
            let relativePosition = $list.parent().offset().left - targetItem.offset().left;
            // 计算可视范围内相对偏移量
            if (relativePosition < movePosition || relativePosition > 0) {
                $list.stop().animate({ left: `-${currentPage * stepWidth}px` }, 300);
            }
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
