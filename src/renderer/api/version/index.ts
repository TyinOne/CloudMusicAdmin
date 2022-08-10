import {APPLICATION_JSON, get, post, put} from '@renderer/utils/request';

export const useVersionApi = () => {
    return {
        getVersionManagerList: (params?) => {
            return get('/admin/version/list', params)
        },
        addVersion: (params) => {
            return post('/admin/version/add', params, APPLICATION_JSON)
        }
    }
}