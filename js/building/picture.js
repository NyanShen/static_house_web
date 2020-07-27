$(document).ready(function () {
    let showImage = $('.picture-carousel .carousel-show img');
    let listImages = $('.picture-carousel .carousel-list li img');
    //初始化计算图片显示大小
    resizeImage(showImage, 840, 600);

    listImages.each(function () {
        resizeImage($(this), 135, 95);
    });

    // 切换观察相册模式
    $('#toggleBtn').click(function () {
        if ($(this).hasClass('toggle-pic')) {
            $(this).removeClass('toggle-pic');
            $(this).addClass('toggle-list')
            $('#toggleBtn span').text('列表查看');
            $('.picture-show').hide();
            $('.picture-carousel').show();
        } else {
            $(this).removeClass('toggle-list');
            $(this).addClass('toggle-pic')
            $('#toggleBtn span').text('高清查看');
            $('.picture-carousel').hide();
            $('.picture-show').show();
        }
    });

    // 看房按钮
    $('#kanfangBtn').click(function () {
        $.FormModal.userForm({
            title: '看房专车',
            message: '为方便联系您看房，请输入正确手机号码。'
        })
    });

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
        'vedio':[
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            }
        ],
        'spt':[
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
                imgSrc: '//static.fczx.com/www/assets/images/860x10000.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            },
            {
                imgSrc: '//static.fczx.com/www/assets/images/860x10000.jpg'
            }
        ],
        'ybj':[
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            }
        ],
        'ptt':[
            {
                imgSrc: '//static.fczx.com/www/assets/images/1400x933_1.jpg'
            }
        ]
    };
    $('.album-item').each(function () {
        let type = $(this).attr('data-type');

        // 某一类型的图片列表
        $(`.album-item[data-type=${type}] .album`).each(function (index) {
            let _this = $(this);
            _this.click(function () {
                let listHtml = '';
                for (const item of albumItemData[type]) {
                    listHtml = listHtml + `<li><img src="${item.imgSrc}" alt=""></li>`;
                }
                $('#albumCarouselList').append(listHtml);

                let albumList = $('#albumCarouselList');
                let albumItemList = $('#albumCarouselList li');
                let albumImageList = $('#albumCarouselList img');
                let stepWidth = 840;
                let itemWidth = 152;
                // 设置新显示的大图及当前的小图
                let targetImgSrc = albumImageList.eq(index).attr('src');
                $('#albumShowImage').attr('src', targetImgSrc);
                if (albumItemList.hasClass('actived')) {
                    albumItemList.removeClass('actived');
                }
                albumItemList.eq(index).addClass('actived');

                // 相册导航定位
                $('.album-tabs .tab-item').siblings().removeClass('actived');
                $('.album-tabs').find(`.tab-item[data-type=${type}]`).addClass('actived');

                // 显示大屏相册
                $('#albumFullScreen').show();
                $('html').addClass('modal-open');

                // 相册轮播
                let carouselParams = {
                    stepWidth,
                    currentIndex: index,
                    listItems: albumItemList,
                    listImages: albumImageList,
                    listContent: albumList,
                    listContentParent: $('#albumCarouselContent')
                }
                albumCarouselEvent(carouselParams);
            });
        });

        $('.album-tabs .tab-item').each(function () {
            $(this).click(function () {
                $('#albumCarouselList').children().remove();
                let albumType = $(this).attr('data-type');
                $(this).siblings().removeClass('actived');
                $(this).addClass('actived');
                let listHtml = '';
                for (const item of albumItemData[albumType]) {
                    listHtml = listHtml + `<li><img src="${item.imgSrc}" alt=""></li>`;
                }
                $('#albumCarouselList').append(listHtml);
            })
        })
    });

    $('#albumCloseBtn').click(function () {
        $('#albumCarouselList').children().remove();
        $('#albumFullScreen').hide();
        $('html').removeClass('modal-open');
    });

    function albumCarouselEvent(params) {
        let { stepWidth = 0, currentIndex = 0 } = params;
        let { listItems, listImages, listContent, listContentParent } = params;
        let moveCondition = -854;
        let listItemsCount = listItems.length;

        listItems.each(function (index) {
            let $this = $(this);
            $this.click(function () {
                currentIndex = index;
                setCurrentItem(currentIndex);
            });
        });

        $('#showArrowLeft').click(function () {
            if (currentIndex <= 0) {
                return;
            }
            currentIndex = currentIndex - 1;
            setCurrentItem(currentIndex);
        });

        $('#showArrowRight').click(function () {
            if (currentIndex >= listItemsCount - 1) {
                return;
            }
            currentIndex = currentIndex + 1;
            setCurrentItem(currentIndex);
        });

        function setCurrentItem(currentIndex) {
            let targetItem = listItems.eq(currentIndex);
            listItems.siblings().removeClass('actived');
            targetItem.addClass('actived');
            let imgSrc = listImages.eq(currentIndex).attr('src');

            $('#albumShowImage').attr('src', imgSrc);
            let imageHeight = $('#albumShowImage').outerHeight();
            $('.album-carousel-show').css('height', imageHeight);
            let clientHeight = document.documentElement.clientHeight;
            // 80 + 20 + 20 + 20
            if(imageHeight + 140 > clientHeight) {
                $('#albumWrap').addClass('album-wrapper');
            } else {
                $('#albumWrap').removeClass('album-wrapper');
            }

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
    }
});