// !function (a, b, c) {
//     function d(a) {
//         var c = "default";
//         a.self_redirect === !0 ? c = "true" : a.self_redirect === !1 && (c = "false");
//         var d = b.createElement("iframe"),
//             e = "https://open.weixin.qq.com/connect/qrconnect?appid=" + a.appid + "&scope=" + a.scope + "&redirect_uri=" + a.redirect_uri + "&state=" + a.state + "&login_type=jssdk&self_redirect=" + c + '&styletype=' + (a.styletype || '') + '&sizetype=' + (a.sizetype || '') + '&bgcolor=' + (a.bgcolor || '') + '&rst=' + (a.rst || '');
//         e += a.style ? "&style=" + a.style : "", e += a.href ? "&href=" + a.href : "", d.src = e, d.frameBorder = "0", d.allowTransparency = "true", d.scrolling = "no", d.width = "300px", d.height = "400px";
//         var f = b.getElementById(a.id);
//         f.innerHTML = "", f.appendChild(d)
//     }
//
//     a.WxLogin = d
// }(window, document)();

export default (window, document, info) => {
    let c = "default";
    info.self_redirect === !0 ? c = "true" : info.self_redirect === !1 && (c = "false");
    let d = document.createElement("iframe"),
        e = "https://open.weixin.qq.com/connect/qrconnect"
            + "?appid=" + info.appid
            + "&scope=" + info.scope
            + "&redirect_uri=" + info.redirect_uri
            + "&state=" + info.state
            + "&login_type=jssdk&self_redirect=" + c
            + '&styletype=' + (info.styletype || '')
            + '&sizetype=' + (info.sizetype || '')
            + '&bgcolor=' + (info.bgcolor || '')
            + '&rst=' + (info.rst || '');
    e += info.style ? "&style=" + info.style : "";
    e += info.href ? "&href=" + info.href : "";
    d.src = e
    d.frameBorder = "0"
    d.allowTransparency = "true"
    d.scrolling = "no"
    d.width = "300px"
    d.height = "300px"
    let f = document.getElementById(info.id);
    console.log(document)
    f.innerHTML = ""
    f.appendChild(d)
    return d
}

let state = {
    income: {
        basic: {
            value: 0,
            newly: 0,
            chain: {
                type: 'up',
                value: 0.14
            }
        },
        wechatIncome: {
            value: 0,
            newly: 0,
            proportion: 0
        },
        douyinIncome: {
            value: 0,
            newly: 0,
            proportion: 0
        },
        kuaishouIncome: {
            value: 0,
            newly: 0,
            proportion: 0
        },
    },
    creator: {},
    group: {},
    film: {},
    replay: {}
}

