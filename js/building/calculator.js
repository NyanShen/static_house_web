/**
 * 等额本息计算
 */
function averageMonthPayment(loanMoney, payMonth, yearRatio) {
    var monthRatio = parseFloat(yearRatio / 12);
    return loanMoney * Math.pow(1 + monthRatio, payMonth) * monthRatio / (Math.pow(1 + monthRatio, payMonth) - 1)
}

$(document).ready(function () {
    /**
     * 下拉框点击显示与隐藏
     */
    $(document).click(function (event) {
        let $target = $(event.target).parents('.select-content');
        let allSelectList = $('.calculator-condition .select-list');
        if ($target.length === 1) {
            let $targetChild = $target.children('.select-list');
            if ($targetChild.is(':visible')) {
                $targetChild.hide();
            } else {
                allSelectList.hide();
                $targetChild.show();
            }
        } else {
            allSelectList.hide();
        }
    });
    /**
     * 下拉框选择赋值
     */
    $('.calculator-condition .select-content .select-list li').each(function () {
        $(this).click(function () {
            let text = $(this).text();
            let dataValue = $(this).attr('data-value');
            let targetText = $(this).parents('.select-content');
            targetText.find('span').text(text);
            targetText.find('input').attr('value', dataValue);

            if (!dataType) return;

            if (dataValue === 'type_03') {
                $('.select-item-loan').show();
            } else {
                $('.select-item-loan').hide();
            }
        });
    });

    $('#loanCalculateBtn').click(function () {
        let businessRatio = 0.0475;
        let loanMoney = $('#loanAmount').val() * 10000;
        let loanPeriod = $('#loanPeriod').val();
        let monthPayment = averageMonthPayment(loanMoney, loanPeriod, businessRatio);
        $('#monthPayment').text(parseInt(monthPayment));
    });

    let pipOption = {
        series: [
            {
                name: '计算结果',
                type: 'pie',
                radius: ['50%', '70%'],
                hoverAnimation: false,
                label: {
                    show: false,
                    position: 'center'
                },
                data: [
                    { value: 16, name: '参考首付', itemStyle: { color: '#11a43c' } },
                    { value: 36, name: '贷款金额', itemStyle: { color: '#409DFB' } },
                    { value: 32.5, name: '支付利息', itemStyle: { color: '#ff9900' } }
                ]
            }
        ]
    };
    let loanPipChart = echarts.init(document.getElementById('loanPipChart'));
    loanPipChart.setOption(pipOption);
});