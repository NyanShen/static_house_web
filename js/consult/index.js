$(document).ready(function () {

    /*申请优惠*/

    $('#applicationBtn').click(function () {
        $.FormModal.userForm({ title: '申请优惠', callback: applicationCallback, username: 'Nyan', phone: '13928454036' });
    });

    function applicationCallback(username, phoneNumber) {
        console.log(username, phoneNumber)
        app.request({
            url: app.areaApiUrl('/test/test'),
            data: {
                username: username,
                mobile: phoneNumber
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function (res) {
            }
        });
    }

    /*参团*/

    $('.hot-purchase .on .join').click(function () {

        $.FormModal.userForm({ title: '特惠参团', message: '√团购价折扣优惠 √额外礼包 √专属顾问提供购房指导' });
    })
});