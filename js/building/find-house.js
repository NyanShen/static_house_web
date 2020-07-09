$(document).ready(function () {

    $('#selectPreferHouse .select-content-sm').each(function () {
        $(this).hover(function () {
            $(this).find('.select-list').show();
        }, function () {
            $(this).find('.select-list').hide();
        })
    })

    $('#selectPreferHouse .select-content-sm li').each(function () {
        $(this).click(function () {
            let text = $(this).text();
            let targetText = $(this).parents('.select-content-sm');
            targetText.find('span').text(text);
            targetText.find('input').attr('value', text);
            $(this).parents('.select-list').hide();
        });
    });
});