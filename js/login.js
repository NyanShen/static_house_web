$(document).ready(function () {
    let loginByPhone = false;

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
            $('.login-form .login-item').eq(index - 1).addClass('hide');
            $(this).addClass('actived');

            if ($('#findPassBtn').hasClass('hide')) {
                loginByPhone = true;
                $('#findPassBtn').removeClass('hide');
            } else {
                loginByPhone = false;
                $('#findPassBtn').addClass('hide');
            }
        })
    })

    //显示隐藏密码
    $('.login-form .login-pass .eyes-icon').click(function () {
        let _this = $(this)
        //获取同级兄弟input当前的密码框
        let _input = _this.siblings('#password');
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
        let errorCount = validator([{
            fieldId: 'phone',
            type: 'phone'
        }]);
        if (errorCount) return;
        let params = {message: '您输入的手机号尚未注册，请检查手机号或注册账户', okText: '去注册', url:'/pages/register.html'}
        getPhoneCodeByType($(this), '/user/login-code', confirmModel, params)
    })

    registerPhoneCodeBtn.click(function () {
        let errorCount = validator([{
            fieldId: 'phone',
            type: 'phone'
        }]);
        if (errorCount) return;
        let params = {message: '您输入的手机号已注册，请直接登录', okText: '去登录', url:'/pages/login.html'}
        getPhoneCodeByType($(this), '/user/register-code', confirmModel, params)
    })

    function confirmModel({message, okText, url}) {
        $.MsgNodal.Confirm('提示', message, function () {
            window.location.href = url
        }, okText);
    }

    //获取手机验证码（login, register,password）
    function getPhoneCodeByType(targetElement, uri, callback, params) {
        let countdown = $('#countdown');
        let cssStyle = {
            display: 'block'
        };
        app.request({
            url: app.apiUrl(uri),
            data: {
                mobile: phone.val()
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function (res) {
                if (!res.data) {
                    console.log(!res.data)
                    callback && callback(params)
                    return;
                }
                targetElement.hide();
                countdown.css(cssStyle);
                let second = 60;
                countdown.text((second) + "秒");
                let interval = setInterval(function () {
                    second--;
                    countdown.text((second) + "秒");
                    if (second <= 0) {
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
    $('.login-wrap').keydown(function (event) {
        if (event.keyCode === 13) {
            loginBtn.trigger("click");
        }
    })
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
                done: function (res) {
                    app.setToken(res.data);
                    window.location.href = '/';
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
                done: function (res) {
                    app.setToken(res.data);
                    window.location.href = '/';
                }
            });
        }

    })

    //注册提交
    $('.box-register').keydown(function (event) {
        if (event.keyCode === 13) {
            registerBtn.trigger("click");
        }
    })
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

        if (count) return
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
                window.location.href = "/index.html";
            }
        });
    })

    //找回密码

    let nextStepBtn = $('#nextStepBtn');
    let findPassBtn = $('#findPassBtn');
    let stepOne = $('#stepOne');
    let stepTwo = $('#stepTwo');
    let stepThree = $('#stepThree');
    let stepContentOne = $('#stepContentOne');
    let stepContentTwo = $('#stepContentTwo');
    let stepContentThree = $('#stepContentThree');
    let findPassPhoneCodeBtn = $('#findPassPhoneCodeBtn');
    let phoneShow = $('#phoneShow');
    nextStepBtn.click(function () {
        let count = 0;
        let errorCount = validator([
            {
                fieldId: 'phone',
                type: 'phone'
            }
        ])
        count = count + errorCount;
        if (count) return;
        app.request({
            url: app.apiUrl('/user/is-register'),
            data: {
                mobile: phone.val()
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function (res) {
                if (res.data) {
                    stepOne.removeClass('actived');
                    stepOne.addClass('passed')
                    stepTwo.addClass('actived')
                    stepContentOne.hide();
                    stepContentTwo.show();
                    phoneShow.val(phone.val())
                } else {
                    $.MsgNodal.Confirm('提示', '您输入的手机号尚未注册，请检查手机号或注册账户', function () {
                        window.location.href = '/pages/register.html'
                    }, '去注册', '');
                }
            }
        });
    });

    findPassBtn.click(function () {
        let count = 0;
        let errorCount = validator([
            {
                fieldId: 'phoneCode',
                type: 'required'
            },
            {
                fieldId: 'password',
                type: 'required',
            }
        ])
        count = count + errorCount;
        if (count) return;

        app.request({
            url: app.apiUrl('/user/change-password-by-code'),
            data: {
                mobile: phone.val(),
                randCode: phoneCode.val(),
                password: password.val()
            },
            type: 'POST',
            dataType: 'json',
            headers: {},
            done: function () {
                stepTwo.removeClass('actived');
                stepTwo.addClass('passed');
                stepThree.addClass('actived');
                stepContentTwo.hide();
                stepContentThree.show();
                //5秒后返回首页
                countdownBack();
            }
        });
    });

    findPassPhoneCodeBtn.click(function () {
        getPhoneCodeByType($(this), '/user/password-code');
    });

    function countdownBack() {
        let second = 5;
        let countdownBack = $('#countdownBack');
        countdownBack.text(`${second}s后返回到首页`)
        let interval = setInterval(function () {
            second--;
            countdownBack.text(`${second}s后返回到首页`)
            if (second <= 0) {
                clearInterval(interval);
                window.location.href = "/index.html";
            }
        }, 1000)
    }
})