var app = app || {};

app.getHostCity = function(){
    var host = window.location.host.split('.');
    return host[0];
};

app.agreement = 'http://';
app.topDomain = '.fczx.com';
app.domain = app.agreement + app.getHostCity() + app.topDomain;
app.apiDomain = app.agreement + app.getHostCity() + '.api' + app.topDomain;
app.uploadUrl = app.apiDomain + '/file/upload';

app.statusEnable = 1;
app.statusDisable = 2;
app.isYes = 1;
app.isNo = 2;
app.typeSystem = 1;
app.typeCustom = 2;

app.adModule = [{'id': 0, 'name': '未知'}, {'id': 1, 'name': '电脑端'}, {'id': 2, 'name': '小程序'}, {'id': 3, 'name': 'App'}];
app.adTypePc = {'home': '首页', 'new-house': '新房', 'old-house': '二手房', 'user': '用户中心', 'news': '资讯'};
app.adTypeApp = {'home': '首页', 'user': '用户中心'};
app.adTypeApplet = {'home': '首页', 'user': '用户中心'};

app.adCateAll = [
    {},
    app.adTypePc,
    app.adTypeApplet,
    app.adTypeApp,
];

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

app.jumpUrl = function (url) {
    return app.domain + url;
};

app.setToken = function (token) {
    window.localStorage.setItem('token', token);
};

app.getToken = function () {
    var token = window.localStorage.getItem('token');
    return token ? token : 'undefined';
};

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
app.date = function (timestamp, fmt) {
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

/**
 *  url, data, type, done, pagination
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
    $.ajax({
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
                alert(msg.message);
            }
        },
        error: function (response) {
            if (response.status == 404) {
                alert('接口不存在');
            } else if (response.status == 302) {
                location.href = response.responseJSON.message;
            } else if (response.status == 401) {
                location.href = app.jumpUrl('/page/login.html');
            } else if (response.status == 503) {
                console.log(response.responseJSON.message)
            } else {
                if (typeof response.responseJSON != 'undefined') {
                    alert(response.responseJSON.message);
                } else {
                    alert('系统正在开小差，请稍后再试');
                }
            }
        }
    })
};
