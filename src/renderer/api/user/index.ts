import {APPLICATION_JSON, get, post} from '@renderer/utils/request';

export const useUserApi = () => {
    return {
        /**
         * self
         */
        login: (params) => {
            return post('/admin/user/login', params, APPLICATION_JSON)
        },
        getUserSession: () => {
            return get('/admin/user/session')
        },
        getPersonalDetail: () => {
            return get('/admin/user/info')
        },

        /**
         * account
         */

        getUserList: (params) => {
            return get('/admin/account/list', params)
        },
        getUserDetail: (params) => {
            return get('/admin/account/detail', params)
        },
        saveAccount: (params) => {
            return post('/admin/account/save', params, APPLICATION_JSON)
        }
    }
}