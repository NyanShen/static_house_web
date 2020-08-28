$(document).ready(function () {

    $('#selectPreferHouse .select-content-sm').each(function () {
        $(this).hover(function () {
            $(this).find('.select-list').show();
        }, function () {
            $(this).find('.select-list').hide();
        })
    })

    $('#selectPreferHouse .select-content-sm li').each(function () {
        $(this).click(function () {
            let text = $(this).text();
            let targetText = $(this).parents('.select-content-sm');
            targetText.find('span').text(text);
            targetText.find('input').attr('value', text);
            $(this).parents('.select-list').hide();
        });
    });

    $('#phoneCodeBtn').click(function () {
        let _this = $(this);
        let errorCount = validateForm('phone', 'phone');
        if (errorCount) return;
        let countdown = $('#countdown');
        app.request({
            url: app.apiUrl('/common/send-code'),
            data: {
                mobile: $('#phone').val()
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function () {
                let second = 60;
                _this.hide();
                countdown.show();
                countdown.val(`${second} 秒`);
                let interval = setInterval(function () {
                    second--;
                    countdown.val(`${second} 秒`);
                    if (second <= 0) {
                        countdown.hide();
                        _this.show();
                        _this.val('重发验证码');
                        clearInterval(interval);
                    }
                }, 1000)
            }
        });
    });

    $('#findHouseBtn').click(function () {
        let errorCount = 0;
        errorCount = validateForm('phone', 'phone');
        if (errorCount) return;
        errorCount = validateForm('phoneCode', 'required');
        if (errorCount) return;

        let preferRegin = $('#preferRegin').val(); //意向区域
        let houseArea = $('#houseArea').val(); //装修状况
        let totalPrice = $('#totalPrice').val(); // 预算
        let preferHouseType = $('#preferHouseType').val(); //户型
        app.request({
            url: app.areaApiUrl('/house/find-house'),
            data: {
                find_area: preferRegin,
                find_renovation: houseArea,
                find_budget: totalPrice,
                find_room: preferHouseType,
                mobile: $('#phone').val(),
                randCode: $('#phoneCode').val()
            },
            type: 'POST',
            dataType: 'json',
            headers: {},
            done: function () {
                $.MsgModal.Success('提交成功！', '感谢您的关注，房产置业顾问会尽快与您联系');
            }
        });
    });

});