import {get} from '@renderer/utils/request';

export const useMenuApi = () => {
    return {
        getMenuAdmin: async () => {
            console.log(123)
        },
        getMenuPermission: async () => {
            console.log(123)
        },
        getMenuLabel: (params) => {
            return get('/admin/menu/label', params)
        }
    }
}