$(document).ready(function () {
    let showItemCount = 6;
    let showImage = $('.htd-content .carousel-show img');
    let listItems = $('#hxtDetailList li');
    let listImages = $('#hxtDetailList li img');
    resizeImage(showImage, 700, 600);

    // 大图轮播
    let screenIndex = 0;
    showCarouselEvent($('#hxtShowArrowLeft'), $('#hxtShowArrowRight'), listItems, listImages, function (imgSrc, currentIndex) {
        screenIndex = currentIndex;
        showImage.attr('src', imgSrc);
        resizeImage(showImage, 700, 600);
    });

    // 显示大屏
    let screenItemList = $('.screen-picture-list li');
    let scrrenImageList = $('.screen-picture-list img');
    let screenShowImage = $('.screen-picture img');

    showCarouselEvent($('#screenShowArrowLeft'), $('#screenShowArrowRight'), screenItemList, scrrenImageList, function (imgSrc) {
        screenShowImage.attr('src', imgSrc);
    }, screenIndex);

    $('#fullscreenBtn').click(function () {
        let targetImgSrc = scrrenImageList.eq(screenIndex).attr('src');
        screenShowImage.attr('src', targetImgSrc);
        if (screenItemList.hasClass('actived')) {
            screenItemList.removeClass('actived')
        }
        screenItemList.eq(screenIndex).addClass('actived');
        $('#fullscreen').show();
    });

    $('#screenListArrowLeft').click(function () {
        if (screenIndex <= 0) {
            alert('已经是第一张了');
            return;
        }
        screenIndex = screenIndex - 1;
        setScreenCurrentItem(screenIndex);
    });
    
    $('#screenListArrowRight').click(function () {
        if (screenIndex >= screenItemList.length - 1) {
            alert('已经是最后一张了');
            return;
        }
        screenIndex = screenIndex + 1;
        setScreenCurrentItem(screenIndex);
    });
    function setScreenCurrentItem(screenIndex) {
        screenItemList.siblings().removeClass('actived');
        screenItemList.eq(screenIndex).addClass('actived');
        let imgSrc = scrrenImageList.eq(screenIndex).attr('src');
        screenShowImage.attr('src', imgSrc);
    }

    // 关闭大屏
    $('#closeIcon').click(function () {
        $('#fullscreen').hide();
    });

    /*户型导航列表超过长度逻辑*/
    let listSelector = '#hxtNavList';
    let leftSelector = '#navArrowLeft';
    let rightSelector = '#navArrowRight';
    let totalItemCount = $('#hxtNavList li').length;
    let itemWith = 195;
    let stepWith = 1170;
    new CustomCarousel({ listSelector, leftSelector, rightSelector, totalItemCount, itemWith, stepWith });

    /*户型图列表轮播*/
    let hxtlistSelector = '#hxtDetailList';
    let hxtleftSelector = '#hxtArrowLeft';
    let hxtrightSelector = '#hxtArrowRight';
    let hxttotalItemCount = $('#hxtDetailList li').length;
    let hxtitemWith = 120;
    let hxtstepWith = 720;
    new CustomCarousel({
        listSelector: hxtlistSelector,
        leftSelector: hxtleftSelector,
        rightSelector: hxtrightSelector,
        totalItemCount: hxttotalItemCount,
        itemWith: hxtitemWith,
        stepWith: hxtstepWith,
        showItemCount
    });

    /*在线咨询popup*/
    $('#consultants .consultant-info').each(function (index) {
        $(this).hover(function () {
            $(this).children('.consultant-scan-popup').show();
        }, function () {
            $(this).children('.consultant-scan-popup').hide();
        })
    });
});