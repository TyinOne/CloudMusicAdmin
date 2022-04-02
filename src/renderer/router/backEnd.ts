export async function initBackEndControlRoutes() {
    // // 界面 loading 动画开始执行
    // if (window.nextLoading === undefined) NextLoading.start();
    // // 无 token 停止执行下一步
    // if (!Session.get('token')) return false;
    // // 触发初始化用户信息
    // store.dispatch('userInfos/setUserInfos');
    // // 获取路由菜单数据
    // const res = await getBackEndControlRoutes();
    // // 存储接口原始路由（未处理component），根据需求选择使用
    // store.dispatch('requestOldRoutes/setBackEndControlRoutes', JSON.parse(JSON.stringify(res.data)));
    // // 处理路由（component），替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
    // dynamicRoutes[0].children = await backEndComponent(res.data);
    // // 添加动态路由
    // await setAddRoute();
    // // 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
    // setFilterMenuAndCacheTagsViewRoutes();
}