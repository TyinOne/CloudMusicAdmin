import {store} from '@renderer/store';
import {Local, Session} from '@renderer/utils/storage';
import {NextLoading} from '@renderer/utils/loading';
import {setAddRoute, setFilterMenuAndCacheTagsViewRoutes} from '@renderer/router/index';
import {useMenuApi} from '@renderer/api/menu';
import {dynamicRoutes} from "@renderer/router/route";

const menuApi = useMenuApi();

const layoutModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}');
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}');
/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const dynamicViewsModules: Record<string, Function> = Object.assign({}, {...layoutModules}, {...viewsModules});

/**
 * 后端控制路由：初始化方法，防止刷新时路由丢失
 * @method  NextLoading 界面 loading 动画开始执行
 * @method store.dispatch('userInfos/setUserInfos') 触发初始化用户信息
 * @method store.dispatch('requestOldRoutes/setBackEndControlRoutes') 存储接口原始路由（未处理component），根据需求选择使用
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export async function initBackEndControlRoutes() {
    try {
        // 界面 loading 动画开始执行
        if (window.nextLoading === undefined) NextLoading.start();
        // 无 token 停止执行下一步
        if (!Session.get('Authentication') && !Local.get('Authentication')) return false;
        // 触发初始化用户信息
        await store.dispatch('userInfos/setUserInfos');
        // 获取路由菜单数据
        const res = await getBackEndControlRoutes();
        // 存储接口原始路由（未处理component），根据需求选择使用
        let routers = res.result.list
        // await store.dispatch('routesList/setBackEndControlRoutes', JSON.parse(JSON.stringify(routers)));
        // 处理路由（component），替换 dynamicRoutes（@renderer/router/route）第一个顶级 children 的路由
        dynamicRoutes[0].children = await backEndComponent(routers);
        // 添加动态路由
        await setAddRoute();
        // 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
        setFilterMenuAndCacheTagsViewRoutes();
    } finally {
        NextLoading.done()
    }
}

/**
 * 请求后端路由菜单接口
 * @description isRequestRoutes 为 true，则开启后端控制路由
 * @returns 返回后端路由菜单数据
 */
export function getBackEndControlRoutes(): any {
    return menuApi.getMenuPermission();
}

/**
 * 重新请求后端路由菜单接口
 * @description 用于菜单管理界面刷新菜单（未进行测试）
 * @description 路径：/src/views/system/menu/component/addMenu.vue
 */
export function setBackEndControlRefreshRoutes() {
    getBackEndControlRoutes();
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes: any) {
    if (!routes) return;
    return routes.map((item: any) => {
        if (item.component) item.component = dynamicImport(dynamicViewsModules, item.component as string);
        item.children && backEndComponent(item.children);
        return item;
    });
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
    const keys = Object.keys(dynamicViewsModules);
    const matchKeys = keys.filter((key) => {
        const k = key.replace(/..\/views|../, '');
        // console.log(k)
        // console.log(`${component}`)
        return k.startsWith(`${component}`) || k.startsWith(`/${component}`);
    });
    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0];
        return dynamicViewsModules[matchKey];
    }
    if (matchKeys?.length > 1) {
        return false;
    }
}
