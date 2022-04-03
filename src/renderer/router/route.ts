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
                    title: 'message.router.home',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: true,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'iconfont icon-shouye',
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
];