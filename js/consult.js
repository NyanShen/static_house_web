$(document).ready(function () {
    $('.consult-right .hot-purchase .item').each(function () {
        $(this).hover(function () {
            $(this).addClass('on');
            let siblings = $(this).siblings('.item');
            siblings.removeClass('on')
        })
    })
})