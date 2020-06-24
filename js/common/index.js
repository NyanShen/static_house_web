//居中图片
function justifyPicture(child) {
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