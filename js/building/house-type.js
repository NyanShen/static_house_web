$(document).ready(function () {
    let currentIndex = 0;
    let showItemCount = 6;
    let showImage = $('.htd-content .carousel-show img');
    let listItems = $('#hxtDetailList li');
    let listImages = $('#hxtDetailList li img');
    resizeImage(showImage, 700, 600);

    // 页面小屏大图轮播

    let carouselParams = {
        arrowLeft: $('#hxtShowArrowLeft'),
        arrowRight: $('#hxtShowArrowRight'),
        listItems,
        listImages,
        listContent: $('#hxtDetailList'),
        listContentParent: $('#hxtDetailContent'),
        moveCondition: -602,
        stepWidth: 120,
        callback: function carouselCallback(imgSrc, imageIndex) {
            currentIndex = imageIndex;
            showImage.attr('src', imgSrc);
            resizeImage(showImage, 700, 600);
        }
    }

    showCarouselEvent(carouselParams);

    $('#fullscreenBtn').click(function () {
        let screenItemList = $('#hxtDetailList').children();
        initScreenDomEvent(screenItemList, currentIndex);
    });

    /*户型导航列表超过长度逻辑*/
    let listSelector = '#hxtNavList';
    let leftSelector = '#navArrowLeft';
    let rightSelector = '#navArrowRight';
    let totalItemCount = $('#hxtNavList li').length;
    let itemWidth = 195;
    let stepWidth = 1170;
    new CustomCarousel({ listSelector, leftSelector, rightSelector, totalItemCount, itemWidth, stepWidth });

    /*户型图列表轮播*/
    let hxtlistSelector = '#hxtDetailList';
    let hxtleftSelector = '#hxtArrowLeft';
    let hxtrightSelector = '#hxtArrowRight';
    let hxttotalItemCount = $('#hxtDetailList li').length;
    let hxtitemWidth = 120;
    let hxtstepWidth = 720;
    new CustomCarousel({
        listSelector: hxtlistSelector,
        leftSelector: hxtleftSelector,
        rightSelector: hxtrightSelector,
        totalItemCount: hxttotalItemCount,
        itemWidth: hxtitemWidth,
        stepWidth: hxtstepWidth,
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