import { RouteRecordRaw } from 'vue-router';
import Layout from '@renderer/layout/index.vue'

export const dynamicRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '/',
        component: Layout,
        redirect: '/home',
        meta: {
            isKeepAlive: true,
        },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@renderer/views/home/index.vue'),
                meta: {
                    title: '首页',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: true,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'iconfont icon-shouye',
                },
            },
            {
                path: '/system',
                name: 'system',
                component: Layout,
                redirect: '/system/menu',
                meta: {
                    title: '系统设置',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin'],
                    icon: 'iconfont icon-xitongshezhi',
                },
                children: [
                    {
                        path: '/system/server',
                        name: 'systemServer',
                        component: Layout,
                        meta: {
                            title: '系统状态',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'ele-Grid',
                        },
                        children:[
                            {
                                path: '/system/view',
                                name: 'systemServer',
                                component: () => import('@renderer/views/system/serverView.vue'),
                                meta: {
                                    title: '服务器总览',
                                    isLink: '',
                                    isHide: false,
                                    isKeepAlive: true,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin'],
                                    icon: 'ele-Guide',
                                },
                            }
                        ]
                    },
                    {
                        path: '/system/menu',
                        name: 'systemMenu',
                        component: () => import('@renderer/views/system/menu.vue'),
                        meta: {
                            title: '菜单设置',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'iconfont icon-caidan',
                        },
                    },
                    {
                        path: '/system/role',
                        name: 'systemRole',
                        component: () => import('@renderer/views/system/roles.vue'),
                        meta: {
                            title: '角色设置',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'ele-ColdDrink',
                        },
                    },
                ]
            },
        ]
    }
];

export const staticRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@renderer/views/login/index.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import('@renderer/views/error/404.vue'),
        meta: {
            title: '找不到此页面',
        },
    }
];