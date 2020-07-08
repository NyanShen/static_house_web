(function () {
    $.FormModal = {
        userForm: function (params) {
            const { username = '', phone = '' } = params;
            const { title, callback, okText = '提交', message = '' } = params;
            generateUserFormHtml(title, okText, message, username, phone);
            submitForm(callback);
            closeModal();
        }
    }

    let generateUserFormHtml = function (title, okText, message, username, phone) {
        let _html = `<div class="box-modal" id="boxModal">
        <div class="modal-content" id="modalContent">
            <div class="modal-header clearfix">
                <span class="modal-title fl">${title}</span>
                <span class="modal-close fr"></span>
            </div>
            <div class="modal-message">${message}</div>
            <div class="modal-form">
                <div class="form-item">
                    <i class="name-icon"></i>
                    <input type="text" placeholder="请输入姓名" id="username" value="${username}">
                    <span class="formError" id="usernameError"></span>
                </div>
                <div class="form-item">
                    <i class="phone-icon"></i>
                    <input type="text" placeholder="请输入手机号码" id="phone" value="${phone}">
                    <span class="formError" id="phoneError"></span>
                </div>
                <div class="form-item form-item-code">
                    <i class="code-icon"></i>
                    <input type="text" placeholder="请输入手机验证码" id="phoneCode" value="">
                    <input type="button" value="获取验证码">
                    <span class="formError" id="phoneCodeError"></span>
                </div>
                <div class="form-item">
                    <a href="javascript:;" class="form-btn" id="modalFormBtn">${okText}</a>
                </div>
            </div>
        </div>
    </div>`;
        $("body").append(_html);
        generateModalFormCss();
        modalFormEvent(phone);
    }

    let generateModalFormCss = function () {
        let _style = '<link rel="stylesheet" type="text/css" href="//static.fczx.com/www/css/module/modal.css">';
        $("head").append(_style);
        let _widht = document.documentElement.clientWidth; //屏幕宽
        let modalContent = $("#modalContent");
        //让提示框居中
        modalContent.css({
            left: (_widht - 600) / 2 + "px"
        });
    }

    let modalFormEvent = function(phone) {
        $('#phone').change(function() {
            let currentPhone = $(this).val();
            if (parseInt(phone) != parseInt(currentPhone)) {
                $('.form-item-code').show();
            } else {
                $('.form-item-code').hide();
            }
        });
    }

    let submitForm = function (callback) {
        $("#modalFormBtn").click(function () {
            let username = $('#username').val();
            let phone = $('#phone').val();
            let phoneCode = $('#phoneCode').val();
            $("#boxModal").remove();
            if (typeof (callback) == 'function') {
                callback(username, phone, phoneCode);
            }
        });
    }

    let closeModal = function () {
        $('.modal-close').click(function () {
            $("#boxModal").remove();
        });
    }
})()