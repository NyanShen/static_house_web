$(document).ready(function () {
    $('.house-type-all .house-type-image img').each(function () {
        resizeImage($(this), 208, 158);
    });

    /*每一页显示10条，判断总数是否大于10条*/
    let totalCount = 10; //todo
    if (totalCount >= 10) {
        $('#houseTypePagination').show();
    }

    /*在线咨询popup*/
    $('#hxConsultHidden .consultant-info').each(function (index) {
        $(this).hover(function () {
            $('#hxConsultHidden').css('height', '320px');
            $(this).children('.consultant-scan-popup').show();
        }, function () {
            $('#hxConsultHidden').css('height', '106px');
            $(this).children('.consultant-scan-popup').hide();
        })
    });

    /*置业顾问轮播*/
    new FCZX.Switch({
        listSelector: '#hxConsultHidden .consultant-hidden-list',
        itemSelector: '#hxConsultHidden .consultant-hidden-list li',
        leftSelector: '#arrowLeft',
        rightSelector: '#arrowRight',
        arrowDisClass: 'arrow-disabled',
        showItemCount: 4
    });

    // 户型图详情
    let currentIndex = 0;
    let showItemCount = 6;
    let showImage = $('.htd-content .carousel-show img');
    let listItems = $('#hxtDetailList li');
    let listImages = $('#hxtDetailList li img');
    resizeImage(showImage, 700, 600);

    let pictureList = initImageData(listImages);

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
        let listHtml = '';
        for (const item of pictureList) {
            listHtml = listHtml + `<li><img src="${item.imgSrc}" alt=""></li>`;
        }
        initScreenDomEvent(listHtml, currentIndex);
    });

    /*户型导航列表超过长度逻辑*/
    let listSelector = '#hxtNavList';
    let itemSelector = '#hxtNavList li';
    let leftSelector = '#navArrowLeft';
    let rightSelector = '#navArrowRight';
    new FCZX.Switch({ listSelector, itemSelector, leftSelector, rightSelector });

    /*户型图列表轮播*/
    let hxtlistSelector = '#hxtDetailList';
    let hxtitemSelector = '#hxtDetailList li';
    let hxtleftSelector = '#hxtArrowLeft';
    let hxtrightSelector = '#hxtArrowRight';
    new FCZX.Switch({
        listSelector: hxtlistSelector,
        itemSelector: hxtitemSelector,
        leftSelector: hxtleftSelector,
        rightSelector: hxtrightSelector,
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