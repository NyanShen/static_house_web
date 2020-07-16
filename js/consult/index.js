$(document).ready(function () {

    //计算图片显示大小
    //列表图片
    $('.consult-list .item-picture img').each(function () {
        resizeImage($(this), 222, 150);
    });

    //广告图片
    resizeImage($('.content-right .ad img'), 320, 210);
    
    /*申请优惠*/
    $('#applicationBtn').on('click', function () {
        let modalParams = {
            title: '申请优惠',
            callback: applicationCallback
        };
        $.FormModal.userForm(modalParams);
    });

    function applicationCallback(username, phoneNumber) {
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

    $('.hot-purchase .join').on('click', function () {
        let modalParams = {
            title: $(this).attr('data-title'),
            callback: joinCallback,
            message: '√团购价折扣优惠 √额外礼包 √专属顾问提供购房指导'
        }
        $.FormModal.userForm(modalParams);
    });


    function joinCallback(username, phoneNumber) {
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
});