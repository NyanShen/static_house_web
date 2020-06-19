$(document).ready(function () {
    let loginByPhone = true;

    //登录校验规则
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

    function validatePhone(element, errorElement, name) {
        let count = 0;
        let regExpInstance = new RegExp('^1[34589]\\d{9}$');
        if (!element.val()) {
            count++;
            errorElement.text(`${name}不能为空`);
            return count
        }
        if (!regExpInstance.test(element.val())) {
            count++;
            errorElement.text(`请输入正确的${name}`);
        }
        return count
    }

    function validateMapper(fieldId, validateType, rules = {}) {
        let element = $(`#${fieldId}`);
        let errorElement = $(`#${fieldId}Error`);
        switch (validateType) {
            case 'required':
                return validateRequired(element, errorElement, nameMapper[fieldId]);
            case 'phone':
                return validatePhone(element, errorElement, nameMapper[fieldId]);
            default:
                return 0
        }
    }

    function validator(validateItems) {
        let count = 0;
        validateItems.forEach(item => {
            count = count + validateMapper(item.fieldId, item.type);
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
    let phone = $('#phone');
    let phoneCode = $('#phoneCode');
    let password = $('#password');
    let account = $('#account');
    let loginPhoneCodeBtn = $('#loginPhoneCodeBtn');
    let registerPhoneCodeBtn = $('#registerPhoneCodeBtn');
    let signForm = $('#signForm');
    let loginBtn = $('#loginBtn');
    let registerBtn = $('#registerBtn');

    //表单聚焦
    signForm.on('focusin', '#phone,#phoneCode,#account,#password', function (event) {
        let targetId = event.currentTarget.id;
        let errorElement = $(`#${targetId}Error`);
        clearErrorText(errorElement);
    })

    //表单失去焦点
    signForm.on('focusout', '#phone,#phoneCode,#account,#password', function (event) {
        let targetId = event.currentTarget.id;
        let element = $(`#${targetId}`);
        let errorElement = $(`#${targetId}Error`);
        if (targetId === 'phone') {
            validatePhone(element, errorElement, nameMapper[targetId])
        } else {
            validateRequired(element, errorElement, nameMapper[targetId]);
        }
    })

    //获取验证码
    loginPhoneCodeBtn.click(function () {
        getPhoneCodeByType($(this), 'login')
    })

    registerPhoneCodeBtn.click(function () {
        getPhoneCodeByType($(this), 'register')
    })

    function getPhoneCodeByType(targetElement, type) {
        let errorCount = validator([{
            fieldId: 'phone',
            type: 'phone'
        }]);
        if (errorCount) return;
        let countdown = $('#countdown');
        let cssStyle = {
            display: 'block'
        };
        app.request({
            url: app.apiUrl(`/user/${type}-code`),
            data: {
                mobile: phone.val()
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function () {
                targetElement.hide();
                countdown.css(cssStyle);
                let second = 60;
                countdown.text((second) + "秒");
                let interval = setInterval(function () {
                    second--;
                    countdown.text((second) + "秒");
                    if (second < 0) {
                        targetElement.text("重发验证码");
                        clearInterval(interval);
                        countdown.hide();
                        targetElement.css(cssStyle);
                    }
                }, 1000)
            }
        });
    }

    //登录提交
    loginBtn.on('click', function () {
        let count = 0;
        if (loginByPhone) {
            let errorCount = validator([
                {
                    fieldId: 'phone',
                    type: 'phone'
                },
                {
                    fieldId: 'phoneCode',
                    type: 'required',
                }
            ])
            count = count + errorCount;
            if (count) return
            app.request({
                url: app.apiUrl('/user/login-by-code'),
                data: {
                    mobile: phone.val(),
                    randCode: phoneCode.val()
                },
                type: 'POST',
                dataType: 'json',
                headers: {},
                done: function () {
                    $MsgModal.Alert('提示', '注册成功');
                    window.location = '/pages/login.html';
                }
            });
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
            if (count) return
            app.request({
                url: app.apiUrl('/user/login-by-password'),
                data: {
                    account: account.val(),
                    password: password.val()
                },
                type: 'POST',
                dataType: 'json',
                headers: {},
                done: function () {
                    window.location = '/index.html';
                }
            });
        }

    })

    //注册提交
    registerBtn.on('click', function () {
        let count = 0;
        let errorCount = validator([
            {
                fieldId: 'phone',
                type: 'phone'
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

        if (!count) {
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
                done: function () {
                    $MsgModal.Alert('提示', '注册成功');
                    window.location = '/pages/login.html';
                }
            });
        }
    })
})