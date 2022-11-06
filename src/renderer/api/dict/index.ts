import {APPLICATION_JSON, get, post, put} from '@renderer/utils/request';

export const useDictApi = () => {
    return {
        getDictList: (params?) => {
            return get('/admin/dict/list', params);
        },
        getDictTypeList: (params?) => {
            return get('/admin/dict/type/list', params);
        },
        getDictLabel: () => {
            return get('/admin/label/dict');
        },
        saveDict: (params) => {
            return post('/admin/dict/save', params, APPLICATION_JSON);
        },
        saveDictType: (params) => {
            return post('/admin/dict/type/save', params, APPLICATION_JSON)
        },
        removeDict: (params) => {
            return post('/admin/dict/remove', params, APPLICATION_JSON)
        },
        removeDictType: (params) => {
            return post('/admin/dict/type/remove', params, APPLICATION_JSON)
        },
        updateDictCache: () => {
            return put('/admin/dict/update/cache')
        }
    }
}