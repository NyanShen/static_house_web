(function ($) {
    FCZX.globalNamespace('FCZX.user.HouseForm');

    FCZX.user.HouseForm = function (opt) {
        this._init(opt);
    }
    $.extend(FCZX.user.HouseForm.prototype, {
        _init: function (opt) {
            this.opt = {
                selectS: '.select-content-sm',
                formItemS: '.form-item-sm',
                plot: {
                    id: 'plot',
                    selector: '#plot',
                    listSel: '.form-select-list',
                    source_url: '/plot/list'
                },
                contactS: '#contact',
                mobileS: '#mobile',
                roomS: '#room',
                officeS: '#office',
                toiletS: '#toilet',
                floorS: '#floor',
                totalFloorS: '#totalFloor',
                areaS: '#area',
                priceS: '#price',
                directionS: '#direction',
                renovationS: '#renovation',
                regionS: '#region',
                addressS: '#address',
                houseAgeS: '#houseAge',

                houseTitleS: '#houseTitle',
                houseDescS: '#houseDesc',
                salePointS: '#salePoint',
                mindsetS: '#mindset',
                introduceS: '#introduce',

                indoorUploadBtnS: '#indoorUploadBtn',
                indoorImageBtnS: '#indoorImageBtn',
                typeUploadBtnS: '#typeUploadBtn',
                typeImageBtnS: '#typeImageBtn',
                plotUploadBtnS: '#plotUploadBtn',
                plotImageBtnS: '#plotImageBtn',

                rentOpt: {
                    roomBedS: '#roomBed',
                    roomOnlineS: '#roomOnline',
                    roomTVS: '#roomTV',
                    roomIceS: '#roomIce',
                    roomWashS: '#roomWash',
                    roomAirS: '#roomAir',
                    roomWaterS: '#roomWater',
                    roomHeatS: '#roomHeat',
                    roomAllBtnS: '#roomAllBtn',
                    rentEntireS: '#rentEntire',
                    rentShareS: '#rentShare',
                    rentShareInfoS: '#rentShareInfo',
                    rentRoomS: '#rentRoom',
                    rentCountS: '#rentCount',
                    rentConditionS: '#rentCondition',
                    rentPayS: '#rentPay',
                    rentWayValS: 'input[name="rentWay"]:checked',
                    roomequipmentS: 'input[name="roomequipment"]:checkbox',
                },

                submitBtnS: '#housePublishBtn',
                sinPoReg: /^[0-9]$/,
                intWiZeroReg: /^(\+|-)?[1-9][0-9]*$/,
                floatReg: /(^[0]\.{1}\d{1,2}$)|(^[1-9]\d*\.{1}\d{1,2}$)|(^[1-9]{1}\d*$)|(^[0]{1}$)/
            }
            $.extend(true, this.opt, opt || {});

            this._initDomEvent();

            if (opt.type == 'rent') {
                this._initRentDomEvent();
            }
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$plot = $(_opt.plot.selector);
            _opt.$plotList = _opt.$plot.siblings(_opt.plot.listSel);
            _opt.$contact = $(_opt.contactS);
            _opt.$mobile = $(_opt.mobileS);
            _opt.$room = $(_opt.roomS);
            _opt.$office = $(_opt.officeS);
            _opt.$toilet = $(_opt.toiletS);
            _opt.$floor = $(_opt.floorS);
            _opt.$totalFloor = $(_opt.totalFloorS);
            _opt.$area = $(_opt.areaS);
            _opt.$price = $(_opt.priceS);
            _opt.$direction = $(_opt.directionS);
            _opt.$renovation = $(_opt.renovationS);
            _opt.$region = $(_opt.regionS);
            _opt.$address = $(_opt.addressS);
            _opt.$houseAge = $(_opt.houseAgeS);
            _opt.$houseTitle = $(_opt.houseTitleS);
            _opt.$houseDesc = $(_opt.houseDescS);
            _opt.$salePoint = $(_opt.salePointS);
            _opt.$mindset = $(_opt.mindsetS);
            _opt.$introduce = $(_opt.introduceS);

            _opt.$indoorUploadBtn = $(_opt.indoorUploadBtnS);
            _opt.$indoorImageBtn = $(_opt.indoorImageBtnS);
            _opt.$typeUploadBtn = $(_opt.typeUploadBtnS);
            _opt.$typeImageBtn = $(_opt.typeImageBtnS);
            _opt.$plotUploadBtn = $(_opt.plotUploadBtnS);
            _opt.$plotImageBtn = $(_opt.plotImageBtnS);
            _opt.$submitBtn = $(_opt.submitBtnS);
            _this._initPlotEvent();
            new FCZX.Select({ selectContS: _opt.selectS });

            let $allInput = $(`${_opt.contactS}, ${_opt.plot.selector}, ${_opt.roomS}, ${_opt.officeS}, ${_opt.toiletS},
             ${_opt.floorS}, ${_opt.totalFloorS}, ${_opt.areaS}, ${_opt.priceS}, ${_opt.directionS}, ${_opt.renovationS},
              ${_opt.regionS},${_opt.addressS}, ${_opt.houseTitleS}`);

            $allInput.on('focusout', function (event) {
                let $this = $(this);
                switch (event.target.id) {
                    case 'room':
                    case 'office':
                    case 'toilet':
                        _this._checkPattern($this, _opt.sinPoReg, '请填写0-10的数字', false);
                        break;
                    case 'floor':
                    case 'totalFloor':
                        _this._checkPattern($this, _opt.intWiZeroReg, '请填写除0外的数字', false);
                        break;
                    case 'area':
                    case 'price':
                        let label = $this.data('label');
                        _this._checkPattern($this, _opt.floatReg, `请填写正确的${label}`, false);
                        break;
                    default:
                        _this._checkDataEmpty($this, false);

                }
            });

            inputListener(_opt.$houseTitle, 30);
            inputListener(_opt.$houseDesc, 500);
            inputListener(_opt.$salePoint, 500);
            inputListener(_opt.$mindset, 500);
            inputListener(_opt.$introduce, 500);

            _this._initAlbumEvent(_opt.$indoorUploadBtn, _opt.$indoorImageBtn, true);
            _this._initAlbumEvent(_opt.$typeUploadBtn, _opt.$typeImageBtn);
            _this._initAlbumEvent(_opt.$plotUploadBtn, _opt.$plotImageBtn);

            _opt.$submitBtn.on('click.submit', function () {
                _this._submitData();
                if (_this._checkDataEmpty(_opt.$contact)) {
                    return
                }
                if (_this._checkDataEmpty(_opt.$plot)) {
                    return
                }
                if (_this._checkDataEmpty(_opt.$region)) {
                    alert('请填写区域')
                    return
                }
                if (_this._checkDataEmpty(_opt.$address)) {
                    return
                }
                if (_this._checkPattern(_opt.$room, _opt.sinPoReg, '请填写0-10的数字')) {
                    return
                }
                if (_this._checkPattern(_opt.$office, _opt.sinPoReg, '请填写0-10的数字')) {
                    return
                }
                if (_this._checkPattern(_opt.$toilet, _opt.sinPoReg, '请填写0-10的数字')) {
                    return
                }
                if (_this._checkPattern(_opt.$area, _opt.floatReg, `请填写正确的${_opt.$area.data('label')}`)) {
                    return
                }
                if (_this._checkPattern(_opt.$price, _opt.floatReg, `请填写正确的${_opt.$price.data('label')}`)) {
                    return
                }
                if (_this._checkPattern(_opt.$floor, _opt.intWiZeroReg, '请填写除0外的数字')) {
                    return
                }
                if (_this._checkPattern(_opt.$totalFloor, _opt.intWiZeroReg, '请填写除0外的数字')) {
                    return
                }
                if (_this._checkDataEmpty(_opt.$direction)) {
                    alert('请填写朝向')
                    return;
                }
                if (_this._checkDataEmpty(_opt.$renovation)) {
                    alert('请填写装修程度')
                    return;
                }
                if (_this._checkDataEmpty(_opt.$houseTitle)) {
                    return;
                }
                _this._submitData();
            });
        },
        _initRentDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            let _rentOpt = _this.opt.rentOpt;
            _opt.$roomAllBtn = $(_rentOpt.roomAllBtnS);
            _opt.$rentEntire = $(_rentOpt.rentEntireS);
            _opt.$rentShare = $(_rentOpt.rentShareS);
            _opt.$rentShareInfo = $(_rentOpt.rentShareInfoS);
            _opt.$rentRoom = $(_rentOpt.rentRoomS);
            _opt.$rentCount = $(_rentOpt.rentCountS);
            _opt.$rentCondition = $(_rentOpt.rentConditionS);
            _opt.$rentPay = $(_rentOpt.rentPayS);
            _opt.$rentWayVal = $(_rentOpt.rentWayValS);
            _opt.$roomequipment = $(_rentOpt.roomequipmentS);

            _opt.$rentShare.click(function () {
                _opt.$rentShareInfo.show();
            });

            _opt.$rentEntire.click(function () {
                _opt.$rentShareInfo.hide();
            });

            _rentOpt.checked = false;

            _opt.$roomAllBtn.click(function () {
                if (_rentOpt.checked) {
                    _opt.$roomequipment.prop('checked', false);
                    _opt.$roomAllBtn.text('全选');
                } else {
                    _opt.$roomequipment.prop('checked', true);
                    _opt.$roomAllBtn.text('全不选');
                }
                _rentOpt.checked = !_rentOpt.checked;
            });
        },
        _initPlotEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$plot.bind('propertychange', loadData).bind('input', loadData)

            function loadData() {
                _this._ajaxFloorList(this.value)
            }
        },
        _ajaxFloorList: function (value) {
            let _this = this;
            let _opt = _this.opt;
            if (value) {
                _this._getFloorList(value);
                _opt.$plotList.show();
            } else {
                _opt.$plotList.hide();
            }
        },
        _getFloorList: function (value) {
            let _this = this;
            let _opt = _this.opt;
            app.request({
                // url: app.areaApiUrl(_opt.plot.source_url),
                url: 'http://xiangyang.fczx.com/api/plot/list',
                data: {
                    kw: value
                },
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function ({ data }) {
                    if (data && data.length > 0) {
                        let _html = ''
                        for (const item of data) {
                            _html = _html + `
                            <li data-value="${item.id}">
                                <span>${item.name}</span>
                                <input type="hidden" value="${item.area}_${item.address}"/>
                            </li>`
                        }
                        _opt.$plotList.html(_html);
                        _this._initPlotListEvent()
                    } else {
                        _opt.$plotList.html('<li class="no-result">没有找到匹配的小区</li>')
                    }
                }
            });
        },
        _initPlotListEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$plotList.find('li').each(function () {
                $(this).click(function () {
                    let regionVal = $(this).find('input').val().split('_');
                    _opt.$plot.val($(this).find('span').text());
                    _opt.$region.val(regionVal[0]);
                    _opt.$region.parent().find('span').text(regionVal[0]);
                    _opt.$address.val(regionVal[1]);
                    _this._checkDataEmpty(_opt.$address, false);
                })
            });
            $(document).click(function (event) {
                let target = event.target;
                if (target.id != _opt.plot.id && _opt.$plotList.is(':visible')) {
                    _opt.$plotList.hide();
                }
            });
        },
        _initAlbumEvent: function ($uploadBtn, $imageBtn, hasCover = false) {
            let _this = this;
            let $albumList = $imageBtn.parent().find('.album-list');
            _this._initAlbumListEvent($albumList, hasCover);

            $uploadBtn.click(function () {
                $imageBtn.click();
            });

            $imageBtn.on('change', function (event) {
                let files = event.target.files;
                for (const file of files) {
                    if (!file) return;
                    let lastIndex = file.name.lastIndexOf(".");
                    let fileType = file.name.substring(lastIndex + 1);
                    if (app.FILE_LIMIT.IMAGE_ACCEPT.indexOf(fileType) === -1) {
                        alert(`请您上传图片格式的文件哦`);
                        return;
                    }
                    let formData = new FormData();
                    formData.append('file', file);
                    _this._uploadImageRequest(formData, $albumList, hasCover);
                }
            });
        },
        _uploadImageRequest: function (formData, $albumList, hasCover) {
            let _this = this;
            app.request({
                url: app.areaApiUrl('/file/upload'),
                data: formData,
                type: 'POST',
                dataType: 'json',
                isFile: true,
                headers: {},
                done: function ({ data }) {
                    $albumList.append(`
                    <li>
                        <img src="${data}" alt="">
                        <div class="image-mask"></div>
                        <div class="image-clear"></div>
                        ${hasCover ? '<div class="image-text">设为封面</div>' : ''}
                    </li>`);
                    _this._initAlbumListEvent($albumList, hasCover);
                }
            });
        },
        _initAlbumListEvent: function ($albumList, hasCover) {
            $albumList.find('li').each(function () {
                let $liItem = $(this);
                $liItem.find('.image-clear').click(function () {
                    $liItem.remove();
                });

                if (hasCover) {
                    $liItem.find('.image-text').click(function () {
                        if ($liItem.find('.image-tag').length > 0) {
                            return;
                        }
                        $liItem.siblings().find('.image-tag').remove();
                        $liItem.append('<div class="image-tag">封面</div>');
                    });
                    $liItem.siblings().find('.image-tag').remove();
                    $albumList.find('li').first().append('<div class="image-tag">封面</div>');
                }
            });
            $albumList.find('li').hover(function () {
                $(this).find('.image-mask').show();
                $(this).find('.image-clear').show();
                $(this).find('.image-text').show();
            }, function () {
                $(this).find('.image-mask').hide();
                $(this).find('.image-clear').hide();
                $(this).find('.image-text').hide();
            })
        },
        _getImageData: function ($imageBtn) {
            let imageData = [];
            let $albumList = $imageBtn.parent().find('.album-list');
            $albumList.find('li').each(function () {
                imageData.push({
                    isCover: $(this).find('.image-tag').length > 0,
                    image_path: $(this).find('img').attr('src')
                });
            });
            return imageData;
        },
        _checkDataEmpty: function ($input, isSubmit = true) {
            let _this = this;
            let _opt = _this.opt;
            let value = $input.val();
            let label = $input.data('label');
            let $formItem = $input.parents(_opt.formItemS);
            let $formError = $formItem.find('.form-error');
            if (!value) {
                if ($formError.length == 0) {
                    $formItem.append(`<span class="form-error">请填写${label}</span>`);
                }
                if (isSubmit) {
                    $input.focus();
                }
                return true
            } else {
                if ($formError.length > 0) {
                    $formError.remove();
                }
            }
        },
        _checkPattern: function ($input, reg, errMsg, isSubmit = true) {
            let _this = this;
            let _opt = _this.opt;
            let value = $input.val();
            let $formItem = $input.parents(_opt.formItemS);
            let $formError = $formItem.find('.form-error');
            if (!reg.test(value)) {
                if ($formError.length == 0) {
                    $formItem.append(`<span class="form-error">${errMsg}</span>`);
                }
                if (isSubmit) {
                    $input.focus();
                }
                return true
            } else {
                if ($formError.length > 0) {
                    $formError.remove();
                }
            }
        },
        _submitData: function () {
            let _this = this;
            let _opt = _this.opt;
            let commonData = {
                contact: _opt.$contact.val(),
                mobile: _opt.$mobile.val(),
                plot: _opt.$plot.val(),
                region: _opt.$region.val(),
                address: _opt.$address.val(),
                room: _opt.$room.val(),
                office: _opt.$office.val(),
                toilet: _opt.$toilet.val(),
                area: _opt.$area.val(),
                price: _opt.$price.val(),
                floor: _opt.$floor.val(),
                direction: _opt.$direction.val(),
                renovation: _opt.$renovation.val(),
                houseAge: _opt.$houseAge.val(),
                houseTitle: _opt.$houseTitle.val(),
                houseDesc: _opt.$houseDesc.val(),
                salePoint: _opt.$salePoint.val(),
                mindset: _opt.$mindset.val(),
                introduce: _opt.$introduce.val(),
            }
            let indoorImages = _this._getImageData(_opt.$indoorImageBtn);
            let typeImages = _this._getImageData(_opt.$typeImageBtn);
            let plotImages = _this._getImageData(_opt.$plotImageBtn);
            let imageData = {
                indoorImages,
                typeImages,
                plotImages
            }

            // 出租字段
            let rentWay = _opt.$rentWayVal.val();
            
            let roomEquipment = [];
            _opt.$roomequipment.each(function() {
                if($(this).prop('checked')) {
                    roomEquipment.push($(this).val())
                }
            });

            let rentdata = {
                rentWay,
                roomEquipment,
                rentPay: _opt.$rentPay.val(),
                rentRoom: _opt.$rentRoom.val(),
                rentCount: _opt.$rentCount.val(),
                rentCondition: _opt.$rentCondition.val(),
            };
            
            let submitData = $.extend(true, commonData, imageData, rentdata);
            app.request({
                url: app.areaApiUrl('/test/test'),
                data: submitData,
                type: 'GET',
                dataType: 'json',
                headers: {},
                done: function (res) {
                    $.MsgModal.Success('发布成功！', '你的房源已发布成功!');
                }
            });
        }
    });
})(jQuery)