$(document).ready(function () {
    let arrowLeft = $('#showArrowLeft');
    let arrowRight = $('#showArrowRight');
    let showImage = $('.picture-carousel .carousel-show img');
    let listItems = $('.picture-carousel .carousel-list li');
    let listImages = $('.picture-carousel .carousel-list li img');
    //初始化计算图片显示大小

    resizeImage(showImage, 840, 600);

    listImages.each(function () {
        resizeImage($(this), 135, 95);
    });

    // 大图轮播点击
    showCarouselEvent(arrowLeft, arrowRight, listItems, listImages, function (imgSrc) {
        showImage.attr('src', imgSrc);
        showImage.attr('style', '');
        resizeImage(showImage, 840, 600);
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

    // listArrow点击切换html
});