(function () {
    $.MsgNodal = {
        Alert: function (title, msg) {
            GenerateHtml("alert", title, msg);
            btnOk();
            btnNo();
        },
        Confirm: function (title, msg, callback) {
            GenerateHtml("confirm", title, msg);
            btnOk(callback);
            btnNo();
        }
    }
    //生成Html
    var GenerateHtml = function (type, title, msg) {
        var _html = "";
        _html += '<div id="modalBox"></div><div id="modalContent"><span id="modalTitle">' + title + '</span>';
        _html += '<a id="modalIcon">x</a><div id="ModalMessage">' + msg + '</div><div id="modalBtnGroup">';
        if (type == "alert") {
            _html += '<input id="modalBtnOk" type="button" value="确定" />';
        }
        if (type == "confirm") {
            _html += '<input id="modalBtnOk" type="button" value="确定" />';
            _html += '<input id="modalBtnNo" type="button" value="取消" />';
        }
        _html += '</div></div>';
        //必须先将_html添加到body，再设置Css样式
        $("body").append(_html);
        //生成Css
        GenerateCss();
    }

    //生成Css
    var GenerateCss = function () {
        $("#modalBox").css({
            width: '100%',
            height: '100%',
            zIndex: '99999',
            position: 'fixed',
            backgroundColor: 'black',
            top: '0',
            left: '0',
            opacity: '0.6'
        });
        $("#modalContent").css({
            zIndex: '999999',
            width: '400px',
            position: 'fixed',
            backgroundColor: 'White',
            borderRadius: '15px'
        });
        $("#modalTitle").css({
            display: 'block',
            fontSize: '14px',
            color: '#444',
            padding: '10px 15px',
            backgroundColor: '#DDD',
            borderRadius: '15px 15px 0 0',
            borderBottom: '3px solid #009BFE',
            fontWeight: 'bold'
        });
        $("#ModalMessage").css({
            padding: '20px',
            lineHeight: '20px',
            borderBottom: '1px dashed #DDD',
            fontSize: '13px'
        });
        $("#modalIcon").css({
            display: 'block',
            position: 'absolute',
            right: '10px',
            top: '9px',
            border: '1px solid Gray',
            width: '18px',
            height: '18px',
            textAlign: 'center',
            lineHeight: '16px',
            cursor: 'pointer',
            borderRadius: '12px',
            fontFamily: '微软雅黑'
        });
        $("#modalBtnGroup").css({
            margin: '15px 0 10px 0',
            textAlign: 'center'
        });
        $("#modalBtnOk,#modalBtnNo").css({
            width: '85px',
            height: '30px',
            color: 'white',
            border: 'none'
        });
        $("#modalBtnOk").css({
            backgroundColor: '#168bbb'
        });
        $("#modalBtnNo").css({
            backgroundColor: 'gray',
            marginLeft: '20px'
        });
        //右上角关闭按钮hover样式
        $("#modalIcon").hover(function () {
            $(this).css({
                backgroundColor: 'Red',
                color: 'White'
            });
        }, function () {
            $(this).css({
                backgroundColor: '#DDD',
                color: 'black'
            });
        });
        var _widht = document.documentElement.clientWidth; //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高
        var boxWidth = $("#modalContent").width();
        var boxHeight = $("#modalContent").height();
        //让提示框居中
        $("#modalContent").css({
            top:  200 + "px",
            left: (_widht - boxWidth) / 2 + "px"
        });
    }
    //确定按钮事件
    var btnOk = function (callback) {
        $("#modalBtnOk").click(function () {
            $("#modalBox,#modalContent").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    }
    //取消按钮事件
    var btnNo = function () {
        $("#modalBtnNo,#modalIcon").click(function () {
            $("#modalBox,#modalContent").remove();
        });
    }
})();