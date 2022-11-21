import {APPLICATION_JSON, get, post, put} from '@renderer/utils/request';

export const useUserApi = () => {
    return {
        /**
         * self
         */
        signIn: (params) => {
            return post('/admin/user/login', params, APPLICATION_JSON)
        },
        signUp: (params) => {
            return post('/admin/user/register', params, APPLICATION_JSON)
        },
        logout: () => {
            return put('/admin/user/logout')
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
        },
        resetPassword: (params) => {
            return put('/admin/account/password/reset', params)
        }
    }
}