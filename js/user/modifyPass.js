$(document).ready(function () {

    let passsForm = $('#passForm');

    //表单聚焦
    passsForm.on('focusin', '#oldPass,#newPass,#confirmPass', function (event) {
        let targetId = event.currentTarget.id;
        let errorElement = $(`#${targetId}Error`);
        clearErrorText(errorElement);
    });

    //表单失去焦点
    passsForm.on('focusout', '#oldPass,#newPass,#confirmPass', function (event) {
        let targetId = event.currentTarget.id;
        let element = $(`#${targetId}`);
        let errorElement = $(`#${targetId}Error`);
        validateRequired(element, errorElement, nameMapper[targetId]);
    });

    let nameMapper = {
        oldPass: '旧密码',
        newPass: '新密码',
        confirmPass: '确认密码'
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
            },
            {
                fieldId: 'confirmPass',
                type: 'required',
            }
        ], nameMapper)
        count = count + errorCount;
        if (count) return;
        let oldPass = $('#oldPass').val();
        let newPass = $('#newPass').val();
        let confirmPass = $('#confirmPass').val();
        if (newPass != confirmPass) {
            $('#confirmPassError').text('新密码和确认密码不一致，请重新输入');
            return
        }
        app.request({
            url: app.apiUrl('/test/test'),
            data: {
                oldPass,
                newPass,
                confirmPass
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function () {

            }
        });
    });
});