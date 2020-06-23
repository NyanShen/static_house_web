/*重新计算列表高度*/
function updateKnowledgeRightHeight(tagId) {
    let knowledgLeftHeight = $(`#${tagId} .knowledge-left`).height();
    $(`#${tagId} .knowledge-right`).height(knowledgLeftHeight);
}
/*菜单展开收起*/
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
            updateKnowledgeRightHeight(tagId);
            scrollInstance._initSliderHeight();
        });
    });
}
/*切换菜单选项*/
function switchMenu(tagId) {
    let selector = `#${tagId} .menu-item ul li a`;
    $(selector).each(function () {
        $(this).click(function () {
            $(selector).removeClass('actived')
            $(this).addClass('actived');
        });
    });
}
$(document).ready(function () {
    /*重新计算列表高度*/
    updateKnowledgeRightHeight('knowledgePurchase');
    updateKnowledgeRightHeight('knowledgeRent');
    /*买房知识滚动事件*/
    let knowledgePurchaseInstance = getCustomScrollBarInstance('knowledgePurchase');
    let knowledgeRentInstance = getCustomScrollBarInstance('knowledgeRent');
    /*菜单展开收起*/
    toggleMenu('knowledgePurchase', knowledgePurchaseInstance);
    toggleMenu('knowledgeRent', knowledgeRentInstance);
    /*切换菜单选项*/
    switchMenu('knowledgePurchase');
    switchMenu('knowledgeRent');
});