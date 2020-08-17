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
            let _siblings = _this.siblings('.menu-list');
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
function switchMenu(tagId, scrollInstance) {
    let selector = `#${tagId} .menu-item .menu-list a`;
    $(selector).each(function () {
        $(this).click(function () {
            let _this = $(this);
            let knowId = $(this).find('input').val();
            let knowName = $(this).text();
            let $knowList = $(`#${tagId} .know-right .know-list`);
            let checkMore = $(`#${tagId} .know-right .check-more`);
            app.request({
                url: app.apiUrl('/knowledge/list'),
                data: {
                    id: knowId
                },
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function (res) {
                    let knowList = res.data;
                    if (knowList && knowList.length > 0) {
                        checkMore.show();
                    } else {
                        checkMore.hide();
                    }
                    checkMore.find('a').attr('href', `/list/${knowId}.html?keyword=${knowName}`);
                    $knowList.html(generateKnowList(knowList));
                    updateKnowRightHeight(tagId);
                    scrollInstance._initSliderHeight();
                    $(selector).removeClass('actived')
                    _this.addClass('actived');
                }
            });
        });
    });
}
function generateKnowList(dataList) {
    let _html = '';
    for (const item of dataList) {
        _html = _html + `
            <li class="clearfix">
                <div class="picture fl">
                    <a href="/detail/${item.id}.html" target="_blank">
                        <img src="${item.image_path}" alt="">
                    </a>
                </div>
                <div class="describe fl">
                    <p>
                        <a href="/detail/${item.id}.html" class="title" target="_blank">${item.title}</a>
                    </p>
                    <p class="desc">
                        <span class="desc-color">${item.description}</span>
                    </p>
                    <p class="comment">
                        <i></i>
                        <span>(${item.like_num})</span>
                    </p>
                </div>
            </li>
        `;
    }
    return _html;
}

$(document).ready(function () {

    $('.know-index .know-item').each(function (index) {
        let knowSelector = `know_${index}`;
        let knowListScroll = getCustomScrollBarInstance(knowSelector);
        updateKnowRightHeight(knowSelector);
        knowListScroll._initSliderHeight();
        toggleMenu(knowSelector, knowListScroll);
        switchMenu(knowSelector, knowListScroll);
    });

    $('.know-list').find('.collect').each(function () {
        let _this = $(this);
        $(this).click(function () {
            let knowId = $(this).attr('data-id');
            app.request({
                url: app.areaApiUrl('/test/test'),
                data: {
                    id: knowId
                },
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function () {

                }
            });
            if (_this.hasClass('collected')) {
                _this.removeClass('collected');
                _this.text('收藏');
            } else {
                _this.addClass('collected');
                _this.text('已收藏');
            }
        });
    });
});