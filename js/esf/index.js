$(document).ready(function () {
    resizeImage($('#showImage'), 640, 425);

    new FCZX.SwitchShow({
        showOpt: {
            imgSelector: '#showImage',
            leftSelector: '#showArrowLeft',
            rightSelector: '#showArrowRight'
        },
        listOpt: {
            listSelector: '.esf-carousel .carousel-list',
            itemSelector: '.esf-carousel .carousel-list li',
            leftSelector: '#listArrowLeft',
            rightSelector: '#listArrowRight'
        }
    });

    // 基于准备好的dom，初始化echarts实例
    var priceRatioChart = echarts.init(document.getElementById('priceRatioChart'), 'echarts_theme');

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '',
            subtext: '2019.10-2020.09房价走势图(元/㎡)'
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            formatter: '{b1}<br />{a0}： {c0}<br />{a1}： {c1}<br />{a2}： {c2}'
        },
        legend: {
            data: [
                { name: '本房源' },
                { name: '恒大翡翠华庭' },
                { name: '武商沃尔玛' }
            ]
        },
        xAxis: {
            type: 'category',
            data: ['10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09']
        },
        yAxis: {
            min: 0,
            max: 60000,
            label: { show: true }
        },
        series: [
            {
                name: '本房源',
                type: 'line',
                data: [, , , , , , , , , , , { name: '2020.09', value: 56000, symbolSize: 8 }],
                markLine: { silent: true }
            },
            {
                name: '恒大翡翠华庭',
                type: 'line',
                data: [
                    { name: '2019.10', value: 48000 },
                    { name: '2019.11', value: 58000 },
                    { name: '2019.12', value: 50000 },
                    { name: '2020.01', value: 48000 },
                    { name: '2020.02', value: 50000 },
                    { name: '2020.03', value: 50200 },
                    { name: '2020.04', value: 50500 },
                    { name: '2020.05', value: 50500 },
                    { name: '2020.06', value: 50500 },
                    { name: '2020.07', value: 51000 },
                    { name: '2020.08', value: 50500 },
                    { name: '2020.09', value: 48000 }
                ],
                markLine: { silent: true }
            },
            {
                name: '武商沃尔玛',
                type: 'line',
                data: [
                    { name: '2019.10', value: 38000 },
                    { name: '2019.11', value: 48000 },
                    { name: '2019.12', value: 40000 },
                    { name: '2020.01', value: 48000 },
                    { name: '2020.02', value: 40000 },
                    { name: '2020.03', value: 40200 },
                    { name: '2020.04', value: 40500 },
                    { name: '2020.05', value: 40500 },
                    { name: '2020.06', value: 40500 },
                    { name: '2020.07', value: 41000 },
                    { name: '2020.08', value: 40500 },
                    { name: '2020.09', value: 45000 }
                ],
                markLine: { silent: true }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    priceRatioChart.setOption(option);
});