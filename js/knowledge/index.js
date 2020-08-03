/*重新计算列表高度*/
function updateKnowRightHeight(tagId) {
    let knowledgLeftHeight = $(`#${tagId} .know-left`).height();
    $(`#${tagId} .know-right`).height(knowledgLeftHeight);
}
/*知识首页菜单展开收起*/
function toggleMenu(tagId, scrollInstance) {
    let selector = `#${tagId} .menu-item .sub-title`;
    $(selector).each(function () {
        $(this).click(function () {
            let _this = $(this);
            let _parent = _this.parent();
            let _siblings = _this.siblings('ul');
            if (_parent.hasClass('down')) {
                _parent.removeClass('down');
                _parent.addClass('right');
                _siblings.hide();
            } else {
                _parent.removeClass('right');
                _parent.addClass('down');
                _siblings.show();
            }
            updateKnowRightHeight(tagId);
            scrollInstance._initSliderHeight();
        });
    });
}
/*切换菜单选项*/
function switchMenu(tagId) {
    let selector = `#${tagId} .menu-item ul li a`;
    $(selector).each(function () {
        $(this).click(function () {
            console.log($(this).find('input').val())
            $(selector).removeClass('actived')
            $(this).addClass('actived');
        });
    });
}
$(document).ready(function () {

    $('.know-index .know-item').each(function (index) {
        let knowSelector = `know_${index}`;
        updateKnowRightHeight(knowSelector);
        toggleMenu(knowSelector, getCustomScrollBarInstance(knowSelector));
        switchMenu(knowSelector);
        $(this).find('.know-right').hover(function () {
            $(this).find('.scroll-bar').show();
         }, function () { 
            $(this).find('.scroll-bar').hide();
         })
    })

});