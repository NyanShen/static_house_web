$(document).ready(function () {
    $('.consult-right .hot-purchase .item').each(function () {
        $(this).hover(function () {
            $(this).addClass('on');
            let siblings = $(this).siblings('.item');
            siblings.removeClass('on');
        });
    });
    let timer = null;
    let username = $('#username');
    let phoneNumber = $('#phoneNumber');
    let usernameError = $('#usernameError');
    let phoneNumberError = $('#phoneNumberError');
    $('#applicationBtn').click(function () {
        if (!username.val()) {
            usernameError.text('请填写用户信息');
            usernameError.show();
            setShowTimeout(usernameError);
            return;
        }
        if (!phoneNumber.val()) {
            phoneNumberError.text('请填写手机号码');
            phoneNumberError.show();
            setShowTimeout(phoneNumberError);
            return;
        }
        // todo: 申请优惠接口或跳转链接       
    });

    function setShowTimeout(element) {
        timer = setTimeout(function(){
            element.hide();
            clearTimeout(timer);
        }, 2000);
    }

});