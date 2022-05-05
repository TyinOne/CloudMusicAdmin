import {APPLICATION_JSON, get, post} from '@renderer/utils/request';

export const useUserApi = () => {
    return {
        login: (data) => {
            return post('/admin/user/login', data, APPLICATION_JSON)
        },
        getUserSession: () => {
            return get('/admin/user/session')
        },
        detail: () => {
            return get('/admin/user/info')
        }
    }
}