(function () {
    $.MsgModal = {
        Alert: function (title, message, okText='确定') {
            GenerateHtml("alert", title, message, okText);
            btnOk();
            btnNo();
        },
        Confirm: function (title, message, callback, okText='确定', cancelText='取消') {
            GenerateHtml("confirm", title, message, okText, cancelText);
            btnOk(callback);
            btnNo();
        }
    }
    //生成Html
    var GenerateHtml = function (type, title, message, okText, cancelText) {
        var _html = "";
        _html += `<div id="modalBox"></div><div id="modalContent"><span id="modalTitle">${title}</span>`;
        _html += `<a id="modalIcon"></a><div id="ModalMessage">${message}</div><div id="modalBtnGroup">`;
        if (type == "alert") {
            _html += `<input id="modalBtnOk" type="button" value="${okText}" />`;
        }
        if (type == "confirm") {
            _html += `<input id="modalBtnOk" type="button" value="${okText}" />`;
            _html += `<input id="modalBtnNo" type="button" value="${cancelText}" />`;
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
            opacity: '0.2'
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
            color: '#666',
            padding: '14px 15px',
            backgroundColor: '#eee',
            borderRadius: '15px 15px 0 0',
            fontWeight: 'bold'
        });
        $("#ModalMessage").css({
            padding: '26px 20px 32px 20px',
            lineHeight: '22px',
            borderBottom: '1px dashed #DDD',
            fontSize: '14px'
        });
        $("#modalIcon").css({
            display: 'block',
            position: 'absolute',
            right: '14px',
            top: '14px',
            width: '14px',
            height: '14px',
            cursor: 'pointer',
            borderRadius: '50%',
            background: 'url(//static.fczx.com/www/assets/icons/close14.png) no-repeat',
            backgroundColor: '#ccc'
        });
        //右上角关闭按钮hover样式
        $("#modalIcon").hover(function () {
            $(this).css({
                backgroundColor: '#df2f30'
            });
        }, function () {
            $(this).css({
                backgroundColor: '#ccc'
            });
        });
        $("#modalBtnGroup").css({
            margin: '16px 0',
            textAlign: 'center'
        });
        $("#modalBtnOk,#modalBtnNo").css({
            cursor: 'pointer',
            width: '100px',
            height: '34px',
        });
        $("#modalBtnOk").css({
            color: '#fff',
            backgroundColor: '#11a43c'
        });
        $("#modalBtnOk").hover(
            function () {
                $(this).css({
                    backgroundColor: '#14922d'
                })
            },
            function () {
                $(this).css({
                    backgroundColor: '#11a43c'
                })
            });
        $("#modalBtnNo").css({
            color: '#666',
            backgroundColor: '#fff',
            marginLeft: '20px',
            border: '1px solid #ddd'
        });
        $("#modalBtnNo").hover(
            function () {
                $(this).css({
                    backgroundColor: '#eee'
                })
            },
            function () {
                $(this).css({
                    backgroundColor: '#fff'
                })
            });

        var _widht = document.documentElement.clientWidth; //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高
        var boxWidth = $("#modalContent").width();
        var boxHeight = $("#modalContent").height();
        //让提示框居中
        $("#modalContent").css({
            top: 200 + "px",
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