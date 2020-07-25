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

    /*参团*/
    $('.hot-purchase .join').on('click', function () {
        let modalParams = {
            title: $(this).attr('data-title'),
            callback: joinCallback,
            message: '√团购价折扣优惠 √额外礼包 √专属顾问提供购房指导'
        }
        $.FormModal.userForm(modalParams);
    });

    function joinCallback(username, phoneNumber) {
        app.request({
            url: app.areaApiUrl('/test/test'),
            data: {
                username: username,
                mobile: phoneNumber
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function (res) {
            }
        });
    }
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
                itemWidth: 0, //每个轮播的宽度
                stepWidth: 0, //每次轮播步长
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
                params.pointItemWidth = (1 - this.getTotalPage(params)) * params.stepWidth;
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
            this.$list.css('width', params.totalItemCount * params.itemWidth);
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
                let newItemLeft = itemLeft + params.stepWidth;
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
                let newItemLeft = itemLeft - params.stepWidth;
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
})(window);

// 大图轮播点击
function showCarouselEvent(params) {
    let { stepWidth = 0, moveCondition = 0, currentIndex = 0, callback } = params;
    let { arrowLeft, arrowRight, listItems, listImages, listContent, listContentParent } = params;

    let listItemsCount = listItems.length;

    listItems.each(function (index) {
        let $this = $(this);
        $this.click(function () {
            currentIndex = index;
            setCurrentItem(currentIndex);
        });
    });

    arrowLeft.click(function () {
        if (currentIndex <= 0) {
            alert('已经是第一张了');
            return;
        }
        currentIndex = currentIndex - 1;
        setCurrentItem(currentIndex);
    });

    arrowRight.click(function () {
        if (currentIndex >= listItemsCount - 1) {
            alert('已经是最后一张了');
            return;
        }
        currentIndex = currentIndex + 1;
        setCurrentItem(currentIndex);
    });

    function setCurrentItem(currentIndex) {
        let targetItem = listItems.eq(currentIndex);
        listItems.siblings().removeClass('actived');
        targetItem.addClass('actived');
        let imgSrc = listImages.eq(currentIndex).attr('src');
        if (typeof (callback) == 'function') {
            callback(imgSrc, currentIndex);
        }
        // 子元素与直接上级元素的距离
        let itemPosition = targetItem.position().left;
        //计算当前页
        let currentPage = Math.floor(itemPosition / stepWidth);
        let relativePosition = listContentParent.offset().left - targetItem.offset().left;
        // 计算可视范围内相对偏移量
        if (relativePosition < moveCondition || relativePosition > 0) {
            listContent.css('left', `-${currentPage * stepWidth}px`);
        }
    }
}

// 全屏轮播
function initScreenDomEvent(listHtml, screenIndex = 0) {
    // 初始化小图列表
    let screenList = $('#screenPictureList');
    screenList.append(listHtml);
    // 初始化小图轮播参数
    let listSelector = '#screenPictureList';
    let leftSelector = '#screenListArrowLeft';
    let rightSelector = '#screenListArrowRight';
    let itemWidth = 122;
    let stepWidth = 1830;
    let showItemCount = 15;

    let arrowLeft = $('#screenShowArrowLeft');
    let arrowRight = $('#screenShowArrowRight');
    let screenShowImage = $('#screenShowPicture');
    let screenItemList = $('#screenPictureList li');
    let screenImageList = $('#screenPictureList img');
    let totalItemCount = screenItemList.length;
    screenList.css('width', totalItemCount * itemWidth);

    // 设置新显示的大图及当前的小图
    let targetImgSrc = screenImageList.eq(screenIndex).attr('src');
    screenShowImage.attr('src', targetImgSrc);
    if (screenItemList.hasClass('actived')) {
        screenItemList.removeClass('actived')
    }
    screenItemList.eq(screenIndex).addClass('actived');

    // 大图轮播
    let carouselParams = {
        arrowLeft,
        arrowRight,
        listItems: screenItemList,
        listImages: screenImageList,
        listContent: screenList,
        listContentParent: $('#screenCarousel'),
        moveCondition: -1708,
        stepWidth,
        currentIndex: screenIndex,
        callback: function carouselCallback(imgSrc) {
            screenShowImage.attr('src', imgSrc);
        }
    }

    showCarouselEvent(carouselParams);

    // 小图轮播
    new CustomCarousel({ listSelector, leftSelector, rightSelector, totalItemCount, itemWidth, stepWidth, showItemCount });

    // 显示全屏
    $('#fullscreen').show();

    // 关闭大屏
    $('#fullscreenCloseBtn').click(function () {
        screenList.children().remove();
        $('#fullscreen').hide();
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