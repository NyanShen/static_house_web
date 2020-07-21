(function () {
    $.FormModal = {
        userForm: function (params) {
            const { loginName = '', loginPhone = '' } = params;
            const { title, callback, okText = '提交', message = '' } = params;
            generateUserFormHtml(title, okText, message, loginName, loginPhone);
            submitForm(callback, loginName, loginPhone);
            closeModal();
        },
        loginForm: function (params) {
            const { title } = params;
            generateLoginFormHtml(title);
            closeModal();
        }
    }

    function generateUserFormHtml(title, okText, message, loginName, loginPhone) {
        let _html = '';
        let _html_header = `<div class="box-modal" id="boxModal">
        <div class="modal-wrapper" id="modalWrapper">
            <div class="modal-header clearfix">
                <span class="modal-title fl">${title}</span>
                <span class="modal-close fr"></span>
            </div>`;
        let _html_message = `<p class="modal-sms">${message}</p>`;
        let _html_phone = `
        <p class="modal-user-info">姓<i style="margin:0 9px"></i>名：${loginName}</p>
        <p class="modal-user-info">手机号：${loginPhone}</p>
        <div class="modal-btn">
            <a href="javascript:;" id="modalPhoneBtn">${okText}</a>
        </div>`;
        let _html_form = `
            <div class="modal-form">
                <div class="form-item">
                    <i class="name-icon"></i>
                    <input type="text" placeholder="请输入姓名" id="username" value="">
                    <span class="formError" id="usernameError"></span>
                </div>
                <div class="form-item">
                    <i class="phone-icon"></i>
                    <input type="text" placeholder="请输入手机号码" id="phone" value="">
                    <span class="formError" id="phoneError"></span>
                </div>
                <div class="form-item form-item-code">
                    <i class="code-icon"></i>
                    <input type="text" placeholder="请输入手机验证码" id="phoneCode" value="">
                    <input class="phone-code-btn" type="button" value="获取验证码" id="commonPhoneCodeBtn">
                    <input class="count-down" type="button" value="" id="countdown">
                    <span class="formError" id="phoneCodeError"></span>
                </div>
                <div class="form-item">
                    <a href="javascript:;" class="form-btn" id="modalFormBtn">${okText}</a>
                </div>
                <div class="agreement">
                    我已阅读并接受
                    <a href="javascript:void(0);">《房产在线服务协议》</a>及
                    <a href="javascript:void(0);">《隐私权政策》</a>
                </div>
            </div>`;
        let _html_footer = `</div></div>`;
        _html = _html_header + _html_message;
        if (loginPhone) {
            _html = _html + _html_phone + _html_footer;
        } else {
            _html = _html + _html_form;
        }
        _html = _html + _html_footer;
        $("body").append(_html);
        generateModalFormCss();
        modalFormEvent();
    }

    function generateLoginFormHtml(title) {
        let _html = `<div class="box-modal" id="boxModal">
        <div class="modal-wrapper" id="modalWrapper">
            <div class="modal-header clearfix">
                <span class="modal-title fl">${title}</span>
                <span class="modal-close fr"></span>
            </div>
            <div class="modal-content">
                <div class="login-form" id="signForm">
                        <div class="login-tab">
                            <span class="actived" id="loginByPassSwitch">账号密码登录</span>
                            <span id="loginByCodeSwitch">手机验证码登录</span>
                        </div>
                        <div class="login-bind-phone">
                            <i class="login-back"></i>
                            <span class="title">绑定手机号</span>
                        </div>
                        <div class="login-item" id="loginByPassForm">
                            <p class="login-account">
                                <i></i>
                                <input type="text" name="account" value="" placeholder="请输入登录账号" id="account">
                                <span class="error" id="accountError"></span>
                            </p>
                            <p class="login-pass clearfix">
                                <i></i>
                                <input type="password" placeholder="密码" value="" id="password">
                                <span class="error" id="passwordError"></span>
                                <i class="eyes-icon close"></i>
                            </p>
                        </div>
                        <div class="login-item hide" id="loginByCodeForm">
                            <p class="login-phone">
                                <i></i>
                                <input type="text" name="phone" value="" placeholder="请输入手机号码" id="phone">
                                <span class="error" id="phoneError"></span>
                            </p>
                            <p class="login-code clearfix">
                                <i></i>
                                <input type="text" name="phoneCode" value="" placeholder="请输入验证码" id="phoneCode"
                                    autocomplete="off">
                                <span class="error" id="phoneCodeError"></span>
                                <em>
                                    <span class="code-btn" id="loginPhoneCodeBtn">获取验证码</span>
                                    <span class="count-down" id="countdown"></span>
                                </em>
                            </p>
                        </div>
                        <div class="login-option clearfix mb10">
                            <label for="loginAuto" class="fl">
                                <input type="checkbox" checked="true">自动登录
                            </label>
                            <a href="/pages/login/register.html" class="fr register">免费注册</a>
                            <a href="/pages/login/find-pass.html" class="fr" id="findPassBtn">找回密码</a>
                        </div>
                        <input class="login-btn" type="submit" id="loginBtn" value="登录">
                    </div>
                    <div class="login-third">
                        <div class="third-title">
                            <span>其他登录方式</span>
                        </div>
                        <div class="third-link">
                            <div class="link-item">
                                <a href="javascript:;" id="wechat" class="wechat">微信</a>
                            </div>  
                            <div class="link-item">
                                <a href="javascript:;" id="SMS" class="SMS">短信</a>
                            </div>  
                        </div>
                        <div class="login-agreement">
                            我已阅读并接受
                            <a href="javascript:void(0);">《房产在线服务协议》</a>及
                            <a href="javascript:void(0);">《隐私权政策》</a>
                        </div>
                    </div>
            </div>
        </div>
    </div> `;
        let _style = '<link rel="stylesheet" type="text/css" href="//static.fczx.com/www/css/login/index.css">';
        let _loginJs = '<script src="//static.fczx.com/www/js/login/index.js" type="text/javascript"></script>';
        $("body").append(_html);
        $("#boxModal").append(_style);
        $("#boxModal").append(_loginJs);
        generateModalFormCss();
    }

    function generateModalFormCss() {
        let _style = '<link rel="stylesheet" type="text/css" href="//static.fczx.com/www/css/module/modal.css">';
        $("#boxModal").append(_style);
        let _widht = document.documentElement.clientWidth; //屏幕宽
        let modalWrapper = $("#modalWrapper");
        //让提示框居中
        modalWrapper.css({
            left: (_widht - 600) / 2 + "px"
        });
    }

    function modalFormEvent() {
        $('#commonPhoneCodeBtn').click(function () {
            let _this = $(this);
            let errorCount = validateForm('phone', 'phone');
            if (errorCount) return;
            let countdown = $('#countdown');
            app.request({
                url: app.apiUrl('/common/send-code'),
                data: {
                    mobile: $('#phone').val()
                },
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function () {
                    let second = 60;
                    _this.hide();
                    countdown.show();
                    countdown.val(`${second} 秒`);
                    let interval = setInterval(function () {
                        second--;
                        countdown.val(`${second} 秒`);
                        if (second <= 0) {
                            countdown.hide();
                            _this.show();
                            _this.val('重发验证码');
                            clearInterval(interval);
                        }
                    }, 1000)
                }
            });
        });
    }

    function submitForm(callback, loginName, loginPhone) {
        $("#modalPhoneBtn").click(function () {
            if (typeof (callback) == 'function') {
                callback(loginName, loginPhone, '123456');
            }
            $("#boxModal").remove();
        });
        $("#modalFormBtn").click(function () {
            let username = $('#username').val();
            let phone = $('#phone').val();
            let phoneCode = $('#phoneCode').val();
            let errorCount = validateForm('username', 'required');
            if (errorCount) return;
            let phoneErrorCount = validateForm('phone', 'phone');
            if (phoneErrorCount) return;
            if (typeof (callback) == 'function') {
                callback(username, phone, phoneCode);
            }
            $("#boxModal").remove();
        });
    }

    function closeModal() {
        $('.modal-close').click(function () {
            $("#boxModal").remove();
        });
    }
})()