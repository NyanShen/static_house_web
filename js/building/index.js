$(document).ready(function () {
    /*沙盘图*/
    let child = $('#sandPicture');
    justifyElement(child);
    dragPicture(child);
    /*回到顶部*/
    backToTop();

    /*变价提醒，开盘提醒 */
    $('.bjtx-link, .kptx-link').click(function () {
        let modalParams = {
            title: `${$(this).text()}`,
            okText: '立即订阅',
            message: '我们将为您保密个人信息！请填写您接收订阅的姓名及手机号码'
        }
        $.FormModal.userForm(modalParams);
    })
    /*预约看房*/
    $('.reservation').click(function () {
        let modalParams = {
            title: `${$(this).attr('data-title')}`,
            okText: '立即申请'
        }
        $.FormModal.userForm(modalParams);
    })
    /*领券*/
    $('.coupon').click(function () {
        let modalParams = {
            title: '获取优惠券',
            message: `${$(this).attr('data-message')}`,
            okText: '立即获取'
        }
        $.FormModal.userForm(modalParams);
    })
    /*我要点评*/
    $('#commentBtn').click(function () {
        let modalParams = {
            title: '注册登录后再评论哦'
        }
        $.FormModal.loginForm(modalParams);
    })
});