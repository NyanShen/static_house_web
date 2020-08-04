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
function switchMenu(tagId, scrollInstance) {
    let selector = `#${tagId} .menu-item ul li a`;
    $(selector).each(function () {
        $(this).click(function () {
            let knowId = $(this).find('input').val();
            let $knowList = $(`#${tagId} .know-right .know-list`);
            app.request({
                url: app.areaApiUrl('/test/test'),
                data: {
                    id: knowId
                },
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function (res) {

                }
            });
            let knowData = {
                id: '11001',
                knowList: [{
                    id: '11001',
                    image_path: '//static.fczx.com/www/assets/images/1400x933.jpg',
                    know_title: '商品房退房条件，房价下跌能退房吗，想退房怎么办？',
                    know_desc: '具体描述：商品房退房条件，房价下跌能退房吗，想退房怎么办？',
                    know_link: '/pages/knowledge/detail.html',
                    zan_count: '2'
                },
                {
                    id: '11002',
                    image_path: '//static.fczx.com/www/assets/images/1400x933_1.jpg',
                    know_title: '改善型购房者换房：先买房还是先卖房？',
                    know_desc: '改善型购房者换房：先买房还是先卖房？',
                    know_link: '/pages/knowledge/detail.html',
                    zan_count: '5'
                }]
            };
            $knowList.html(generateKnowList(knowData.knowList));
            updateKnowRightHeight(tagId);
            scrollInstance._initSliderHeight();
            $(selector).removeClass('actived')
            $(this).addClass('actived');
        });
    });
}
function generateKnowList(dataList) {
    let _html = '';
    for (const item of dataList) {
        _html = _html + `
            <li class="clearfix">
                <div class="picture fl">
                    <a href="${item.know_link}" target="_blank">
                        <img src="${item.image_path}" alt="">
                    </a>
                </div>
                <div class="describe fl">
                    <p>
                        <a href="${item.know_link}" class="title">${item.know_title}</a>
                        <a href="javascript:void(0);" class="collect" data-id="${item.id}">收藏</a>
                    </p>
                    <p class="desc">
                        <span class="desc-color">${item.know_desc}</span>
                    </p>
                    <p class="comment">
                        <i></i>
                        <span>(${item.zan_count})</span>
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
        toggleMenu(knowSelector, knowListScroll);
        switchMenu(knowSelector, knowListScroll);
        $(this).find('.know-right').hover(function () {
            $(this).find('.scroll-bar').show();
        }, function () {
            $(this).find('.scroll-bar').hide();
        })
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
                done: function (res) {
                    
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
    })

});