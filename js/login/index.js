//记录登录方式
let loginByPassword = true;
let loginByBindPhone = false;
//登录校验规则
let nameMapper = {
    phone: '手机号码',
    phoneCode: '手机验证码',
    account: "登录账号",
    password: "密码"
}

//设置标签属性值
function setElementAttr(ele, attr, val) {
    ele.attr(attr, val)
}
//清空错误文字
function clearErrorText(element) {
    element.text('');
}
//校验不能为空的字段
function validateRequired(element, errorElement, name) {
    let count = 0;
    if (!element.val()) {
        count++;
        errorElement.text(`${name}不能为空`);
    }
    return count;
}
//校验手机号码
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
//校验器匹配
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
//校验
function validator(validateItems) {
    let count = 0;
    validateItems.forEach(item => {
        count = count + validateMapper(item.fieldId, item.type);
    });
    return count;
}

$(document).ready(function () {
    //获取16随机码（授权）
    let authorizationCode = app.randCode(16);
    //切换登录方式
    $('.login-form .login-tab span').each(function (index) {
        $(this).click(function () {
            $('.actived').removeClass('actived');
            $(this).addClass('actived');

            if ($(this)[0].id === 'loginByCodeSwitch') {
                loginByPassword = false;
                $('#findPassBtn').addClass('hide');
                $('#loginByCodeForm').show();
                $('#loginByPassForm').hide();
            } else {
                loginByPassword = true;
                $('#loginByCodeForm').hide();
                $('#loginByPassForm').show();
                $('#findPassBtn').removeClass('hide');
            }
        })
    });
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
    });

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
    });

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
    });

    //获取验证码
    loginPhoneCodeBtn.click(function () {
        let errorCount = validator([{
            fieldId: 'phone',
            type: 'phone'
        }]);
        if (errorCount) return;
        let params = { message: '您输入的手机号尚未注册，请检查手机号或注册账户', okText: '去注册', url: '/pages/register.html' }
        let url = loginByBindPhone ? '/user/bind-code' : '/user/login-code';
        getPhoneCodeByType($(this), url, confirmModel, params)
    });

    //获取注册验证码
    registerPhoneCodeBtn.click(function () {
        let errorCount = validator([{
            fieldId: 'phone',
            type: 'phone'
        }]);
        if (errorCount) return;
        let params = { message: '您输入的手机号已注册，请直接登录', okText: '去登录', url: '/pages/login.html' }
        getPhoneCodeByType($(this), '/user/register-code', confirmModel, params)
    });

    function confirmModel({ message, okText, url }) {
        $.MsgNodal.Confirm('提示', message, function () {
            window.location.href = url
        }, okText);
    }

    //获取手机验证码（login, register,password, bind）
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
    });
    loginBtn.on('click', function () {
        let count = 0;
        if (loginByPassword && !loginByBindPhone) {
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
        } else {
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
            if (count) return;

            app.request({
                url: app.apiUrl(loginByBindPhone ? '/user/bind-mobile' : '/user/login-by-code'),
                data: {
                    mobile: phone.val(),
                    randCode: phoneCode.val(),
                    requestId: loginByBindPhone ? authorizationCode : null
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

    });

    /**
     * 绑定提交
     * 1. 点击第三方登录后跳转链接参数授权码（随机码）
     * 2. 跳转后开启定时器请求是否授权
     * 3. 返回fail不作处理，success授权成功，跳转绑定手机号码页面，token微信已绑定直接登录到上次访问页或首页
     * 4. 绑定手机页输入手机号获取验证码，登录并绑定获取token跳上次访问页或首页
     */
    let redirectUrl = app.apiUrl(`/oauth/redirect?type=1&requestId=${authorizationCode}`);
    setElementAttr($('#wechat'), 'href', redirectUrl);

    $('#wechat').click(function () {
        let timer = null;
        timer = setInterval(function () {
            app.request({
                url: app.apiUrl('/oauth/is-oauth'),
                data: {
                    type: "1",
                    requestId: authorizationCode
                },
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function (res) {
                    if (res.data === 'success') {
                        clearInterval(timer);
                        loginByBindPhone = true;
                        $('#loginBtn').val('登录并绑定');
                        $('.login-bind-phone,#loginByCodeForm').show();
                        $('.login-tab,.login-option,.login-third,#loginByPassForm').hide();
                    }
                    if (res.data && res.data !== 'success' && res.data !== 'fail') {
                        clearInterval(timer);
                        app.setToken(res.data);
                        window.location.href = '/';
                    }
                }
            });
        }, 2000);

    });

    $('.login-form .login-back').click(function () {
        loginByBindPhone = false;
        $('#loginBtn').val('登录');
        if (loginByPassword) {
            $('.login-bind-phone,#loginByCodeForm').hide();
            $('.login-tab,.login-option,.login-third,#loginByPassForm').show();
        } else {
            $('.login-bind-phone').hide();
            $('.login-tab,.login-option,.login-third').show();
        }
    });

    //注册提交
    $('.box-register').keydown(function (event) {
        if (event.keyCode === 13) {
            registerBtn.trigger("click");
        }
    });
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
    });

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
                    phoneShow.val(phone.val());
                } else {
                    confirmModel({ message: '您输入的手机号尚未注册，请检查手机号或注册账户', okText: '去注册', url: '/pages/register.html' })
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

    //倒计时返回首页
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