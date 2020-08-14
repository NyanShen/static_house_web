$(document).ready(function () {
    /*回到顶部*/
    backToTop();

    // 显示固定标题
    showFixHeader(200);

    /*热门团购*/
    $('.hot-purchase>.item').each(function () {
        $(this).hover(function () {
            $(this).addClass('on');
            let siblings = $(this).siblings('.item');
            siblings.removeClass('on');
        });
    });

    /*参团*/
    $('.hot-purchase .join').on('click', function () {
        let type = $(this).attr('data-type');
        let houseId = $(this).find('input').val();
        let modalParams = {
            title: $(this).attr('data-title'),
            message: '√团购价折扣优惠 √额外礼包 √专属顾问提供购房指导',
            callback: function (username, phone, phoneCode) {
                callbackHouseCustomer(houseId, type, username, phone, phoneCode);
            }
        }
        $.FormModal.userForm(modalParams);
    });

    /*标签集合*/
    let tagNav = $('.box-tag .tag-nav li');
    let tagContenet = $('.box-tag .tag-content');
    tagContenet.hide();
    tagContenet.first().show();
    tagNav.each(function (index) {
        $(this).hover(function () {
            $(this).siblings().removeClass('actived');
            $(this).addClass('actived');
            tagContenet.hide();
            tagContenet.eq(index).show();
        })
    });

    /*登录注册&用户中心*/
});

(function () {
    /**
     * FCZX.foo.bar
     */
    let FCZX = {};
    FCZX.globalNamespace = function (ns) {
        var nsParts = ns.split(".");
        var root = window;
        for (var i = 0; i < nsParts.length; i++) {
            if (typeof root[nsParts[i]] == "undefined") {
                root[nsParts[i]] = {};
            }
            root = root[nsParts[i]];
        }
        return root;
    }

    window.FCZX = FCZX;
})();

//居中元素
function justifyElement(child) {
    let maxLeft = child.offsetParent().outerHeight() - child.outerHeight();
    let maxTop = child.offsetParent().outerWidth() - child.outerWidth();
    child.css({
        left: maxLeft / 2 + 'px',
        top: maxTop / 2 + 'px'
    })
}

//拖动图片
function dragPicture(moveObj) {
    let maxLeft = moveObj.offsetParent().outerWidth() - moveObj.outerWidth();
    let maxTop = moveObj.offsetParent().outerHeight() - moveObj.outerHeight();
    moveObj.on('mousedown', event => {
        let imgTop = parseFloat(moveObj.css('top'));
        let imgLeft = parseFloat(moveObj.css('left'));
        let lastPointX = event.clientX;
        let lastPointY = event.clientY;
        $(document).on('mousemove', e => {
            e.preventDefault();
            let changeX = e.clientX - lastPointX;
            let changeY = e.clientY - lastPointY;
            let disX = imgLeft + changeX;
            let disY = imgTop + changeY;
            moveObj.css({
                left: Math.max(Math.min(disX, 0), maxLeft) + "px",
                top: Math.max(Math.min(disY, 0), maxTop) + "px"
            })
        })
    });
    $(document).on('mouseup', () => {
        $(document).off('mousemove');
    })
}

//回到顶部
function toggleToTopBtn(toTopBtn, scrollTop, clientHeight) {
    if (scrollTop > clientHeight) {
        toTopBtn.css('visibility', 'visible');
    } else {
        toTopBtn.css('visibility', 'hidden');
    }
}

//回到顶部
function backToTop() {
    let toTopBtn = $('#toTopBtn');
    let scrollTop = $(document).scrollTop();
    let clientHeight = document.documentElement.clientHeight;
    toggleToTopBtn(toTopBtn, scrollTop, clientHeight);
    $(window).on('scroll', () => {
        scrollTop = $(document).scrollTop();
        toggleToTopBtn(toTopBtn, scrollTop, clientHeight);
    })
    toTopBtn.on('click', () => {
        $('body,html').animate({
            scrollTop: 0
        }, 500)
    })
}

// 显示固定标题
function showFixHeader(top) {
    let scrollTop = $(document).scrollTop();
    window.addEventListener('scroll', function () {
        scrollTop = $(document).scrollTop();
        if (scrollTop > top) {
            $('.fix-header').show();
        } else {
            $('.fix-header').hide();
        }
    });
    if (scrollTop > top) {
        $('.fix-header').show();
    } else {
        $('.fix-header').hide();
    }
}

// 设置元素超时隐藏
let timer = null;
function setShowTimeout(element, time = 2000) {
    timer = setTimeout(function () {
        element.hide();
        clearTimeout(timer);
    }, time);
}

//设置标签属性值
function setElementAttr(ele, attr, val) {
    ele.attr(attr, val)
}

//清空错误文字
function clearErrorText(element) {
    element.text('');
}

//校验不能为空的字段
function validateRequired(element, errorElement, name) {
    let count = 0;
    if (!element.val()) {
        count++;
        errorElement.text(`${name}不能为空`);
    }
    return count;
}

//校验手机号码
function validatePhone(element, errorElement, name) {
    let count = 0;
    let regExpInstance = new RegExp('^1[34589]\\d{9}$');
    if (!element.val()) {
        count++;
        errorElement.text(`${name}不能为空`);
        return count
    }
    if (!regExpInstance.test(element.val())) {
        count++;
        errorElement.text(`请输入正确的${name}`);
    }
    return count
}

//校验器匹配
function validateMapper(fieldId, validateType, nameMapper, rules = {}) {
    let element = $(`#${fieldId}`);
    let errorElement = $(`#${fieldId}Error`);
    switch (validateType) {
        case 'required':
            return validateRequired(element, errorElement, nameMapper[fieldId]);
        case 'phone':
            return validatePhone(element, errorElement, nameMapper[fieldId]);
        default:
            return 0
    }
}

//校验
function validator(validateItems, nameMapper) {
    let count = 0;
    validateItems.forEach(item => {
        count = count + validateMapper(item.fieldId, item.type, nameMapper);
    });
    return count;
}


function validateForm(fieldId, type) {
    let count = 0;
    let nameMapper = {
        username: '姓名',
        phone: '手机号码',
        phoneCode: '验证码'
    }
    let errorCount = validator([{ fieldId, type, }], nameMapper);
    count = count + errorCount;
    if (count) {
        errorElement = $(`#${fieldId}Error`);
        errorElement.show();
        setShowTimeout(errorElement);
    }
    return count
}

//监听输入框输入文字个数
function inputListener(inputElement, maxLength) {
    let flag = true;
    inputElement.on('compositionstart', function () {
        flag = false;
    });

    inputElement.on('compositionend', function () {
        flag = true;
    });

    inputElement.on('input', function () {
        setTimeout(function () {
            if (flag) {
                let textnum = inputElement.val().replace(/\s+/g, "").length;
                $('.text-count .count').text(textnum);
                if (textnum < maxLength) {
                    $('.text-count .limit').text('');
                    $('.text-count .count').css('color', '#999');
                }
                if (textnum === maxLength) {
                    $('.text-count .limit').text(`您最多只能输入${maxLength}字`);
                    $('.text-count .count').css('color', '#ff3344');
                }
            }
        }, 100);
    });
}

// 列表轮播
(function ($) {
    FCZX.globalNamespace('FCZX.Switch');

    FCZX.Switch = function (opt) {
        this._init(opt)
    }

    $.extend(FCZX.Switch.prototype, {
        isMoveOver: true, //是否完成位移
        _init: function (opt) {
            let _this = this;
            _this.opt = {
                listSelector: '', //轮播列表选择器
                itemSelector: '', //轮播列表项选择器
                leftSelector: '', //左轮播按钮选择器
                rightSelector: '', //右轮播按钮选择器
                pointItemWidth: 0, //轮播判断点，默认整块轮播
                showItemCount: 5, //显示轮播个数
                arrowDisClass: '', // 置灰按钮，不可点击
            }
            $.extend(true, _this.opt, opt || {});
            _this._initDomEvent();
            return _this;
        },
        _initDomEvent: function () {
            let _this = this;
            let opt = this.opt;
            this.$list = $(opt.listSelector);
            this.$item = $(opt.itemSelector);
            this.$left = $(opt.leftSelector);
            this.$right = $(opt.rightSelector);

            opt.totalItemCount = this.$item.length;
            opt.itemWidth = this.$item.outerWidth(true); // 必须设置item的width样式才生效
            opt.stepWidth = opt.itemWidth * opt.showItemCount;
            opt.moveCondition = opt.itemWidth * (1 - opt.showItemCount);

            _this._initListWith();

            if (opt.arrowDisClass) {
                this._setArrowClass(); // 按钮不隐藏，通过disable按钮控制
            } else {
                this._showArrow(); // 当没有足够轮播项不显示按钮
            }

            //默认整块轮播
            if (opt.pointItemWidth === 0) {
                opt.pointItemWidth = (1 - this.getTotalPage()) * opt.stepWidth;
            }

            this.$left.off('click.switch').on('click.switch', function () {
                if (_this.$left.hasClass(opt.arrowDisClass)) return;
                if (!_this.isMoveOver) return;
                _this.isMoveOver = false;
                _this._movePrev(opt);
            });

            this.$right.off('click.switch').on('click.switch', function () {
                if (_this.$right.hasClass(opt.arrowDisClass)) return;
                if (!_this.isMoveOver) return;
                _this.isMoveOver = false;
                _this._moveNext(opt);
            });
        },
        _initListWith: function () {
            let opt = this.opt;
            this.$list.css('width', opt.itemWidth * opt.totalItemCount);
        },
        _initListLeft: function () {
            this.$list.css('left', 0);
        },
        _setArrowClass() {
            let opt = this.opt;
            if (opt.totalItemCount <= opt.showItemCount) {
                this.$left.addClass(opt.arrowDisClass);
                this.$right.addClass(opt.arrowDisClass);
            } else {
                this.$left.removeClass(opt.arrowDisClass);
                this.$right.removeClass(opt.arrowDisClass);
            }
        },
        _showArrow() {
            let opt = this.opt;
            if (opt.totalItemCount > opt.showItemCount) {
                this.$left.show();
                this.$right.show();
            } else {
                this.$left.hide();
                this.$right.hide();
            }
        },
        _movePrev: function (opt) {
            let _this = this;
            let $list = _this.$list;
            let itemLeft = parseInt($list.css('left'));
            if (itemLeft === 0) {
                $list.animate({ left: `${opt.pointItemWidth}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            } else {
                let newItemLeft = itemLeft + opt.stepWidth;
                $list.animate({ left: `${newItemLeft}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            }
            return _this;
        },
        _moveNext: function (opt) {
            let _this = this;
            let $list = _this.$list;
            let itemLeft = parseInt($list.css('left'));
            if (itemLeft === opt.pointItemWidth) {
                $list.animate({ left: 0 }, 300, function () {
                    _this.isMoveOver = true;
                });
            } else {
                let newItemLeft = itemLeft - opt.stepWidth;
                $list.animate({ left: `${newItemLeft}px` }, 300, function () {
                    _this.isMoveOver = true;
                });
            }
            return _this;
        },
        getTotalPage: function () {
            let totalPage = 0;
            let opt = this.opt;
            totalPage = Math.ceil(opt.totalItemCount / opt.showItemCount);
            return totalPage;
        }
    })
})(jQuery);

// 大图轮播点击

(function ($) {
    FCZX.globalNamespace('FCZX.SwitchShow');

    FCZX.SwitchShow = function (opt) {
        this._init(opt);
    }

    $.extend(FCZX.SwitchShow.prototype, {
        _init: function (opt) {
            this.opt = {
                imgIndex: 0,
                showOpt: null,
                listOpt: null,
                activedCallback: null
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$showImg = $(_opt.showOpt.imgSelector);
            _opt.$showOri = $(_opt.showOpt.oriSelector);
            _opt.$showWrap = $(_opt.showOpt.showSelector);
            _opt.$showLeft = $(_opt.showOpt.leftSelector);
            _opt.$showRight = $(_opt.showOpt.rightSelector);
            _opt.listCarousel = new FCZX.Switch(_opt.listOpt);
            _this._itemEventHandler();
            _this._showEventHandler();
        },
        _itemEventHandler: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.listCarousel.$item.each(function (index) {
                $(this).on('click.listItem', function () {
                    _this.setActivedItem(index);
                });
            })
        },
        _showEventHandler: function () {
            let _this = this;
            let _opt = _this.opt;
            let itemLen = _opt.listCarousel.$item.length - 1;

            _opt.$showLeft.off('click.itemShow').on('click.itemShow', function () {
                if (_opt.imgIndex <= 0) {
                    alert('已经是第一张了');
                    return;
                }
                _opt.imgIndex = _opt.imgIndex - 1;
                _this.setActivedItem(_opt.imgIndex);
                _this._movePosition(_opt.imgIndex);
            });

            _opt.$showRight.off('click.itemShow').on('click.itemShow', function () {
                if (_opt.imgIndex >= itemLen) {
                    alert('已经是最后一张了');
                    return;
                }
                _opt.imgIndex = _opt.imgIndex + 1;
                _this.setActivedItem(_opt.imgIndex);
                _this._movePosition(_opt.imgIndex);
            });
        },
        _movePosition: function (index) {
            let _this = this;
            let _opt = _this.opt;
            let $list = _opt.listCarousel.$list;
            let targetItem = _opt.listCarousel.$item.eq(index);
            let stepWidth = _opt.listCarousel.opt.stepWidth;
            let moveCondition = _opt.listCarousel.opt.moveCondition;
            // 子元素与直接上级元素的距离
            let itemPosition = targetItem.position().left;
            //计算当前页
            let currentPage = Math.floor(itemPosition / stepWidth);
            let relativePosition = $list.parent().offset().left - targetItem.offset().left;
            // 计算可视范围内相对偏移量
            if (relativePosition < moveCondition || relativePosition > 0) {
                $list.stop().animate({ left: `-${currentPage * stepWidth}px` }, 300);
            }
        },
        _changeImgSrc: function (index) {
            let _this = this;
            let _opt = _this.opt;
            let $img = _opt.listCarousel.$item.eq(index).find('img');
            let imgSrc = $img.attr('src')
            _opt.$showImg.attr('src', imgSrc);
            _opt.$showOri.attr('href', imgSrc);
            if (typeof (_opt.showOpt.callback) == 'function') {
                _opt.showOpt.callback(_opt.$showImg, index);
            }
        },
        setActivedItem: function (currentIndex) {
            let _this = this;
            let _opt = _this.opt;
            let $item = _opt.listCarousel.$item;
            _this._changeImgSrc(currentIndex);

            if ($item.hasClass('actived')) {
                $item.removeClass('actived');
            }
            $item.eq(currentIndex).addClass('actived');
            _opt.imgIndex = currentIndex;
            if (typeof (_opt.activedCallback) == 'function') {
                _opt.activedCallback(currentIndex);
            }
        }
    });
})(jQuery);

// 全屏轮播
function initScreenDomEvent(listHtml, screenIndex = 0) {
    // 初始化小图列表
    let screenList = $('#screenPictureList');
    screenList.html(listHtml);
    // 初始化小图轮播参数
    let showItemCount = 15;
    let screenLoop = new FCZX.SwitchShow({
        imgIndex: screenIndex,
        showOpt: {
            imgSelector: '#screenShowPicture',
            leftSelector: '#screenShowArrowLeft',
            rightSelector: '#screenShowArrowRight'
        },
        listOpt: {
            listSelector: '#screenPictureList',
            itemSelector: '#screenPictureList li',
            leftSelector: '#screenListArrowLeft',
            rightSelector: '#screenListArrowRight',
            moveCondition: -1708,
            showItemCount
        }
    });

    screenLoop.setActivedItem(screenIndex);

    // 显示全屏
    $('#fullscreen').show();
    $('html').addClass('modal-open');

    // 关闭大屏
    $('#fullscreenCloseBtn').click(function () {
        $('#fullscreen').hide();
        $('html').removeClass('modal-open');
    });
}

// 获取图片标签信息

function initImageData(listImages) {
    let imageData = [];
    listImages.each(function () {
        imageData.push({
            imgSrc: $(this).attr('src')
        })
    });
    return imageData;
}

//自动调整图片大小

function resizeImage(imgElement, maxWidth, maxHeight) {
    let ratio = maxWidth / maxHeight;
    let imgSrc = imgElement.attr('src');
    getImageRealSize(imgSrc, function (width, height) {
        let imgRatio = width / height;
        if (ratio > imgRatio) {
            imgElement.css({
                width: width * (maxHeight / height),
                height: maxHeight
            });
        } else {
            imgElement.css({
                width: maxWidth,
                height: height * (maxWidth / width)
            });
        }
    });
}

//获取图片实际大小
function getImageRealSize(imgSrc, callback) {
    if (!imgSrc) return;
    let img = new Image();
    img.src = imgSrc;
    //如果图片被缓存则取缓存图片，否则待图片加载完毕在获取
    if (img.complete) {
        callback(img.width, img.height);
    } else {
        img.onload = function () {
            callback(img.width, img.height);
        };
    }
}

/*集客回调函数*/
function callbackHouseCustomer(houseId, type, username, phoneNumber, phoneCode) {
    app.request({
        url: app.areaApiUrl('/house/customer'),
        data: {
            real_name: username,
            mobile: phoneNumber,
            randCode: phoneCode,
            type: type,
            fang_house_id: houseId,
        },
        type: 'POST',
        dataType: 'json',
        headers: {},
        done: function () {
            $.MsgModal.Success('恭喜您，已订阅成功！', '感谢您对房产在线的关注，本楼盘/房源最新信息我们会第一时间通知您!');
        }
    });
}

// 倒计时intDiff倒计时总秒数

function timeCountDown(intDiff, showElement) {
    setInterval(function () {
        let day = 0;
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (intDiff > 0) {
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        showElement.html(`${day}天 ${hour}小时 ${minute}分钟`);
        intDiff--;
    }, 1000);
}

// 常量
let SALE_STATUS = {
    1: '在售',
    2: '待售',
    3: '售完',
}

let PRICE_TYPE = {
    1: '元/平方米',
    2: '万元/套'
}

// url参数转对象 ?name="nyan" => {name: "nyan"}
function transferUrlParam(urlParam) {
    let param = {};
    if (!urlParam) {
        return param;
    }
    if (urlParam.indexOf("?") !== -1) {
        urlParam = urlParam.substring(1);
    }
    const urlParams = urlParam.split("&");
    urlParams.forEach(item => {
        if (item) {
            const itemArr = item.split("=");
            param[itemArr[0]] = itemArr[1];
        }
    });
    return param
}
// 对象转url参数 {name: "nyan"} => ?name="nyan"
function toUrlParam(param) {
    if (!param) return;
    if (typeof param !== "object") return;
    let urlParam = "";
    for (const key in param) {
        if (param.hasOwnProperty(key)) {
            if (urlParam) {
                urlParam = urlParam + `&${key}=${param[key]}`;
            } else {
                urlParam = urlParam + `?${key}=${param[key]}`;
            }
        }
    }
    return urlParam;
}

// 自定义下拉框
(function ($) {
    FCZX.globalNamespace('FCZX.Select');

    FCZX.Select = function (opt) {
        this._init(opt)
    }

    $.extend(FCZX.Select.prototype, {
        _init: function (opt) {
            this.opt = {
                selectContS: '.select-content', //下拉框选择器
                selectTextS: '.select-text', //选择项目显示,
                selectListS: '.select-list', //下拉选项框
                optionS: 'li', //选项
                dataProp: 'value', //取值key
                labelProp: 'label', //标签名取值key
                allValue: 'all', //当选择所有的时候值,
                isHover: true
            }
            $.extend(true, this.opt, opt || {});
            this._initDomEvent();
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _this.$selectCont = $(_opt.selectContS);
            _this.$selectList = _this.$selectCont.find(_opt.selectListS);

            if (_opt.isHover) {
                _this._hoverSelectEvent();
            } else {
                _this._clickSelectEvent();
            }

            _this.$selectList.find(_opt.optionS).each(function () {
                $(this).on('click.selectOption', function () {
                    let text = $(this).text()
                    let value = $(this).data(_opt.dataProp);
                    let selectText = $(this).parent().siblings(_opt.selectTextS);
                    let $span = selectText.find('span');
                    let $input = selectText.find('input');
                    if (!value || value == _opt.allValue) {
                        $span.text($span.data(_opt.labelProp));
                        $input.val('');
                        selectText.removeClass('actived');
                    } else {
                        $span.text(text);
                        $input.val(value);
                        selectText.addClass('actived');
                    }
                    $(_this).trigger('change', [$input]);

                    if (_opt.isHover) {
                        _this.$selectList.hide();
                    }
                });
            });
        },
        _hoverSelectEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _this.$selectCont.each(function () {
                $(this).hover(function () {
                    $(this).find(_opt.selectListS).show();
                }, function () {
                    $(this).find(_opt.selectListS).hide();
                });
            })
        },
        _clickSelectEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            let allSelectList = _this.$selectList;
            $(document).click(function (event) {
                let $target = $(event.target).parents(_opt.selectContS);
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
        }
    });
})(jQuery);