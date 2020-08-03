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
});