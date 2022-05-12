import {APPLICATION_JSON, get, post} from '@renderer/utils/request';

export const useDictApi = () => {
    return {
        getDictList: (params?) => {
            return get('admin/dict/list', params)
        },
        getDictLabel: () => {
            return get('/admin/label/dict')
        },
        saveDict: (params) => {
            return post('/admin/dict/save', params, APPLICATION_JSON)
        }
    }
}