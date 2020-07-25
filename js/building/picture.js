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

    // 初始化图片数据
});