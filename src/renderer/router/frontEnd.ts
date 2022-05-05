import {store} from "@renderer/store";
import {NextLoading} from "@renderer/utils/loading";
import {Local, Session} from "@renderer/utils/storage";
import {setAddRoute, setFilterMenuAndCacheTagsViewRoutes} from "@renderer/router/index";


export async function initFrontEndControlRoutes() {
    // 界面 loading 动画开始执行
    if (window.nextLoading === undefined) NextLoading.start();
    // 无 token 停止执行下一步
    if (!Session.get('Authentication') && !Local.get('Authentication')) return false;
    // 触发初始化用户信息
    await store.dispatch('userInfos/setUserInfos')
    // 添加动态路由
    await setAddRoute();
    // 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
    await setFilterMenuAndCacheTagsViewRoutes();
}

