$(document).ready(function () {


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