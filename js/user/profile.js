$(document).ready(function () {

    $('#photoEditBtn').click(function () {
        if ($(this).hasClass('operate-edit')) {
            $(this).text('保存');
            $(this).removeClass('operate-edit');
            $('.profile-photo-edit').show();
        } else {
            $(this).text('修改');
            $('.profile-photo-edit').hide();
            $(this).addClass('operate-edit');
        }
    });

    $('#uploadBtn').click(function () {
        $('#uploadImageBtn').click();
    });

    $('#profileEditBtn').click(function () {
        if ($(this).hasClass('operate-edit')) {
            $('#profileList').hide();
            $('#profileEdit').show();
            $(this).removeClass('operate-edit');
            $(this).text('保存');
        } else {
            $('#profileList').show();
            $('#profileEdit').hide();
            $(this).addClass('operate-edit');
            $(this).text('编辑');
            $('#profileEdit').find('input').each(function (index) {
                let target = $('#profileList').find('.profile-item').eq(index);
                target.find('span').text($(this).val() || "暂无设置");
                target.find('input').text($(this).val());
            })
        }
    });

    $('#photoCancelBtn').click(function () {
        $('.profile-photo-edit').hide();
        $('#photoEditBtn').addClass('operate-edit');
        $('#photoEditBtn').text('修改');
    });

    $('#profileCancelBtn').click(function () {
        $('#profileEdit').hide();
        $('#profileList').show();
        $('#profileEditBtn').addClass('operate-edit');
        $('#profileEditBtn').text('编辑');
    });

    let authorizationCode = app.randCode(16);
    $('#bindWechatBtn').click(function () {
        let isBind = $(this).find('input').val();
        if (isBind == 'true') {
            $(this).find('span').text('绑定');
            $(this).find('input').val(false);
            $(this).siblings('.value').text('你还未绑定微信登录');
        } else {
            window.open(app.apiUrl(`/oauth/redirect?type=1&requestId=${authorizationCode}`));
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
                        if (res.data && res.data !== 'success' && res.data !== 'fail') {
                            clearInterval(timer);
                            $(this).find('span').text('解绑');
                            $(this).find('input').val(true);
                            $(this).siblings('.value').text('你已绑定微信登录');
                        }
                    }
                });
            }, 2000);
        }
    })
});