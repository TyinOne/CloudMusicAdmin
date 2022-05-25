// 字体图标 url
const cssCdnUrlList: Array<string> = [
    // 'https://file.tyin.vip/cdn/font-awesome/font-awesome.min.css',
    // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/fontawesome.min.css',
    'https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/6.0.0/css/all.css',
    'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css'
];
// 第三方 js url
const jsCdnUrlList: Array<string> = [];

// 动态批量设置字体图标
export function setCssCdn() {
    if (cssCdnUrlList.length <= 0) return false;
    cssCdnUrlList.map((v) => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = v;
        link.crossOrigin = 'anonymous';
        document.getElementsByTagName('head')[0].appendChild(link);
    });
}

// 动态批量设置第三方js
export function setJsCdn() {
    if (jsCdnUrlList.length <= 0) return false;
    jsCdnUrlList.map((v) => {
        let link = document.createElement('script');
        link.src = v;
        document.body.appendChild(link);
    });
}

/**
 * 批量设置字体图标、动态js
 * @method cssCdn 动态批量设置字体图标
 * @method jsCdn 动态批量设置第三方js
 */
const setIntroduction = {
    // 设置css
    cssCdn: () => {
        setCssCdn();
    },
    // 设置js
    jsCdn: () => {
        setJsCdn();
    },
};

// 导出函数方法
export default setIntroduction;
