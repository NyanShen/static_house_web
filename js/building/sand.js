$(document).ready(function () {
    /*设置公共变量*/
    let sandPicture = $('#sandPicture');
    let sandImage = $('#sandPicture img');
    let sandInfoList = $('#sandInfoList');
    let itemWith = 100;
    let stepWith = 500;
    let showItemCount = 5;
    let itemInfo = {};
    let picSelcetor = '#sandPicture .sand-item';
    let tabSelector = '.sand-info-list li';

    /*获取沙盘信息请求*/
    app.request({
        url: app.areaApiUrl('/house/get-sand'),
        data: {
            id: 194
        },
        type: 'GET',
        dataType: 'json',
        headers: {},
        done: function (res) {
            let sandData = res.data;
            let imgSrc = sandData.fang_sand_pic;
            let sandItems = sandData.sandBuilding;
            sandImage.attr('src', imgSrc);
            getImageRealSize(imgSrc, function (width, height) {
                let maxHeight = 800;
                if (height >= maxHeight) {
                    height = maxHeight;
                    sandImage.css('height', maxHeight);
                }
                sandPicture.css({ width, height, position: 'relative' });
                justifyElement(sandPicture);
                dragPicture(sandPicture);
            });
            if (sandItems.length <= 0) {
                $('.sand-info-content').html('<span class="text-color">我们正在努力完善信息，敬请期待！</span>');
                return;
            }
            generateSandHtml(sandItems);
            bindSandEvent(picSelcetor, tabSelector, tabSelector);
            bindSandEvent(tabSelector, picSelcetor, tabSelector);
        }
    });

    /*添加沙盘项目*/
    function generateSandHtml(sandItems) {
        let _item_html = '';
        let _list_html = '';
        for (const item of sandItems) {
            _item_html = _item_html +
                `<div class="sand-item ${getSandItemClass(item.sale_status)}" data-id="${item.id}" style="${item.style}">
                    <span>${item.name}</span><i></i>
                </div>`;

            _list_html = _list_html + `<li data-id="${item.id}">${item.name}</li>`;
            itemInfo = $.extend(true, itemInfo, {
                [item.id]: {
                    name: item.name,
                    openTime: formatDate(item.open_time),
                    deliverTime: formatDate(item.deliver_time),
                    planHouseholds: item.plan_households || "暂无数据",
                    elevatorRatio: `${item.elevator_number}梯${item.elevator_households}户`,
                    storeyHeight: item.storey_height || "暂无数据"
                }
            });
        }
        sandPicture.append(_item_html);
        sandInfoList.append(_list_html);
        sandcarousel();
        //设置默认选项
        let firstItem = $(tabSelector).first();
        firstItem.addClass('actived');
        setSandDetail(firstItem.attr('data-id'));
    }

    /*格式化日期*/
    function formatDate(timestamp) {
        if (timestamp == 0 || !timestamp) {
            return "暂无数据"
        }
        return app.date(timestamp, 'yyyy-MM-dd');
    }

    /*获取状态样式*/
    function getSandItemClass(saleStatus) {
        if (saleStatus == 1) {
            return 'unsold'
        }
        else if (saleStatus == 2) {
            return 'solding'
        }
        else {
            return 'solded'
        }
    }

    /*沙盘图标签轮播*/
    function sandcarousel() {
        let listSelector = '#sandInfoList';
        let leftSelector = '#sandArrowPrev';
        let rightSelector = '#sandArrowNext';
        let totalItemCount = $(tabSelector).length;
        new CustomCarousel({ listSelector, leftSelector, rightSelector, totalItemCount, showItemCount, itemWith, stepWith });
    }

    /*沙盘项目点击事件绑定*/
    function bindSandEvent(clickSelector, activeSelector, tabSelector) {
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
                    sandInfoList.css('left', `-${currentPage * stepWith}px`);
                }
                /*设置沙盘项目信息*/
                setSandDetail(dataId);
            });
        });
    }

    /*设置沙盘项目信息 */
    function setSandDetail(dataId) {
        let itemData = itemInfo[dataId];
        $('#currentSandItem').text(itemData.name);
        $('.open-time').html(`开盘日期：<span>${itemData.openTime}</span>`);
        $('.deliver-time').html(`交房日期：<span>${itemData.deliverTime}</span>`);
        $('.plan-households').html(`规划户数：<span>${itemData.planHouseholds}</span>`);
        $('.elevator-ratio').html(`梯户配比：<span>${itemData.elevatorRatio}</span>`);
        $('.storey-height').html(`楼层：<span>${itemData.storeyHeight}</span>`);
        app.request({
            url: app.areaApiUrl('/house/find-sand-room'),
            data: {
                id: dataId
            },
            type: 'GET',
            dataType: 'json',
            headers: {},
            done: function (res) {
                let _hx_list_html = '';
                $('#sandHouseTypeList').children().remove();
                if (res.data.length <= 0) {
                    $('#sandHouseTypeList').append('<li>暂无对应的户型数据</li>');
                    return;
                }
                for (const item of res.data) {
                    let house = item.fangHouseBuildingRoom
                    _hx_list_html = _hx_list_html +
                        `<li>
                        <span>${house.name}</span>
                        <span>${house.room}室${house.office}厅${house.toilet}卫${house.kitchen}厨</span>
                        <span>${house.building_area}㎡</span>
                        <a href="${house.image_path}" class="check">查看</a>
                    </li>`;
                }
                $('#sandHouseTypeList').append(_hx_list_html);
            }
        });
    }

    /*过滤楼盘状态*/
    $('.sand-state li').each(function () {
        $(this).click(function () {
            let saleStatus = $(this).attr('class');
            let icon = $(this).children().first();
            if (icon.hasClass('checked')) {
                icon.removeClass('checked');
                $(`#sandPicture .${saleStatus}`).hide();
            } else {
                icon.addClass('checked');
                $(`#sandPicture .${saleStatus}`).show();
            }
        });
    });
});