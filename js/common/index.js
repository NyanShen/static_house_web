$(document).ready(function () {
    /*回到顶部*/
    backToTop();
    /*热门团购*/
    $('.hot-purchase>.item').each(function () {
        $(this).hover(function () {
            $(this).addClass('on');
            let siblings = $(this).siblings('.item');
            siblings.removeClass('on');
        });
    });
});

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

/*模块轮播*/

(function (win) {
    function CustomCarousel(params) {
        this._init(params)
    }

    $.extend(CustomCarousel.prototype, {
        _init: function (params) {
            let _this = this;
            _this.params = {
                listSelector: '', //轮播列表选择器
                leftSelector: '', //左轮播按钮选择器
                rightSelector: '', //右轮播按钮选择器
                itemWith: 0, //每个轮播的宽度
                stepWith: 0, //每次轮播步长
                pointItemWidth: 0, //轮播判断点
                showItemCount: 5, //显示轮播个数
                totalItemCount: 0, //轮播总个数
                isMoveOver: true, //是否完成位移
                initHiddenArrow: true, //左右按钮（初始化）是否显示
            }
            $.extend(true, _this.params, params || {});
            _this._initDomEvent();
            _this._initListWith();
            return _this;
        },
        _initDomEvent: function () {
            let _this = this;
            let params = this.params;
            this.$list = $(params.listSelector);
            this.$left = $(params.leftSelector);
            this.$right = $(params.rightSelector);

            //默认整块轮播
            if (params.pointItemWidth === 0) {
                params.pointItemWidth = (1 - this.getTotalPage(params)) * params.stepWith;
            }

            if (params.initHiddenArrow) {
                this._showArrow(params);
            }

            this.$left.click(function () {
                if (params.isMoveOver) {
                    _this._movePrev(params);
                }
            });

            this.$right.click(function () {
                if (params.isMoveOver) {
                    _this._moveNext(params);
                }
            });
        },
        _initListWith: function () {
            let params = this.params;
            this.$list.css('width', `${(params.totalItemCount + 1) * params.itemWith}px`);
        },
        _showArrow: function (params) {
            let _this = this;
            //如果总的轮播个数大于显示的轮播个数就显示arrow
            if (params.totalItemCount > params.showItemCount) {
                _this.$left.show();
                _this.$right.show();
            } else {
                _this.$left.hide();
                _this.$right.hide();
            }
        },
        _movePrev: function (params) {
            let _this = this;
            let $list = _this.$list;
            let itemLeft = parseFloat($list.css('left'));
            if (itemLeft === 0) {
                $list.css('left', `${params.pointItemWidth}px`);
            } else {
                params.isMoveOver = false;
                let newItemLeft = itemLeft + params.stepWith;
                $list.animate({ left: `${newItemLeft}px` }, 300, _this.resetMoveOver(params))
            }
            return _this;
        },
        _moveNext: function (params) {
            let _this = this;
            let $list = _this.$list;
            let itemLeft = parseFloat($list.css('left'));
            if (itemLeft === params.pointItemWidth) {
                $list.css('left', 0);
            } else {
                params.isMoveOver = false;
                let newItemLeft = itemLeft - params.stepWith;
                $list.animate({ left: `${newItemLeft}px` }, 300, _this.resetMoveOver(params))
            }
            return _this;
        },
        resetMoveOver: function (params) {
            params.isMoveOver = true;
        },
        getTotalPage: function (params) {
            let totalPage = 0;
            totalPage = Math.ceil(params.totalItemCount / params.showItemCount);
            return totalPage;
        }
    })
    win.CustomCarousel = CustomCarousel;
})(window)

//自动调整图片大小

function resizeImage(imgElement, maxWidth, maxHeight) {
    imgElement.on('load', function () {
        let ratio = 0;
        let width = imgElement.width();
        let height = imgElement.height();
        if (width > maxWidth) {
            ratio = maxWidth / width;
            imgElement.css({
                width: maxWidth,
                height: ratio * height
            });
        }
        if (height > maxHeight) {
            ratio = maxHeight / height;
            imgElement.css({
                width: ratio * width,
                height: maxHeight
            });
        }
    });
}