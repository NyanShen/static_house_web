$(document).ready(function () {
    resizeImage($('#showImage'), 640, 425);

    new FCZX.SwitchShow({
        showOpt: {
            imgSelector: '#showImage',
            leftSelector: '#showArrowLeft',
            rightSelector: '#showArrowRight',
            callback: function ($showImg) {
                $('#showImage').parent().attr('href', $showImg.attr('src'));
            }
        },
        listOpt: {
            listSelector: '.esf-carousel .carousel-list',
            itemSelector: '.esf-carousel .carousel-list li',
            leftSelector: '#listArrowLeft',
            rightSelector: '#listArrowRight'
        }
    });

});