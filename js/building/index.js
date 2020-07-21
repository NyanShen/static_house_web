/**
 * {'1': '变价提醒', '2': '开盘提醒', '3': '预约看房', '4': '一键找房', '5': '参与团购', '6': '参与折扣', '7': '一键订阅'}
 */
$(document).ready(function () {

    /*回到顶部*/
    backToTop();

    /**楼盘主页相册轮播 */
    $('.bd-carousel-show .item-list img').each(function () {
        resizeImage($(this), 600, 400);
    });

    $('.bd-carousel-content .bd-carousel-list img').each(function () {
        resizeImage($(this), 112, 80);
    });

    /*楼盘相册*/

    $('.buiding-picture-content .picture img').each(function () {
        resizeImage($(this), 200, 150);
    });

    /*同价位楼盘图*/
    $('.hot-pic-list li .item-picture img').each(function () {
        resizeImage($(this), 95, 70);
    });

    /*户型图列表*/

    $('.house-type-content .house-type-image img').each(function () {
        resizeImage($(this), 264, 262);
    });


    /*变价提醒，开盘提醒 */
    $('.bjtx-link, .kptx-link').click(function () {
        let type = $(this).attr('data-type');
        let modalParams = {
            title: `${$(this).text()}`,
            okText: '立即订阅',
            message: '我们将为您保密个人信息！请填写您接收订阅的姓名及手机号码',
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer('194', type, username, phone, phoneCode);
            }
        }
        $.FormModal.userForm(modalParams);
    });

    /*预约看房*/
    $('.reservation').click(function () {
        let type = $(this).attr('data-type');
        let modalParams = {
            title: `预约看房`,
            okText: '立即预约',
            loginName:'Nyan',
            loginPhone: '13418897654',
            message: `预约楼盘【${$(this).attr('data-title')}】`,
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer('194', type, username, phone, phoneCode);
            }
        }
        $.FormModal.userForm(modalParams);
    });

    /*领券*/
    $('.coupon').click(function () {
        let modalParams = {
            title: '获取优惠券',
            message: `${$(this).attr('data-message')}`,
            okText: '立即获取'
        }
        $.FormModal.userForm(modalParams);
    });

    // 申请活动报名
    $('#applyBtn').click(function () {
        let modalParams = {
            title: `【${$(this).attr('data-title')}】活动报名`,
            message: `${$(this).attr('data-message')}`,
            okText: '立即报名'
        }
        $.FormModal.userForm(modalParams);
    });

    /*我要点评*/
    $('#commentBtn').click(function () {
        let modalParams = {
            title: '注册登录后再评论哦'
        }
        $.FormModal.loginForm(modalParams);
    });

    $('#contactBtn').click(function () {
        let modalParams = {
            title: '注册登录后再评论哦'
        }
        $.FormModal.loginForm(modalParams);
    });

    /**一键订阅 */
    $('#subscribBtn').click(function () {
        let type = $(this).attr('data-type');
        let modalParams = {
            title: '订阅信息',
            message: '一键订阅: 变价通知、开盘通知、优惠通知、最新动态、看房团通知',
            okText: '立即订阅',
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer('194', type, username, phone, phoneCode);
            }
        }
        $.FormModal.userForm(modalParams);
    });
});