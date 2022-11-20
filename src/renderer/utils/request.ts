import axios from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Local, Session} from '@renderer/utils/storage';
// import {AxiosInstance} from "a-axios";

export const APPLICATION_JSON = 'application/json';
export const APPLICATION_FORM = 'application/x-www-form-urlencoded;charset=UTF-8';
export const APPLICATION_FILE = 'multipart/form-data';
// 配置新建一个 axios 实例
const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 50000,
    headers: {'Content-Type': 'application/json'},
});
const resourceService = axios.create()
resourceService.interceptors.request.use(config => {
    return config
}, error => {
    console.log('error')
    return Promise.reject(error);
})
resourceService.interceptors.response.use((response) => {
    if (response.status === 200) return response
    return null
}, error => {
    console.log('error')
    return Promise.reject(error);
})

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么 token
        if (Session.get('Authorization') || Local.get('Authorization')) {
            let Authorization = 'Bearer ' + (Session.get('Authorization') || Local.get('Authorization'));
            (<any>config.headers)['Authorization'] = `${Authorization}`;
        }
        (<any>config.headers)['env'] = 'admin'
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
let toLogin = false
const toLoginHandle = () => {
    console.log(toLogin)
    if (!toLogin) {
        toLogin = true
        console.log('toLogin')
        ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
            .then(() => {
                window.$router.replace({name: 'login'})
                toLogin = false
            })
            .catch(() => {
                window.$router.replace({name: 'login'})
                toLogin = false
            });
    }
}
// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data;
        if (res.code && res.code !== 200) {
            // `token` 过期或者账号已在别处登录
            if (res.code === 403) {
                // Session.clear(); // 清除浏览器全部临时缓存
                Local.remove('Authorization')
                Session.remove('Authorization')
                toLoginHandle()
            } else {
                ElMessage.error(res.message)
            }
            return Promise.reject(response.data);
        } else {
            return response.data;
        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.message.indexOf('timeout') != -1) {
            ElMessage.error('网络超时');
        } else if (error.message == 'Network Error') {
            ElMessage.error('网络连接错误');
        } else {
            if (error.message) ElMessage.error(error.message);
            else ElMessage.error('接口资源不存在');
        }
        return Promise.reject(error);
    }
);

export const put = async (url, data?): Promise<Response> => {
    return await service.request({
        url: url,
        data: data,
        method: 'put'
    })
}

export const post = async (url, data = {}, header): Promise<Response> => {
    return await service.request({
        url: url,
        data: header === APPLICATION_JSON ? data : null,
        params: header === APPLICATION_FORM ? data : null,
        method: 'post',
        headers: {'Content-Type': header}
    })
}

export const get = async (url, data?): Promise<Response> => {
    return await service.request({
        url: url,
        params: data,
        method: 'get',
        headers: {'Content-Type': APPLICATION_FORM}
    })
}
export const upload = async (url, data): Promise<Response> => {
    return await service.request({
        url: url,
        data: data,
        method: 'post',
        headers: {'Content-Type': APPLICATION_FILE}
    })
}
export const checkResource = async (url) => {
    try {
        return await resourceService.request({
            url: url,
            method: 'HEAD'
        })
    } catch (e) {
        return null
    }
}

interface Response {
    code: Number,
    message: string,
    result: any
}