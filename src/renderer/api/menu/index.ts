import {get} from '@renderer/utils/request';

export const useMenuApi = () => {
    return {
        getMenuAdmin: async () => {
            console.log(123)
        },
        getMenuPermission: () => {
            return get('/admin/router/permission')
        },
        getMenuLabel: (params) => {
            return get('/admin/label/menu', params)
        },
        getMenuRes: (params) => {
            return get('/admin/menu/list/tree', params)
        }
    }
}