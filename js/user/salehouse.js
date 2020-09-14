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
                    idS: '#plotId',
                    nameS: '#plotName',
                    selectS: '.search-select',
                    showTextS: '.search-select-text',
                    contentS: '.search-select-content',
                    listS: '.search-select-list',
                    source_url: 'http://xiangyang.fczx.com/api/plot/list',
                    // source_url: app.areaApiUrl('/community/find-by-title'),


                },
                realNameS: '#realName',
                mobileS: '#mobile',
                roomS: '#room',
                officeS: '#office',
                toiletS: '#toilet',
                floorS: '#floor',
                totalFloorS: '#totalFloor',
                buildingAreaS: '#buildingArea',
                buildingNoS: '#buildingNo',
                buildingUnitS: '#buildingUnit',
                buildingRoomS: '#buildingRoom',
                priceTotalS: '#priceTotal',
                directionS: '#direction',
                renovationS: '#renovation',
                regionS: '#region',
                addressS: '#address',
                houseYearS: '#houseYear',

                houseTitleS: '#houseTitle',
                houseDescS: '#houseDesc',
                elevatorValS: '#elevatorVal',
                elevatorS: 'input[name="elevator"]:radio',
                housePropertyValS: '#housePropertyVal',
                housePropertyS: 'input[name="houseProperty"]:radio',

                saleOpt: {
                    salePointS: '#salePoint',
                    mindsetS: '#mindset',
                    serviceIntroduceS: '#serviceIntroduce',
                    projectFeatureAllBtnS: '#projectFeatureAllBtn',
                    projectFeatureS: 'input[name="fangProjectFeature"]:checkbox'
                },

                houseUploadBtnS: '#houseUploadBtn',
                houseImageBtnS: '#houseImageBtn',

                rentOpt: {
                    roomAllBtnS: '#roomAllBtn',
                    rentRoomS: '#rentRoom',
                    rentCountS: '#rentCount',
                    rentConditionS: '#rentCondition',
                    rentPayS: '#rentPay',
                    rentWayValS: '#rentWayVal',
                    rentWayS: 'input[name="rentWay"]:radio',
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
            if (opt.type === 'sale') {
                this._initSaleDomEvent();
            }
        },
        _initDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            _opt.$realName = $(_opt.realNameS);
            _opt.$mobile = $(_opt.mobileS);
            _opt.$room = $(_opt.roomS);
            _opt.$office = $(_opt.officeS);
            _opt.$toilet = $(_opt.toiletS);
            _opt.$floor = $(_opt.floorS);
            _opt.$totalFloor = $(_opt.totalFloorS);
            _opt.$buildingArea = $(_opt.buildingAreaS);
            _opt.$buildingNo = $(_opt.buildingNoS);
            _opt.$buildingUnit = $(_opt.buildingUnitS);
            _opt.$buildingRoom = $(_opt.buildingRoomS);
            _opt.$priceTotal = $(_opt.priceTotalS);
            _opt.$direction = $(_opt.directionS);
            _opt.$renovation = $(_opt.renovationS);
            _opt.$region = $(_opt.regionS);
            _opt.$address = $(_opt.addressS);
            _opt.$houseYear = $(_opt.houseYearS);
            _opt.$houseTitle = $(_opt.houseTitleS);
            _opt.$houseDesc = $(_opt.houseDescS);
            _opt.$elevator = $(_opt.elevatorS);
            _opt.$elevatorVal = $(_opt.elevatorValS);
            _opt.$houseProperty = $(_opt.housePropertyS);
            _opt.$housePropertyVal = $(_opt.housePropertyValS);

            _opt.$houseUploadBtn = $(_opt.houseUploadBtnS);
            _opt.$houseImageBtn = $(_opt.houseImageBtnS);
            _opt.$submitBtn = $(_opt.submitBtnS);
            _this._initPlotEvent();
            new FCZX.Select({ selectContS: _opt.selectS });

            _opt.$elevator.click(function () {
                _opt.$elevatorVal.val(this.value)
            });

            _opt.$houseProperty.click(function () {
                _opt.$housePropertyVal.val(this.value)
            });

            let $allInput = $(`${_opt.realNameS}, ${_opt.roomS}, ${_opt.officeS}, ${_opt.toiletS},
             ${_opt.floorS}, ${_opt.totalFloorS}, ${_opt.buildingAreaS}, ${_opt.buildingNoS}, ${_opt.buildingUnitS}, ${_opt.buildingRoomS},
              ${_opt.priceS}, ${_opt.directionS}, ${_opt.renovationS},
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
                    case 'buildingArea':
                    case 'priceTotal':
                        let label = $this.data('label');
                        _this._checkPattern($this, _opt.floatReg, `请填写正确的${label}`, false);
                        break;
                    default:
                        _this._checkDataEmpty($this, false);

                }
            });

            inputListener(_opt.$houseTitle, 30);
            inputListener(_opt.$houseDesc, 500);

            _this._initAlbumEvent(_opt.$houseUploadBtn, _opt.$houseImageBtn, 10, true);

            _opt.$submitBtn.on('click.submit', function () {
                _this._submitData();
                if (_this._checkDataEmpty(_opt.$realName)) {
                    return
                }
                if (_this._checkDataEmpty(_opt.$plotId)) {
                    alert('请填写小区名字')
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
                if (_this._checkPattern(_opt.$buildingArea, _opt.floatReg, `请填写正确的${_opt.$buildingArea.data('label')}`)) {
                    return
                }
                if (_this._checkDataEmpty(_opt.$buildingNo)) {
                    return;
                }
                if (_this._checkDataEmpty(_opt.$buildingUnit)) {
                    return;
                }
                if (_this._checkDataEmpty(_opt.$buildingRoom)) {
                    return;
                }
                if (_this._checkPattern(_opt.$priceTotal, _opt.floatReg, `请填写正确的${_opt.$priceTotal.data('label')}`)) {
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
        _initSaleDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            let _saleOpt = _this.opt.saleOpt;

            _opt.$salePoint = $(_saleOpt.salePointS);
            _opt.$mindset = $(_saleOpt.mindsetS);
            _opt.$serviceIntroduce = $(_saleOpt.serviceIntroduceS);
            _opt.$projectFeatureAllBtn = $(_saleOpt.projectFeatureAllBtnS);
            _opt.$projectFeature = $(_saleOpt.projectFeatureS);
            inputListener(_opt.$salePoint, 500);
            inputListener(_opt.$mindset, 500);
            inputListener(_opt.$serviceIntroduce, 500);

            _saleOpt.checked = false;

            _opt.$projectFeatureAllBtn.click(function () {
                if (_saleOpt.checked) {
                    _opt.$projectFeature.prop('checked', false);
                    _opt.$projectFeatureAllBtn.text('全选');
                } else {
                    _opt.$projectFeature.prop('checked', true);
                    _opt.$projectFeatureAllBtn.text('全不选');
                }
                _saleOpt.checked = !_saleOpt.checked;
            });
        },
        _initRentDomEvent: function () {
            let _this = this;
            let _opt = _this.opt;
            let _rentOpt = _this.opt.rentOpt;
            _opt.$roomAllBtn = $(_rentOpt.roomAllBtnS);
            _opt.$rentRoom = $(_rentOpt.rentRoomS);
            _opt.$rentCount = $(_rentOpt.rentCountS);
            _opt.$rentCondition = $(_rentOpt.rentConditionS);
            _opt.$rentPay = $(_rentOpt.rentPayS);
            _opt.$rentWay = $(_rentOpt.rentWayS);
            _opt.$rentWayVal = $(_rentOpt.rentWayValS);
            _opt.$roomequipment = $(_rentOpt.roomequipmentS);

            _opt.$rentWay.click(function () {
                _opt.$rentWayVal.val(this.value)
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
            _opt.$plotId = $(_opt.plot.idS);
            _opt.$plotName = $(_opt.plot.nameS);
            _opt.$plotShow = _opt.$plotId.parents(_opt.plot.showTextS);
            _opt.$plotList = _opt.$plotName.siblings(_opt.plot.listS);
            _opt.$plotCont = _opt.$plotName.parents(_opt.plot.contentS);

            $(document).click(function (event) {
                let $target = $(event.target).parents(_opt.plot.selectS);
                if ($target.length === 1) {
                    _opt.$plotCont.show();
                    _opt.$plotName.focus();
                } else {
                    _opt.$plotCont.hide();
                }
            });

            _opt.$plotName.bind('propertychange', loadData).bind('input', loadData);

            function loadData() {
                _this._getFloorList(this.value);
            }
        },
        _getFloorList: function (value) {
            let _this = this;
            let _opt = _this.opt;
            app.request({
                url: _opt.plot.source_url,
                data: {
                    title: value
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
                                <span>${item.title}</span>
                                <input type="hidden" value="${item.fang_area_id}_${item.address}"/>
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
                    let plotId = $(this).data('value')
                    let plotName = $(this).find('span').text();
                    let regionVal = $(this).find('input').val().split('_');
                    let regionName = _opt.$region.parents(_opt.formItemS).find(`li[data-value=${regionVal[0]}]`).text()

                    _opt.$plotName.val('');
                    _opt.$plotId.val(plotId);
                    _opt.$plotShow.find('span').text(plotName);
                    _opt.$region.val(regionVal[0]);
                    _opt.$address.val(regionVal[1]);
                    _opt.$region.parent().find('span').text(regionName);
                    _opt.$plotList.html('<li class="no-result">请输入小区名称</li>')
                    _this._checkDataEmpty(_opt.$address, false);
                })
            });

        },
        _initAlbumEvent: function ($uploadBtn, $imageBtn, maxCount, hasCover = false) {
            let _this = this;
            let $albumList = $imageBtn.parent().find('.album-list');
            _this._initAlbumListEvent($albumList, hasCover);

            $uploadBtn.click(function () {
                $imageBtn.click();
            });

            $imageBtn.off('change.upload').on('change.upload', function (event) {
                let sizeError = 0;
                let formatError = 0;
                let files = event.target.files;
                let existLen = $albumList.find('li').length;
                if ((existLen + files.length) > maxCount) {
                    alert(`最多只能上传${maxCount}张图片哦`);
                    return
                }
                for (const file of files) {
                    if (!file) continue;
                    if (file.size > app.FILE_LIMIT.SIZE_10) {
                        sizeError++;
                        continue;
                    }
                    let lastIndex = file.name.lastIndexOf(".");
                    let fileType = file.name.substring(lastIndex + 1);
                    if (app.FILE_LIMIT.IMAGE_ACCEPT.indexOf(fileType) === -1) {
                        formatError++;
                        continue;
                    }
                    let formData = new FormData();
                    formData.append('file', file);
                    _this._uploadImageRequest(formData, $albumList, hasCover);
                }
                if (sizeError > 0) {
                    alert(`你上传的图片中有${sizeError}张图片超过10M！`);
                }
                if (formatError > 0) {
                    alert(`你上传的图片中有${formatError}张不是图片格式！`);
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
                    is_face: $(this).find('.image-tag').length > 0 ? '1' : '2',
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
            let submitData = {};

            let commonData = {
                real_name: _opt.$realName.val(),
                mobile: _opt.$mobile.val(),
                fang_house_id: _opt.$plotId.val(),
                fang_area_id: _opt.$region.val(),
                address: _opt.$address.val(),
                room: _opt.$room.val(),
                office: _opt.$office.val(),
                toilet: _opt.$toilet.val(),
                building_area: _opt.$buildingArea.val(),
                price_total: _opt.$priceTotal.val(),
                height_self: _opt.$floor.val(),
                height_total: _opt.$totalFloor.val(),
                fang_direction_type_id: _opt.$direction.val(),
                fang_renovation_status_id: _opt.$renovation.val(),
                house_year: _opt.$houseYear.val(),
                title: _opt.$houseTitle.val(),
                description: _opt.$houseDesc.val(),
                is_elevator: _opt.$elevatorVal.val(),
                fang_property_type_id: _opt.$housePropertyVal.val()
            }
            let imageData = _this._getImageData(_opt.$houseImageBtn);

            if (_opt.type === 'sale') {
                let projectFeatureVal = {};
                _opt.$projectFeature.each(function () {
                    if ($(this).prop('checked')) {
                        projectFeatureVal[$(this).attr('id')] = $(this).val();
                    }
                });
                let saleData = {
                    selling_point: _opt.$salePoint.val(),
                    attitude_point: _opt.$mindset.val(),
                    service_point: _opt.$serviceIntroduce.val(),
                    fangProjectFeature: projectFeatureVal,
                    esfImage: imageData
                }

                submitData = $.extend(true, commonData, saleData);
            }

            if (_opt.type === 'rent') {
                let roomEquipment = [];
                _opt.$roomequipment.each(function () {
                    if ($(this).prop('checked')) {
                        roomEquipment[$(this).attr('id')] = $(this).val();
                    }
                });

                let rentdata = {
                    roomEquipment,
                    rentPay: _opt.$rentPay.val(),
                    rentRoom: _opt.$rentRoom.val(),
                    rentWay: _opt.$rentWayVal.val(),
                    rentCount: _opt.$rentCount.val(),
                    rentCondition: _opt.$rentCondition.val(),
                    rentImage: imageData
                };

                submitData = $.extend(true, commonData, rentdata);
            }

            app.request({
                url: _opt.action_url,
                data: submitData,
                type: 'POST',
                dataType: 'json',
                headers: {},
                done: function (res) {
                    $.MsgModal.Success('发布成功！', '你的房源已发布成功!');
                }
            });
        }
    });
})(jQuery)