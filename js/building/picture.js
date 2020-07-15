$(document).ready(function () {
    let currentIndex = 0;
    let showImage = $('.picture-carousel .carousel-show img');
    let listItems = $('.picture-carousel .carousel-list li');
    let listImages = $('.picture-carousel .carousel-list li img');
    let listItemsCount = listItems.length;
    //初始化计算图片显示大小
    
    resizeImage(showImage, 840, 600);

    listImages.each(function () {
        resizeImage($(this), 135, 95);
    });

    listItems.each(function (index) {
        let $this = $(this);
        $this.click(function () {
            currentIndex = index;
            setCurrentItem(currentIndex);
        });
    });

    $('.picture-carousel .carousel-show .arrow-left').click(function () {
        if (currentIndex <= 0) {
            return;
        }
        currentIndex = currentIndex - 1;
        setCurrentItem(currentIndex);
    });

    $('.picture-carousel .carousel-show .arrow-right').click(function () {
        if (currentIndex >= listItemsCount - 1) {
            return;
        }
        currentIndex = currentIndex + 1;
        setCurrentItem(currentIndex);
    });

    function setCurrentItem(currentIndex) {
        listItems.siblings().removeClass('actived');
        listItems.eq(currentIndex).addClass('actived');
        imgSrc = listImages.eq(currentIndex).attr('src');
        showImage.attr('src', imgSrc);
        showImage.attr('style', '');
        //换图片时重新计算图片显示大小
        resizeImage(showImage, 840, 600);
    }

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

    $('#kanfangBtn').click(function() {
        $.FormModal.userForm({
            title: '看房专车',
            message: '为方便联系您看房，请输入正确手机号码。'
        })
    });
});