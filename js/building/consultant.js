$(document).ready(function () {
    /*在线咨询popup*/
    $('.consultant-hidden-list li .consultant-info').each(function (index) {
        $(this).hover(function () {
            $(this).children('.consultant-scan-popup').show();
        }, function () {
            $(this).children('.consultant-scan-popup').hide();
        })
    })
    /*置业顾问轮播*/
    let listSelector = '.consultant-hidden-list';
    let leftSelector = '.consultant-carousel>.arrow-left';
    let rightSelector = '.consultant-carousel>.arrow-right';
    let totalItemCount = $('.consultant-hidden-list li').length;
    let itemWith = 240;
    let stepWith = 1200;
    new CustomCarousel({ listSelector, leftSelector, rightSelector, totalItemCount, itemWith, stepWith });
});