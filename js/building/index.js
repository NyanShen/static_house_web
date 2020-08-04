/**
 * {'1': '变价提醒', '2': '开盘提醒', '3': '预约看房', '4': '参与团购', '5': '参与折扣', '6': '一键订阅'}
 */
$(document).ready(function () {

    /*回到顶部*/
    backToTop();

    /*楼盘主页相册轮播*/
    $('.bd-carousel-show .item-list img').each(function () {
        resizeImage($(this), 600, 400);
    });

    $('.bd-carousel-content .bd-carousel-list img').each(function () {
        resizeImage($(this), 112, 80);
    });

    timeCountDown($('#timer').attr('data-time'), $('#timer'));

    /*楼盘相册*/

    $('.buiding-picture-content .picture img').each(function () {
        resizeImage($(this), 200, 150);
    });

    /*用户评论图片*/
    $('.comment-list .user-comment .picture img').each(function () {
        resizeImage($(this), 95, 70);
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
        let houseId = $(this).find('input').val();
        let type = $(this).attr('data-type');
        let modalParams = {
            title: `${$(this).text()}`,
            okText: '立即订阅',
            message: '我们将为您保密个人信息！请填写您接收订阅的姓名及手机号码',
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer(houseId, type, username, phone, phoneCode);
            }
        }
        $.FormModal.userForm(modalParams);
    });

    // 收藏
    $('#collection').click(function () {
        let houseId = $(this).attr('data-id');
        let status = $(this).attr('data-status');

        if (status) {
            $(this).attr('data-status', '');
            $(this).css('color', '#666');
            $('#collection .text').text('收藏');
        } else {
            $(this).attr('data-status', 'collected');
            $(this).css('color', '#ff3344');
            $('#collection .text').text('已收藏');
        }
        app.request({
            url: app.areaApiUrl('/test/test'),
            data: {
                fang_house_id: houseId
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function (res) {
                $.MsgModal.Success('收藏成功！', '感谢您对房产在线的关注，本楼盘/房源最新信息我们会第一时间通知您!');
            }
        });
    });

    // 点赞
    $('.action-zan').each(function (index) {
        let count = 0;
        let $this = $(this);
        let houseId = $(this).attr('data-id');
        let actionCount = $('.action-zan .action-count').eq(index);
        $this.click(function () {
            if ($this.hasClass('action-actived')) {
                return;
            }
            app.request({
                url: app.areaApiUrl('/house/like-comment'),
                data: {
                    id: houseId
                },
                type: 'POST',
                dataType: 'json',
                headers: {},
                done: function () {
                    $this.addClass('action-actived');
                    count = parseInt(actionCount.text());
                    count = count + 1;
                    actionCount.text(count);
                }
            });
        });
    });

    /*预约看房*/
    $('.reservation').on('click' ,function () {
        let type = $(this).attr('data-type');
        let houseId = $(this).find('input').val();
        console.log($(this).find('input'), houseId)
        let modalParams = {
            title: `预约看房`,
            okText: '立即预约',
            loginName: 'Nyan',
            loginPhone: '13418897654',
            message: `预约楼盘【${$(this).attr('data-title')}】`,
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer(houseId, type, username, phone, phoneCode);
            }
        }
        $.FormModal.userForm(modalParams);
    });

    /*领券*/
    $('.coupon').click(function () {
        let type = $(this).attr('data-type');
        let houseId = $(this).find('input').val();
        let modalParams = {
            title: '获取优惠券',
            message: `${$(this).attr('data-message')}`,
            okText: '立即获取',
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer(houseId, type, username, phone, phoneCode);
            }
        }
        $.FormModal.userForm(modalParams);
    });

    // 申请活动报名
    $('#applyBtn').click(function () {
        let type = $(this).attr('data-type');
        let houseId = $(this).attr('data-id');
        let modalParams = {
            title: `【${$(this).attr('data-title')}】活动报名`,
            message: `${$(this).attr('data-message')}`,
            okText: '立即报名',
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer(houseId, type, username, phone, phoneCode);
            }
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
        let houseId = $(this).attr('data-id');
        let type = $(this).attr('data-type');
        let message = $(this).attr('data-message');
        let modalParams = {
            title: '订阅信息',
            message,
            okText: '立即订阅',
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer(houseId, type, username, phone, phoneCode);
            }
        }
        $.FormModal.userForm(modalParams);
    });
});