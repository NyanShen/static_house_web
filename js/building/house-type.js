$(document).ready(function () {
    $('.house-type-all .house-type-image img').each(function () {
        resizeImage($(this), 208, 158);
    });

    /*每一页显示10条，判断总数是否大于10条*/
    let totalCount = 10; //todo
    if (totalCount >= 10) {
        $('#houseTypePagination').show();
    }

    /*在线咨询popup*/
    $('#hxConsultHidden .consultant-info').each(function (index) {
        $(this).hover(function () {
            $('#hxConsultHidden').css('height', '320px');
            $(this).children('.consultant-scan-popup').show();
        }, function () {
            $('#hxConsultHidden').css('height', '106px');
            $(this).children('.consultant-scan-popup').hide();
        })
    });

    /*置业顾问轮播*/
    new FCZX.Switch({
        listSelector: '#hxConsultHidden .consultant-hidden-list',
        itemSelector: '#hxConsultHidden .consultant-hidden-list li',
        leftSelector: '#arrowLeft',
        rightSelector: '#arrowRight',
        arrowDisClass: 'arrow-disabled',
        showItemCount: 4
    });

    // 户型图详情
    let currentIndex = 1;
    
    let houseTypeData = [
        {
            id: 1001,
            name: "4A高层户型",
            room: "4",
            office: '2',
            toilet: "2",
            kitchen: '1',
            sale_status: "0",
            building_area: '120',
            image_path: '//static.fczx.com/www/assets/images/house_type_1400x1122.png',
        },
        {
            id: 1002,
            name: "2B高层户型",
            room: "3",
            office: '1',
            toilet: "1",
            kitchen: '1',
            sale_status: "1",
            building_area: '109',
            image_path: '//static.fczx.com/www/assets/images/hx_850x10000.jpg',
        }
    ]

    /*户型图列表小屏大图轮播*/

    let houseTypeLoop = new FCZX.SwitchShow({
        showOpt: {
            imgSelector: '.htd-content .carousel-show img',
            leftSelector: '#hxtShowArrowLeft',
            rightSelector: '#hxtShowArrowRight',
            callback: function (showImage, imageIndex) {
                currentIndex = imageIndex;
                resizeImage(showImage, 700, 600);
            }
        },
        listOpt: {
            listSelector: '#hxtDetailList',
            itemSelector: '#hxtDetailList li',
            leftSelector: '#hxtArrowLeft',
            rightSelector: '#hxtArrowRight',
            showItemCount: 6
        },
        activedCallback: function (index) {
            let houseTypeItem = houseTypeData[index];
            console.log(houseTypeItem)
        }
    });

    houseTypeLoop.setActivedItem(currentIndex);

    $('#fullscreenBtn').click(function () {
        let listHtml = '';
        for (const item of houseTypeData) {
            listHtml = listHtml + `<li><img src="${item.image_path}" alt=""></li>`;
        }
        initScreenDomEvent(listHtml, currentIndex);
    });

    // /*户型导航列表超过长度逻辑*/
    // let listSelector = '#hxtNavList';
    // let itemSelector = '#hxtNavList li';
    // let leftSelector = '#navArrowLeft';
    // let rightSelector = '#navArrowRight';
    // new FCZX.Switch({ listSelector, itemSelector, leftSelector, rightSelector });


    /*在线咨询popup*/
    $('#consultants .consultant-info').each(function (index) {
        $(this).hover(function () {
            $(this).children('.consultant-scan-popup').show();
        }, function () {
            $(this).children('.consultant-scan-popup').hide();
        })
    });
});