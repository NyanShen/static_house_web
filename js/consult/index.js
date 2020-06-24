$(document).ready(function () {
    /*回到顶部*/
    backToTop();

    /*热门团购*/
    $('.hot-purchase>.item').each(function () {
        $(this).hover(function () {
            $(this).addClass('on');
            let siblings = $(this).siblings('.item');
            siblings.removeClass('on');
        });
    });

    /*申请优惠*/
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
        app.request({
            url: app.areaApiUrl('/test/test'),
            data: {
                username: username.val(),
                mobile: phoneNumber.val()
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function (res) {
                console.log(res)
            }
        });       
    });

    function setShowTimeout(element) {
        timer = setTimeout(function(){
            element.hide();
            clearTimeout(timer);
        }, 2000);
    }

});