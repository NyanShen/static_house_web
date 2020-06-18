$(document).ready(function () {
    $('.login-form .login-tab span').each(function (index) {
        $(this).click(function () {
            $('.login-form>.hide').removeClass('hide');
            $('.actived').removeClass('actived');
            $('.login-form dd').eq(index - 1).addClass('hide');
            $(this).addClass('actived');

            if ($('#findPassBtn').hasClass('hide')) {
                $('#findPassBtn').removeClass('hide');
            } else {
                $('#findPassBtn').addClass('hide');
            }
        })
    })

    $('.login-form .login-pass .eyes-icon').click(function () {
        var _this = $(this)
        //获取同级兄弟input当前的密码框
        var _input = _this.siblings('#loginPass');
        if (_this.hasClass('close')) {
            _this.removeClass('close');
            _this.addClass('open');
            _input.attr('type', 'text');
        } else {
            _this.removeClass('open');
            _this.addClass('close');
            _input.attr('type', 'password');
        }
    })

    //获取验证码
    $('#phoneCodeBtn').click(function () {
        $(this).hide();
        $('#countdown').css({
            display: 'block'
        });
        var second = 60;
        $('#countdown').text((second) + "秒");
        var interval = setInterval(function () {
            second--;
            $('#countdown').text((second) + "秒");
            if (second < 0) {
                $('#phoneCodeBtn').text("重发验证码");
                clearInterval(interval);
                $('#countdown').hide();
                $('#phoneCodeBtn').css({
                    display: 'block'
                });
            }
        }, 1000)
    })


    let phone = $('#phone');
    let account = $('#account');
    let loginPass = $('#loginPass');
    let phoneCode = $('#phoneCode');
    let loginBtn = $('#loginBtn');
    let loginForm = $('#loginForm');
    let phoneError = $('#phoneError');
    let accountError = $('#accountError');
    let loginPassError = $('#loginPassError');
    let phoneCodeError = $('#phoneCodeError');

    loginForm.on('focusin', '#phone,#phoneCode,#account,#loginPass', function (event) {
        let targetId = event.currentTarget.id;
        let errorElement = $('#' + targetId + 'Error');
        clearErrorText(errorElement);
    })

    phone.on('focusout', function () {
        phoneValidate(phone, phoneError);
    })

    phoneCode.on('focusout', function () {
        phoneCodeValidate(phoneCode, phoneCodeError);
    })

    account.on('focusout', function () {
        accountValidate(account, accountError);
    })

    loginPass.on('focusout', function () {
        loginPassValidate(loginPass, loginPassError);
    })

    loginBtn.on('click', function () {
        phoneValidate(phone, phoneError);
        phoneCodeValidate(phoneCode, phoneCodeError);
        accountValidate(account, accountError);
        loginPassValidate(loginPass, loginPassError);
    })
})

function clearErrorText(element) {
    element.text('');
}

function phoneValidate(phone, phoneError) {
    let phoneVal = phone.val();
    let phoneReg = new RegExp("^1[3456789]\\d{9}$");
    if (!phoneVal) {
        phoneError.text('手机号码不能为空');
        return;
    }
    if (!phoneReg.test(phoneVal)) {
        phoneError.text('请输入正确的手机号码');
    }
}

function phoneCodeValidate(phoneCode, phoneCodeError) {
    if (!phoneCode.val()) {
        phoneCodeError.text('手机验证码不能为空');
    }
}

function accountValidate(account, accountError) {
    if (!account.val()) {
        accountError.text('账户名不能为空');
    }
}

function loginPassValidate(loginPass, loginPassError) {
    if (!loginPass.val()) {
        loginPassError.text('密码不能为空');
    }
}
