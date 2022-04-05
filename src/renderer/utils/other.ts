import * as svg from '@element-plus/icons-vue';
import {App, nextTick} from "vue";
import SvgIcon from '@renderer/components/svgIcon/index.vue'
import {store} from "@renderer/store";
import router from "@renderer/router";

export function elSvg(app: App) {
    const icons = svg as any;
    for (const i in icons) {
        app.component(`ele-${icons[i].name}`, icons[i]);
    }
    app.component('SvgIcon', SvgIcon);
}

/**
 * 图片懒加载
 * @param el dom 目标元素
 * @param arr 列表数据
 * @description data-xxx 属性用于存储页面或应用程序的私有自定义数据
 */
export const lazyImg = (el: any, arr: any) => {
    const io = new IntersectionObserver((res) => {
        res.forEach((v: any) => {
            if (v.isIntersecting) {
                const {img, key} = v.target.dataset;
                v.target.src = img;
                v.target.onload = () => {
                    io.unobserve(v.target);
                    arr[key]['loading'] = false;
                };
            }
        });
    });
    nextTick(() => {
        document.querySelectorAll(el).forEach((img) => io.observe(img));
    }).then(r => {
    });
};
/**
 * 判断是否是移动端
 */
export function isMobile() {
    return !!navigator.userAgent.match(
        /('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
    );
}

/**
 * 设置浏览器标题国际化
 * @method const title = useTitle(); ==> title()
 */
export function useTitle() {
    nextTick(() => {
        let webTitle = '';
        let globalTitle: string = store.state.themeConfig.themeConfig.globalTitle;
        router.currentRoute.value.path === '/login'
            ? (webTitle = router.currentRoute.value.meta.title as any)
            : (webTitle = router.currentRoute.value.meta.title as any);
        document.title = `${webTitle} - ${globalTitle}` || globalTitle;
    });
}
export default {
    elSvg: (app: App) => {
        elSvg(app);
    },
    lazyImg: (el: any, arr: any) => {
        lazyImg(el, arr);
    },
    isMobile: () => {
        return isMobile();
    },
    useTitle: () => {
        useTitle();
    },
}