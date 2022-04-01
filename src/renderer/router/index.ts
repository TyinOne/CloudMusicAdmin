import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { store } from '@renderer/store';
import { Session } from '@renderer/utils/storage';
import {NextLoading} from '@renderer/utils/loading'
import { staticRoutes, dynamicRoutes } from '@renderer/router/route';
import {initFrontEndControlRoutes} from "@renderer/router/frontEnd";

const router =createRouter(<RouterOptions>{
    history: createWebHashHistory(),
    routes: staticRoutes
});

const pathMatch = {
    path: '/:path(.*)*',
    redirect: '/404',
};
// isRequestRoutes 为 true，则开启后端控制路由，路径：`/src/store/modules/themeConfig.ts`
const { isRequestRoutes } = store.state.themeConfig.themeConfig;
// 前端控制路由：初始化方法，防止刷新时路由丢失
if (!isRequestRoutes) initFrontEndControlRoutes().then();
// 路由加载前
router.beforeEach(async (to, from, next) => {
    NProgress.configure({ showSpinner: false });
    if (to.meta.title) NProgress.start();
    const token = Session.get('token');
    if (to.path === '/login' && !token) {
        next();
        NProgress.done();
    } else {
        if (!token) {
            next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
            Session.clear();
            await resetRoute();
            NProgress.done();
        } else if (token && to.path === '/login') {
            next('/home');
            NProgress.done();
        } else {
            if (store.state.routesList.routesList.length === 0) {
                if (isRequestRoutes) {
                    // 后端控制路由：路由数据初始化，防止刷新时丢失
                    await initBackEndControlRoutes();
                    // 动态添加路由：防止非首页刷新时跳转回首页的问题
                    // 确保 addRoute() 时动态添加的路由已经被完全加载上去
                    next({ ...to, replace: true });
                }
            } else {
                next();
            }
        }
    }
});



// 路由加载后
router.afterEach(() => {
    NProgress.done();
    NextLoading.done();
});

// 导出路由
export default router;