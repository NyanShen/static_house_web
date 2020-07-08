$(document).ready(function () {
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

    $('.calculator-condition .select-content .select-list li').each(function () {
        $(this).click(function () {
            let text = $(this).text();
            let targetText = $(this).parents('.select-content');
            targetText.find('span').text(text);
        });
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
                    { value: 16, name: '参考首付', itemStyle: {color: '#11a43c'} },
                    { value: 36, name: '贷款金额', itemStyle: {color: '#409DFB'} },
                    { value: 32.5, name: '支付利息', itemStyle: {color: '#ff9900'} }
                ]
            }
        ]
    };
    let loanPipChart = echarts.init(document.getElementById('loanPipChart'));
    loanPipChart.setOption(pipOption);
});