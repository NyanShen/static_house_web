/**
 * 等额本息计算
 */
function averageMonthPayment(loanMoney, payMonth, yearRatio) {
    var monthRatio = parseFloat(yearRatio / 12);
    return loanMoney * Math.pow(1 + monthRatio, payMonth) * monthRatio / (Math.pow(1 + monthRatio, payMonth) - 1)
}

$(document).ready(function () {

    $('#loanCalculateBtn').click(function () {
        let businessRatio = 0.0475;
        let loanMoney = $('#loanAmount').val() * 10000;
        let loanPeriod = $('#loanPeriod').val();
        let monthPayment = averageMonthPayment(loanMoney, loanPeriod, businessRatio);
        $('#monthPayment').text(parseInt(monthPayment));
    });

    new FCZX.building.Calculator({
        houseTypeS: '#houseType',
        housePriceS: '#housePrice',
        loanPriceS: '#loanPrice',
        loanLevelS: '#loanLevel',
        loanTypeS: '#loanType',
        loanFundS: '#loanFund',
        loanBusinessS: '#loanBusiness',
        loanPeriodS: '#loanPeriod',
        loanTypeS: '#loanType',
        loanScaleS: '.select-item-loan',
        calculateBtnS: '#loanCalculateBtn',
        unitPrice: 6170,
        selectOpt: {
            selectContS: '.select-content',
            selectTextS: '.select-text',
            selectListS: '.select-list',
            optionS: 'li',
            dataProp: 'value',
            isHover: false
        }
    })

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

(function ($) {
    FCZX.globalNamespace('FCZX.building.Calculator');

    FCZX.building.Calculator = function (opt) {
        this.houseArea = 0;
        this.housePrice = 0;
        this.loanPrice = 0;
        this.rates = {
            commerce: {
                "1": "0.0435",
                "5": "0.0475",
                "6": "0.049",
            },
            fund: {
                "1": "0.0275",
                "6": "0.0325"
            }
        }
        this._init(opt);
    }

    $.extend(FCZX.building.Calculator.prototype, {
        _init: function (opt) {
            this.opt = {
                houseTypeS: '',
                housePriceS: '',
                loanPriceS: '',
                loanLevelS: '',
                loanTypeS: '',
                loanFundS: '',
                loanBusinessS: '',
                loanPeriodS: '',
                loanTypeS: '',
                calculateBtnS: '',
                unitPrice: 0,
                loanScaleS: '',
                selectOpt: null
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _this.$houseType = $(_opt.houseTypeS);
            _this.$housePrice = $(_opt.housePriceS);
            _this.$loanPrice = $(_opt.loanPriceS);
            _this.$loanLevel = $(_opt.loanLevelS);
            _this.$loanType = $(_opt.loanTypeS);
            _this.$loanFund = $(_opt.loanFundS);
            _this.$loanBusiness = $(_opt.loanBusinessS);
            _this.$loanPeriod = $(_opt.loanPeriodS);
            _this.$loanType = $(_opt.loanTypeS);
            _this.$loanScale = $(_opt.loanScaleS);
            _this.$calculateBtn = $(_opt.calculateBtnS);
            _this.updatePrice();
            let selectInstance = new FCZX.Select(_opt.selectOpt);
            $(selectInstance).on('change', function (event, $input) {
                switch ('#' + $input.attr('id')) {
                    case _opt.houseTypeS:
                    case _opt.loanLevelS:
                        _this.updatePrice();
                        break;
                    case _opt.loanTypeS:
                        if ($input.val() === 'type_03') {
                            _this.$loanScale.show();
                        } else {
                            _this.$loanScale.hide();
                        }
                        break;
                    default:
                }
            });

        },
        updatePrice: function () {
            let _this = this;
            _this.houseArea = _this.$houseType.val();
            _this.housePrice = Math.round(_this.houseArea * _this.opt.unitPrice / 10000);
            _this.loanPrice = Math.round(_this.housePrice * _this.$loanLevel.val());
            let _housePriceHtml = `
            <span class="price">${_this.housePrice}</span>
            <span class="unit text-color">万元</span>
            <span class="desc">（均价${_this.opt.unitPrice}元/m² × 面积${_this.houseArea}m²）</span>
            `;
            let _loanHtml = `贷款总额${_this.loanPrice}万`;
            _this.$housePrice.html(_housePriceHtml);
            _this.$loanPrice.html(_loanHtml);
        },
        calculate: function () {

        }
    });
})(jQuery);