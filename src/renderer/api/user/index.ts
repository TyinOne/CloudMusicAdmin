import {APPLICATION_JSON, get, post} from '@renderer/utils/request';

export const userApi = () => {
    return {
        login: async (data) => {
            return await post('/admin/user/login', data, APPLICATION_JSON)
        }
    }
}