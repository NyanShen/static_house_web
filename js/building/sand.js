$(document).ready(function () {
    /*沙盘图*/
    let child = $('#sandPicture');
    justifyElement(child);
    dragPicture(child);

    /*沙盘图标签轮播*/
    let listSelector = '.sand-info-list';
    let leftSelector = '#sandArrowPrev';
    let rightSelector = '#sandArrowNext';
    let totalItemCount = $('.sand-info-list li').length;
    let itemWith = 100;
    let stepWith = 500;
    let showItemCount = 5;
    new CustomCarousel({ listSelector, leftSelector, rightSelector, totalItemCount, showItemCount, itemWith, stepWith });

    /*列表项目点击*/
    let picSelcetor = '#sandPicture .sand-item';
    let tabSelector = '.sand-info-list li';
    bindSandEvent(picSelcetor, tabSelector);
    bindSandEvent(tabSelector, picSelcetor);

    function bindSandEvent(clickSelector, activeSelector) {
        $(clickSelector).each(function () {
            $(this).click(function () {
                $(this).siblings().removeClass('actived');
                $(this).addClass('actived');
                let dataId = $(this).attr('data-id');
                $(activeSelector).siblings().removeClass('actived');
                $(`${activeSelector}[data-id=${dataId}]`).addClass('actived');
                let tabItem = $(`${tabSelector}[data-id=${dataId}]`);
                let itemOffsetLeft = tabItem.offset().left;
                let headerOffsetLeft = $('.sand-info-header').offset().left;
                // 子元素与上上级元素的距离
                let relativePosition = headerOffsetLeft - itemOffsetLeft; 
                // 子元素与直接上级元素的距离
                let itemPosition = tabItem.position().left;
                //计算当前页
                let currentPage = Math.floor(itemPosition / stepWith);

                if (relativePosition < -400 || relativePosition > 0) {
                    $(listSelector).css('left', `-${currentPage * stepWith}px`);
                }
            });
        });
    }
});