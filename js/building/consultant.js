$(document).ready(function () {
    /*在线咨询popup*/
    $('.consultant-hidden-list li .consultant-info').each(function(index) {
        $(this).hover(function() {
            $(this).children('.consultant-scan-popup').show();
        }, function() {
            $(this).children('.consultant-scan-popup').hide();
        })
    })
    /*置业顾问轮播*/
    let consultantCarouselList = $('.consultant-hidden-list');
    let consultantArrowLeft = $('.consultant-carousel>.arrow-left');
    let consultantArrowRight = $('.consultant-carousel>.arrow-right');
    let consultantListLength = $('.consultant-hidden-list li').length;
    let consultantItemWidth = 240;
    let consultantStepWidth = 1200;
    let consultantShowLength = 5;
    let isMoveOver = true;

    if (consultantListLength < 6) return;

    consultantArrowLeft.show();
    consultantArrowRight.show();

    let pointItemWidth = (1 - Math.ceil(consultantListLength / consultantShowLength)) * consultantStepWidth;

    consultantCarouselList.css('width', (consultantListLength + 1) * consultantItemWidth + 'px');

    consultantArrowRight.click(function () {
        if (isMoveOver) {
            moveNext();
        }
    });

    consultantArrowLeft.click(function () {
        if (isMoveOver) {
            movePrev();
        }
    });

    function resetMoveOver() {
        isMoveOver = true;
    }

    function movePrev() {
        isMoveOver = false;
        let itemLeft = parseFloat(consultantCarouselList.css('left'));
        if (itemLeft === 0) {
            consultantCarouselList.css('left', `${pointItemWidth}px`);
            isMoveOver = true;
        } else {
            let newItemLeft = itemLeft + consultantStepWidth;
            consultantCarouselList.animate({ left: `${newItemLeft}px` }, 300, resetMoveOver)
        }
    }

    function moveNext() {
        isMoveOver = false;
        let itemLeft = parseFloat(consultantCarouselList.css('left'));
        if (itemLeft === pointItemWidth) {
            consultantCarouselList.css('left', 0);
            isMoveOver = true;
        } else {
            let newItemLeft = itemLeft - consultantStepWidth;
            consultantCarouselList.animate({ left: `${newItemLeft}px` }, 300, resetMoveOver)
        }
    }
});