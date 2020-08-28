$(document).ready(function () {

    $('#photoEditBtn').click(function () {
        if ($(this).hasClass('operate-edit')) {
            $(this).text('保存');
            $(this).removeClass('operate-edit');
            $('.profile-photo-edit').show();
        } else {
            let userId = $('#hiddenId').val();
            app.request({
                url: app.apiUrl('/user/update'),
                data: {
                    id: userId,
                    avatar: $('.profile-photo').find('img').attr('src')
                },
                type: 'POST',
                dataType: 'json',
                headers: {},
                done: function () {
                    window.location.reload();
                }
            });
        }
    });

    $('#uploadBtn').click(function () {
        $('#uploadImageBtn').click();
    });

    $('#uploadImageBtn').on('change', function (event) {
        let file = event.target.files[0];
        if (!file) return;
        if (file.size > app.FILE_LIMIT.SIZE_10) {
            alert(`您上传的图片有点大哦，请上传小于10M的图片`);
            return;
        }
        let lastIndex = file.name.lastIndexOf(".");
        let fileType = file.name.substring(lastIndex + 1);
        if (app.FILE_LIMIT.IMAGE_ACCEPT.indexOf(fileType) === -1) {
            alert(`请您上传图片格式的文件哦`);
            return;
        }
        let formData = new FormData();
        formData.append('file', file);
        uploadImageRequest(formData);
    });

    /*上传图片接口*/
    function uploadImageRequest(formData) {
        app.request({
            url: app.apiUrl('/file/upload'),
            data: formData,
            type: 'POST',
            dataType: 'json',
            isFile: true,
            headers: {},
            done: function ({ data }) {
                $('.profile-photo').find('img').attr('src', data);
            }
        });
    }

    $('#profileEditBtn').click(function () {
        if ($(this).hasClass('operate-edit')) {
            $('#profileList').hide();
            $('#profileEdit').show();
            $(this).removeClass('operate-edit');
            $(this).text('保存');
        } else {
            let userId = $('#hiddenId').val();
            app.request({
                url: app.apiUrl('/user/update'),
                data: {
                    id: userId,
                    nickname: $('#nickname').val(),
                    sex: $('.sexEdit').find('input[type="radio"]:checked').val()
                },
                type: 'POST',
                dataType: 'json',
                headers: {},
                done: function () {
                    app.setCookie('_x_u', FCZX.Encript.encode({ nickname: $('#nickname').val() }), 30, app.topDomain);
                    window.location.reload();
                }
            });
        }
    });

    $('#photoCancelBtn,#profileCancelBtn').click(function () {
        window.location.reload();
    });

    // let authorizationCode = app.randCode(16);
    // $('#bindWechatBtn').click(function () {
    //     let isBind = $(this).find('input').val();
    //     if (isBind == 'true') {
    //         $(this).find('span').text('绑定');
    //         $(this).find('input').val(false);
    //         $(this).siblings('.value').text('你还未绑定微信登录');
    //     } else {
    //         window.open(app.apiUrl(`/oauth/redirect?type=1&requestId=${authorizationCode}`));
    //         let timer = null;
    //         timer = setInterval(function () {
    //             app.request({
    //                 url: app.apiUrl('/oauth/is-oauth'),
    //                 data: {
    //                     type: "1",
    //                     requestId: authorizationCode
    //                 },
    //                 type: 'GET',
    //                 dataType: 'json',
    //                 headers: {},
    //                 done: function (res) {
    //                     if (res.data && res.data !== 'success' && res.data !== 'fail') {
    //                         clearInterval(timer);
    //                         $(this).find('span').text('解绑');
    //                         $(this).find('input').val(true);
    //                         $(this).siblings('.value').text('你已绑定微信登录');
    //                     }
    //                 }
    //             });
    //         }, 2000);
    //     }
    // })
});