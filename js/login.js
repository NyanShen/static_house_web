$(document).ready(function () {
    let loginByPhone = true;
    let nameMapper = {
        phone: '手机号码',
        phoneCode: '手机验证码',
        account: "登录账号",
        password: "密码"
    }

    function clearErrorText(element) {
        element.text('');
    }

    function validateRequired(element, errorElement, name) {
        let count = 0;
        if (!element.val()) {
            count++;
            errorElement.text(`${name}不能为空`);
        }
        return count;
    }

    function validatePattern(pattern, element, errorElement, name) {
        let count = 0;
        let regExpInstance = new RegExp(pattern);
        if (!regExpInstance.test(element.val())) {
            count++;
            errorElement.text(`请输入正确的${name}`);
        }
        return count;
    }

    function validateMapper(fieldId, validateType, pattern = '') {
        let element = $(`#${fieldId}`);
        let errorElement = $(`#${fieldId}Error`);
        let validates = {
            "required": validateRequired(element, errorElement, nameMapper[fieldId]),
            "pattern": validatePattern(pattern, element, errorElement, nameMapper[fieldId])
        }
        return validates[validateType]
    }

    function validator(validateItems) {
        let count = 0;
        validateItems.forEach(item => {
            count = count + validateMapper(item.fieldId, item.type, item.pattern);
        });
        return count;
    }

    //切换登录方式
    $('.login-form .login-tab span').each(function (index) {
        $(this).click(function () {
            $('.login-form>.hide').removeClass('hide');
            $('.actived').removeClass('actived');
            $('.login-form dd').eq(index - 1).addClass('hide');
            $(this).addClass('actived');

            if ($('#findPassBtn').hasClass('hide')) {
                loginByPhone = false;
                $('#findPassBtn').removeClass('hide');
            } else {
                loginByPhone = true;
                $('#findPassBtn').addClass('hide');
            }
        })
    })

    //显示隐藏密码
    $('.login-form .login-pass .eyes-icon').click(function () {
        let _this = $(this)
        //获取同级兄弟input当前的密码框
        let _input = _this.siblings('#loginPass');
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
        let second = 60;
        $('#countdown').text((second) + "秒");
        let interval = setInterval(function () {
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
    let phoneCode = $('#phoneCode');
    let loginBtn = $('#loginBtn');
    let signForm = $('#signForm');
    let password = $('#password');

    signForm.on('focusin', '#phone,#phoneCode,#account,#password', function (event) {
        let targetId = event.currentTarget.id;
        let errorElement = $(`#${targetId}Error`);
        clearErrorText(errorElement);
    })

    signForm.on('focusout', '#phone,#phoneCode,#account,#password', function (event) {
        let targetId = event.currentTarget.id;
        let element = $(`#${targetId}`);
        let errorElement = $(`#${targetId}Error`);
        validateRequired(element, errorElement, nameMapper[targetId]);
    })

    loginBtn.on('click', function () {
        let count = 0;
        if (loginByPhone) {
            let errorCount = validator([
                {
                    fieldId: 'phone',
                    type: 'required',
                },
                {
                    fieldId: 'phone',
                    type: 'pattern',
                    pattern: '^1[34589]\\d{9}$'
                },
                {
                    fieldId: 'phoneCode',
                    type: 'required',
                }
            ])
            count = count + errorCount;
        } else {
            let errorCount = validator([
                {
                    fieldId: 'account',
                    type: 'required',
                },
                {
                    fieldId: 'password',
                    type: 'required',
                }
            ])
            count = count + errorCount;
        }

    })

    $('#registerBtn').on('click', function () {
        let count = 0;
        let errorCount = validator([
            {
                fieldId: 'phone',
                type: 'required',
            },
            {
                fieldId: 'phone',
                type: 'pattern',
                pattern: '^1[34589]\\d{9}$'
            },
            {
                fieldId: 'phoneCode',
                type: 'required',
            },
            {
                fieldId: 'password',
                type: 'required',
            }
        ])
        count = count + errorCount;
        if (count) {
            return;
        }
        app.request({
            url: app.apiUrl('/user/register'),
            data: {
                mobile: phone.val(),
                source: '1',
                password: password.val(),
                randCode: phoneCode.val()
            },
            type: 'POST',
            dataType: 'json',
            headers: {},
            done: function (res) {
            }
        });
    })
})