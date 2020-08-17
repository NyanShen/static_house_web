
$(document).ready(function () {

    let calculator = new FCZX.building.Calculator({
        houseTypeS: '#houseType',
        housePriceS: '#housePrice',
        loanPriceS: '#loanPrice',
        loanLevelS: '#loanLevel',
        loanTypeS: '#loanType',
        loanFundS: '#loanFund',
        loanBusinessS: '#loanBusiness',
        loanPeriodS: '#loanPeriod',
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
        },
        resultOpt: {
            resultS: '.box-chart',
            chartId: 'loanPipChart'
        }
    });
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
                calculateBtnS: '',
                unitPrice: 0,
                loanScaleS: '',
                selectOpt: null,
                resultOpt: null
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
            _this.$loanScale = $(_opt.loanScaleS);
            _this.$calculateBtn = $(_opt.calculateBtnS);
            _this.$resultBox = $(_opt.resultOpt.resultS);
            _this.updatePrice();
            let selectInstance = new FCZX.Select(_opt.selectOpt);
            $(selectInstance).on('change', function (event, $input) {
                switch ('#' + $input.attr('id')) {
                    case _opt.houseTypeS:
                    case _opt.loanLevelS:
                        _this.updatePrice();
                        break;
                    case _opt.loanTypeS:
                        if ($input.val() == '3') {
                            _this.$loanScale.show();
                        } else {
                            _this.$loanScale.hide();
                        }
                        break;
                    default:
                }
            });
            if (_this.validate()) {
                _this.calculate();
            }
            _this.$calculateBtn.on('click.calc', function () {
                if (_this.validate()) {
                    _this.calculate();
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
        validate: function () {
            let _this = this;
            let isValid = true;
            // 校验不为空，总和正确，某一个值为空填补另外一个值
            if (_this.$loanType.val() == '3') {
                let FunVal = _this.$loanFund.val();
                let BussnessVal = _this.$loanBusiness.val();
                let $error = _this.$loanScale.find('.loan-error');
                if (!FunVal && !BussnessVal) {
                    $error.find('span').text('贷款金额不能为空');
                    $error.css('display', 'inline-block');
                    return false
                }
                if (FunVal && !BussnessVal) {
                    if (parseInt(FunVal) > _this.loanPrice) {
                        $error.find('span').text('贷款总额错误');
                        $error.css('display', 'inline-block');
                        return false;
                    } else {
                        _this.$loanFund.val(parseInt(FunVal));
                        _this.$loanBusiness.val(_this.loanPrice - parseInt(FunVal));
                    }
                }

                if (!FunVal && BussnessVal) {
                    if (parseInt(BussnessVal) > _this.loanPrice) {
                        $error.find('span').text('贷款总额错误');
                        $error.css('display', 'inline-block');
                        return false;
                    } else {
                        _this.$loanFund.val(_this.loanPrice - parseInt(BussnessVal));
                        _this.$loanBusiness.val(parseInt(BussnessVal));
                    }
                }

                if (FunVal && BussnessVal) {
                    if (parseInt(FunVal) + parseInt(BussnessVal) != _this.loanPrice) {
                        $error.find('span').text('贷款总额错误');
                        $error.css('display', 'inline-block');
                        return false;
                    } else {
                        _this.$loanFund.val(parseInt(FunVal));
                        _this.$loanBusiness.val(parseInt(BussnessVal));
                    }
                }
                $error.find('span').text('');
                $error.css('display', 'none');
            }
            return isValid;
        },
        calculate: function () {
            let _this = this;
            let rates = _this.rates;

            let loanFund = 0;
            let loanBusiness = 0;
            let rateFund = rates['fund']['6'];
            let rateBusiness = rates['commerce']['6'];

            let loanPeriod = _this.$loanPeriod.val();
            if (loanPeriod <= 5 * 12) {
                rateFund = rates['fund']['1'];
                rateBusiness = rates['commerce']['5'];
            }
            if (loanPrice <= 1 * 12) {
                rateBusiness = rates['commerce']['1'];
            }

            let monthlyRateFund = parseFloat(rateFund / 12);
            let monthlyRateBusiness = parseFloat(rateBusiness / 12);

            switch (_this.$loanType.val()) {
                case "1":
                    loanFund = 0;
                    loanBusiness = _this.loanPrice;
                    break;
                case "2":
                    loanFund = _this.loanPrice;
                    loanBusiness = 0;
                    break
                case "3":
                    loanFund = _this.$loanFund.val();
                    loanBusiness = _this.$loanBusiness.val();
                    break;
                default:
            }
            let monthlyPayFund = _this.equalInterestCalc(loanFund, monthlyRateFund, loanPeriod);
            let monthlyPayBusiness = _this.equalInterestCalc(loanBusiness, monthlyRateBusiness, loanPeriod);
            let result = {
                monthlyPay: Math.round(monthlyPayFund + monthlyPayBusiness),
                firstPay: Math.round(_this.housePrice - _this.loanPrice),
                loanPrice: _this.loanPrice,
                interest: parseFloat(((monthlyPayFund + monthlyPayBusiness) * loanPeriod / 10000 - _this.loanPrice).toFixed(1)),
                firstPayLevel: 10 - _this.$loanLevel.val() * 10,
                loanLevel: _this.$loanLevel.val() * 10,
                rateFund: (rateFund * 100).toFixed(2),
                rateBusiness: (rateBusiness * 100).toFixed(2)
            }

            _this.renderResult(result);
        },
        equalInterestCalc: function (loanMoney, monthRatio, loanPeriod) { //等额本息月均还款额
            //等额本息每月还款金额 =〔贷款本金*月利率*(月利率+1)^还款月数〕÷〔(1+月利率)^还款月数-1〕。
            return 10000 * loanMoney * monthRatio * [Math.pow((1 + monthRatio), loanPeriod)] / [Math.pow((1 + monthRatio), loanPeriod) - 1];
        },
        renderResult: function (result) {
            let _this = this;
            let _opt = _this.opt;
            let $chartText = _this.$resultBox.find('.chart-text');
            let _resultHtml = `
                <p class="month-pay">月均还款 <span class="price">${result.monthlyPay}</span> 元</p>
                <ul class="legend">
                    <li class="legend-pay">
                        <i class="legend-icon primary"></i>
                        <span>参考首付： ${result.firstPay}万</span>
                        <span>（${result.firstPayLevel}成）</span>
                    </li>
                    <li class="legend-pay">
                        <i class="legend-icon blue"></i>
                        <span>贷款金额： ${result.loanPrice}万</span>
                        <span>（${result.loanLevel}成）</span>
                    </li>
                    <li class="legend-pay">
                        <i class="legend-icon yellow"></i>
                        <span>支付利息： ${result.interest}万</span><br>
                        <span>（利率公积金${result.rateFund}%，商业性${result.rateBusiness}%）</span>
                    </li>
                </ul>
                <p class="remark">备注：以等额本息计算结果，数据仅供参考</p>`;
            $chartText.html(_resultHtml);
            let pipData = [
                { value: result.firstPay, name: '参考首付', itemStyle: { color: '#11a43c' } },
                { value: result.loanPrice, name: '贷款金额', itemStyle: { color: '#409DFB' } },
                { value: result.interest, name: '支付利息', itemStyle: { color: '#ff9900' } }
            ]
            let pipOption = {
                series: [
                    {
                        name: '计算结果',
                        type: 'pie',
                        radius: ['50%', '75%'],
                        hoverAnimation: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        data: pipData
                    }
                ]
            };
            let loanPipChart = echarts.init(document.getElementById(_opt.resultOpt.chartId));
            loanPipChart.setOption(pipOption);

            let $chartTextItem = $chartText.find('.legend-pay');

            loanPipChart.on('mouseover', { seriesName: '计算结果' }, params => {
                let index = getCurrentIndex(params.name);
                $chartTextItem.eq(index).addClass('actived');
            });

            loanPipChart.on('mouseout', { seriesName: '计算结果' }, params => {
                let index = getCurrentIndex(params.name);
                $chartTextItem.eq(index).removeClass('actived');
            });

            function getCurrentIndex(name) {
                let currentIndex = 0;
                switch (name) {
                    case '参考首付':
                        currentIndex = 0;
                        break;
                    case '贷款金额':
                        currentIndex = 1;
                        break;
                    case '支付利息':
                        currentIndex = 2;
                        break;
                    default:
                }
                return currentIndex;
            }
        }
    });
})(jQuery);
