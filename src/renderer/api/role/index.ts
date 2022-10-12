import {APPLICATION_JSON, get, post, put} from '@renderer/utils/request';

export const useRoleApi = () => {
    return {
        getRoleLabel: () => {
            return get('/admin/label/role')
        },
        getRoleKeyLabel: () => {
            return get('/admin/label/role/key')
        },
        getRoleList: (params) => {
            return get('/admin/role/list', params)
        },
        addRole: (params) => {
            return post('/admin/role/add', params, APPLICATION_JSON)
        },
        updateRole: (params) => {
            return put('/admin/role/update', params)
        }
    }
}