import {RouteRecordRaw} from 'vue-router';
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
                    icon: 'ele-HomeFilled',
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
                        redirect: '/system/server/view',
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
                        children: [
                            {
                                path: '/system/server/view',
                                name: 'systemServerView',
                                component: () => import('@renderer/views/system/server/index.vue'),
                                meta: {
                                    title: '服务器总览',
                                    isLink: '',
                                    isHide: false,
                                    isKeepAlive: true,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin'],
                                    icon: 'ele-Monitor',
                                },
                            },
                            {
                                path: '/system/redis/view',
                                name: 'systemRedisView',
                                component: () => import('@renderer/views/system/redis/index.vue'),
                                meta: {
                                    title: '缓存监控',
                                    isLink: '',
                                    isHide: false,
                                    isKeepAlive: true,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin'],
                                    icon: 'ele-Coin',
                                },
                            },
                            {
                                path: '/system/log/view',
                                name: 'systemLogView',
                                component: () => import('@renderer/views/system/log/index.vue'),
                                meta: {
                                    title: '日志监控',
                                    isLink: '',
                                    isHide: false,
                                    isKeepAlive: true,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin'],
                                    icon: 'ele-Platform',
                                },
                            },
                            {
                                path: '/system/dict/view',
                                name: 'systemDictView',
                                component: () => import('@renderer/views/system/dict/index.vue'),
                                meta: {
                                    title: '字典管理',
                                    isLink: '',
                                    isHide: false,
                                    isKeepAlive: true,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin'],
                                    icon: 'ele-Operation',
                                },
                            },
                        ]
                    },
                    {
                        path: '/system/menu',
                        name: 'systemMenu',
                        component: () => import('@renderer/views/menu/index.vue'),
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
                        component: () => import('@renderer/views/role/index.vue'),
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
                    {
                        path: '/system/user',
                        name: 'systemUser',
                        component: () => import('@renderer/views/user/index.vue'),
                        meta: {
                            title: '用户管理',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'ele-User',
                        },
                    },
                ]
            },
            {
                path: '/personal',
                name: 'personal',
                component: () => import('@renderer/views/personal/index.vue'),
                meta: {
                    roles: ['admin', 'common'],
                    icon: 'ele-User',
                    title: '个人中心',
                    isLink: '',
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    isHide: true
                }
            },
            {
                path: '/download',
                name: 'download',
                component: () => import('@renderer/views/download/index.vue'),
                meta: {
                    roles: ['admin', 'common'],
                    icon: 'ele-Download',
                    title: '下载中心',
                    isLink: '',
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    isHide: true
                }
            },
            {
                path: '/gitee',
                name: 'layoutIframeView',
                component: () => import('@renderer/layout/routerView/iframes.vue'),
                meta: {
                    title: 'Gitee',
                    isLink: 'https://gitee.com/tyin-zero/cloud-music-admin',
                    isHide: true,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: true,
                    roles: ['admin'],
                    icon: 'ele-Flag',
                },
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
    },
];