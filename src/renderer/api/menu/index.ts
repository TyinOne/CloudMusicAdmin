import {APPLICATION_JSON, get, post} from '@renderer/utils/request';

export const useMenuApi = () => {
    return {
        getMenuAdmin: async () => {
            console.log(123)
        },
        getMenuPermission: () => {
            return get('/admin/router/getRouter')
        },
        getMenuLabel: (params) => {
            return get('/admin/label/menu', params)
        },
        getMenuTreeSelectLabel: () => {
            return get('/admin/label/menu/select')
        },
        getMenuDetail: (params) => {
            return get('/admin/menu/detail', params)
        },
        getMenuRes: (params) => {
            return get('/admin/menu/list/tree', params)
        },
        saveMenu: (params) => {
            return post('/admin/menu/save', params, APPLICATION_JSON)
        }
    }
}