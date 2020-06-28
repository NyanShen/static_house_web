$(document).ready(function () {
    let index = 0;
    let isMoveOver = true;
    let arrowPrev = $('#arrowPrev');
    let arrowNext = $('#arrowNext');
    let carouselList = $('#carouselList');
    let carouselCurrent = $('#carouselCurrent');
    let carouselListItems = $('#carouselList li');
    let listLength = carouselListItems.length; //轮播总数
    let showLength = 5; // 显示个数
    let stepWidth = 122; // 每个轮播长度
    let fixCurPonit = (showLength - 1) * stepWidth; 
    let pointCurWidth = stepWidth - (listLength - showLength) * stepWidth;
    let pointPicWidth = (showLength - listLength) * stepWidth;

    //初始化图片列表实际长度
    carouselList.css('width', (listLength + 1) * stepWidth + 'px');

    showCurrentCarousel(index);

    function showCurrentCarousel(index) {
        $('#carouselShowList li').css({
            display: 'none'
        });
        $('#carouselShowList li').eq(index).css({
            display: 'block'
        });
    }

    carouselListItems.each(function (index) {
        $(this).click(function () {
            let itemOffset = parseInt($(this).offset().left);
            let wrapOffset = parseInt($('#carouselContainer').offset().left);
            carouselCurrent.css('left', itemOffset - wrapOffset);
            showCurrentCarousel(index);
        })
    })

    arrowPrev.click(function () {
        if (isMoveOver) {
            movePrev();
        }
    });
    arrowNext.click(function () {
        if (isMoveOver) {
            moveNext();
        }
    });

    function resetMoveOver() {
        isMoveOver = true;
    }

    function movePrev() {
        isMoveOver = false;
        let picLeft = parseFloat(carouselList.css('left'));
        let curLeft = parseFloat(carouselCurrent.css('left'));
        if (curLeft > 0 && curLeft <= fixCurPonit) {
            index--;
            let newCurLeft = curLeft - stepWidth;
            carouselCurrent.animate({ left: `${newCurLeft}px` }, 300, resetMoveOver);
        } else if (picLeft === 0 && curLeft === 0) {
            index = listLength - 1;
            carouselCurrent.css('left', `${fixCurPonit}px`);
            carouselList.css('left', `${pointPicWidth}px`);
            isMoveOver = true;
        } else {
            index--;
            let newPicLeft = picLeft + stepWidth;
            carouselList.animate({ left: `${newPicLeft}px` }, 300, resetMoveOver)
        }
        showCurrentCarousel(index);
    }

    function moveNext() {
        isMoveOver = false;
        let picLeft = parseFloat(carouselList.css('left'));
        let curLeft = parseFloat(carouselCurrent.css('left'));
        if (picLeft < pointCurWidth && curLeft < fixCurPonit) {
            index++;
            let newCurLeft = curLeft + stepWidth;
            carouselCurrent.animate({ left: `${newCurLeft}px` }, 300, resetMoveOver);
        } else if (picLeft === pointPicWidth && curLeft === fixCurPonit) {
            index = 0;
            carouselCurrent.css('left', '0');
            carouselList.css('left', '0');
            isMoveOver = true;
        } else {
            index++;
            let newPicLeft = picLeft - stepWidth;
            carouselList.animate({ left: `${newPicLeft}px` }, 300, resetMoveOver)
        }
        showCurrentCarousel(index);
    }
})