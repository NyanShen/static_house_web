/*公共请求处理文件*/
var app = app || {};

app.getHostCity = function () {
    var host = window.location.host.split('.');
    return host[0];
};

app.agreement = 'http://';
app.topDomain = '.fczx.com';
app.domain = app.agreement + app.getHostCity() + app.topDomain;
app.apiDomain = app.agreement + 'api' + app.topDomain;
app.wwwDomain = app.agreement + 'www' + app.topDomain;
app.areaApiDomain = app.agreement + app.getHostCity() + '.api' + app.topDomain;


app.getUrlParam = function (string) {
    var reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)");
    var d = window.location.href.split('?');
    if (d.length > 1) {
        var r = d[1].match(reg);
        if (r) {
            return decodeURI(r[2]);
        }
    }
    return null;
};

app.apiUrl = function (url) {
    return app.apiDomain + url;
};

app.areaApiUrl = function (url) {
    return app.areaApiDomain + url;
};

app.jumpUrl = function (url) {
    return app.domain + url;
};

app.setToken = function (token) {
    window.localStorage.setItem('token', token);
};

app.getToken = function () {
    var arr, reg = new RegExp("(^| )_x_token=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return undefined;
    }
};

/**
 *  url, data, type, done, pagination
 *  isFile 是否上传文件
 */
app.request = function (params) {
    params.headers['X-Token'] = app.getToken();
    if (typeof params.data.page != "undefined" && typeof params.data.limit != "undefined") {
        params.headers['X-Page'] = params.data.page;
        params.headers['X-Page-Size'] = params.data.limit;
        delete params.data.page;
        delete params.data.limit;
    }
    $.each(params.data, function (i, e) {
        if (typeof e == 'number' && isNaN(e)) {
            params.data[i] = null;
        }
        if (typeof e == "undefined") {
            params.data[i] = null;
        }
    });
    var ajaxOptions = {
        url: params.url,
        data: params.data,
        type: params.type,
        dataType: params.dataType,
        crossDomain: true,
        headers: params.headers,
        success: function (msg, textStatus, jqXHR) {
            if (msg.code == 1 && msg.message == 'ok') {
                msg['_page_count'] = jqXHR.getResponseHeader('X-Total');
                params.done.call(this, msg);
            } else {
                $.MsgModal.Alert('提示', msg.message)
            }
        },
        error: function (response) {
            if (response.status == 404) {
                alert('接口不存在');
            } else if (response.status == 302) {
                location.href = response.responseJSON.message;
            } else if (response.status == 401) {
                var backUrl = encodeURIComponent(location.href);
                location.href = `${app.wwwDomain}/user/login?backUrl=${backUrl}`;
            } else {
                if (typeof response.responseJSON != 'undefined') {
                    $.MsgModal.Alert('提示', response.responseJSON.message)
                } else {
                    alert('系统正在开小差，请稍后再试');
                }
            }
        }
    };
    if (params.isFile) {
        $.extend(true, ajaxOptions, { processData: false, contentType: false });
    }
    $.ajax(ajaxOptions);
};

//根据长度生成随机码
app.randCode = function (len) {
    var charset = 'abcdefghkmnprstuvwxyzABCDEFGHKMNPRSTUVWXYZ0123456789';
    var charsetLen = charset.length - 1;
    var code = '';
    for (var i = 0; i < len; i++) {
        code += charset[parseInt(charsetLen * Math.random())];
    }
    return code;
};

//@fmt 'yy-MM-dd hh:mm:ss'
app.date = function (timestamp, fmt = 'yy-MM-dd hh:mm:ss') {
    var date = new Date(timestamp * 1000);
    var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + ""));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//文件限制常数
app.FILE_LIMIT = {
    IMAGE_ACCEPT: ["bmp", "jpg", "png", "jpeg"],
    SIZE_10: 1024 * 1024 * 10 //10M
}

//设置cookie

app.setCookie = function (key, value, expires, domain, path = "/") {
    let today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    let expiresDate = new Date(today.getTime() + (expires));

    document.cookie = key + "=" + escape(value) +
        ((expires) ? ";expires=" + expiresDate.toGMTString() : "") +
        ((path) ? ";path=" + path : "") +
        ((domain) ? ";domain=" + domain : "");
}

app.getCookie = function (key) {
    var allCookies = document.cookie.split(';');
    var cookieKey = '';
    var cookieValue = '';
    var tempCookie = '';
    var isFound = false;

    for (const item of allCookies) {
        tempCookie = item.split('=');
        cookieKey = tempCookie[0].replace(/^\s+|\s+$/g, '');
        if (cookieKey == key) {
            isFound = true;
            if (tempCookie.length > 1) {
                cookieValue = unescape(tempCookie[1].replace(/^\s+|\s+$/g, ''));
            }
            return cookieValue
        }
        cookieKey = '';
        tempCookie = null;
    }
    if (!isFound) {
        return null
    }
}

app.deleteCookie = function (key, domain, path = '/') {
    if (app.getCookie(key)) {
        document.cookie = key + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    }
}