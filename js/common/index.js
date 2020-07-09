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