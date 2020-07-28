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
    let albumItemData = {
        'vedio': [
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            }
        ],
        'spt': [
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/860x10000.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/login_bg.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/house_type_1400x1122.png'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/login_bg.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            }
        ],
        'ybj': [
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/house_type_1400x1122.png'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            }
        ],
        'ptt': [
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/sand_900x600c.jpg'
            }
        ]
    };

    // 轮播参数初始化
    let listSelector = '#albumCarouselList';
    let itemSelector = '#albumCarouselList li';
    let imageSelector = '#albumCarouselList img';
    let leftSelector = '#listArrowLeft';
    let rightSelector = '#listArrowRight';
    let showItemCount = 7;
    let stepWidth = 854;
    let itemWidth = 122;
    let moveCondition = -732;
    let listContent = $('#albumCarouselList');
    let listContentParent = $('#albumCarouselContent');

    // 设置新显示的大图及当前的小图
    function setActivedItem(albumItemList, albumImageList, index) {
        let targetItem = albumItemList.eq(index);
        let targetImgSrc = albumImageList.eq(index).attr('src');

        // 设置当前图片并激活样式
        $('#albumShowImage').attr('src', targetImgSrc);
        $('#originalPicture').attr('href', targetImgSrc);
        if (albumItemList.hasClass('actived')) {
            albumItemList.removeClass('actived');
        }
        targetItem.addClass('actived');

        // 计算图片显示
        getImageRealSize(targetImgSrc, function (width, height) {
            let showHeight = (840 / width) * height;
            $('.album-carousel-show').css('height', showHeight);
            let clientHeight = document.documentElement.clientHeight;
            // 80 + 20 + 20 + 20
            if (showHeight + 140 > clientHeight) {
                $('#albumWrap').addClass('album-wrapper');
            } else {
                $('#albumWrap').removeClass('album-wrapper');
            }
        });

        // 子元素与直接上级元素的距离
        let itemPosition = targetItem.position().left;
        //计算当前页
        let currentPage = Math.floor(itemPosition / stepWidth);
        let relativePosition = listContentParent.offset().left - targetItem.offset().left;
        // 计算可视范围内相对偏移量
        if (relativePosition < moveCondition || relativePosition > 0) {
            listContent.css('left', `-${currentPage * stepWidth}px`);
        }
    }


    $('.album-item').each(function () {
        let type = $(this).attr('data-type');
        $(`.album-item[data-type=${type}] .album`).each(function (index) {
            let _this = $(this);
            _this.click(function () {
                let listHtml = '';
                for (const item of albumItemData[type]) {
                    listHtml = listHtml + `<li><img src="${item.imgSrc}" alt=""></li>`;
                }
                $('#albumCarouselList').append(listHtml);

                setActivedItem($('#albumCarouselList li'), $('#albumCarouselList img'), index);

                // 相册导航定位
                $('.album-tabs .tab-item').siblings().removeClass('actived');
                $('.album-tabs').find(`.tab-item[data-type=${type}]`).addClass('actived');

                // 显示大屏相册
                $('#albumFullScreen').show();
                $('html').addClass('modal-open');

                // 相册大图轮播
                albumCarouselEvent(index);

                initAlbumTabsEvent();
            });
        });
    });

    function initAlbumTabsEvent() {
        $('.album-tabs .tab-item').each(function () {
            $(this).on('click.albumtab', function () {
                $('#albumCarouselList').children().remove();
                let albumType = $(this).attr('data-type');
                $(this).siblings().removeClass('actived');
                $(this).addClass('actived');
                let listHtml = '';
                for (const item of albumItemData[albumType]) {
                    listHtml = listHtml + `<li><img src="${item.imgSrc}" alt=""></li>`;
                }
                $('#albumCarouselList').append(listHtml);
                setActivedItem($('#albumCarouselList li'), $('#albumCarouselList img'), 0);
                albumCarouselEvent();
            })
        })
    }

    function albumCarouselEvent(currentIndex = 0) {
        let listItems = $(itemSelector);
        let listImages = $(imageSelector);
        let listItemsCount = listItems.length;

        listItems.each(function (index) {
            let $this = $(this);
            $this.click(function () {
                console.log(index)
                currentIndex = index;
                setCurrentItem(currentIndex);
            });
        });

        $('#showArrowLeft').click(function () {
            if (currentIndex <= 0) {
                alert('已经是第一张了');
                return;
            }
            currentIndex = currentIndex - 1;
            setCurrentItem(currentIndex);
        });

        $('#showArrowRight').click(function () {
            if (currentIndex >= listItemsCount - 1) {
                alert('已经是最后一张了');
                return;
            }
            currentIndex = currentIndex + 1;
            setCurrentItem(currentIndex);
        });

        function setCurrentItem(currentIndex) {
            setActivedItem(listItems, listImages, currentIndex);
        }
    }

    $('#albumCloseBtn').click(function () {
        listContent.css('left', 0);
        listContent.children().remove();
        $('#albumFullScreen').hide();
        $('html').removeClass('modal-open');
    });
});
