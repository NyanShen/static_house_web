$(document).ready(function () {
    getLoginUser(function (data) {
        if (data) {
            $('#hiddenId').val(data.id);
            $('.now-time').text(getChineseHour());
            $('.nickname').text(data.nickname);
            $('.username').text(data.username);
            $('.last-time').text(app.date(data.modified));
            $('.sex').text(SEX[data.sex]);
            $('#profileImage').attr('src', data.avatar);
            $('.user-photo').attr('src', data.avatar);

            $('#nickname').val(data.nickname);
            if (data.sex == 1) {
                $('.sexEdit').find('input').eq(0).attr('checked', true);
            } else {
                $('.sexEdit').find('input').eq(1).attr('checked', true);
            }
        } else {
            var backUrl = encodeURIComponent(location.href);
            location.href = `${app.wwwDomain}/user/login?backUrl=${backUrl}`;
        }
    })

})