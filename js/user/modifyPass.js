$(document).ready(function () {

    let passsForm = $('#passForm');

    //表单聚焦
    passsForm.on('focusin', '#oldPass,#newPass', function (event) {
        let targetId = event.currentTarget.id;
        let errorElement = $(`#${targetId}Error`);
        clearErrorText(errorElement);
    });

    //表单失去焦点
    passsForm.on('focusout', '#oldPass,#newPass', function (event) {
        let targetId = event.currentTarget.id;
        let element = $(`#${targetId}`);
        let errorElement = $(`#${targetId}Error`);
        validateRequired(element, errorElement, nameMapper[targetId]);
    });

    let nameMapper = {
        oldPass: '旧密码',
        newPass: '新密码'
    }
    $('#submitPass').click(function () {
        let count = 0;
        let errorCount = validator([
            {
                fieldId: 'oldPass',
                type: 'required'
            },
            {
                fieldId: 'newPass',
                type: 'required',
            }
        ], nameMapper)
        count = count + errorCount;
        if (count) return;
        let oldPass = $('#oldPass').val();
        let newPass = $('#newPass').val();
        let phone = $('#phone').val();

        app.request({
            url: app.apiUrl('/user/change-password'),
            data: {
                account: phone,
                oldPassword: oldPass,
                password: newPass,
            },
            type: 'POST',
            dataType: 'json',
            headers: {},
            done: function () {
                $.MsgModal.Success('修改成功', '点击确定后重新返回登录界面', function () {
                    window.location.href = `${app.wwwDomain}/user/login`;
                });
            }
        });
    });
});