import {get} from '@renderer/utils/request';

export const useDictApi = () => {
    return {
        getDictList: (params?) => {
            return get('admin/dict/list', params)
        },
        getDictLabel: () => {
            return get('/admin/label/dict')
        }
    }
}