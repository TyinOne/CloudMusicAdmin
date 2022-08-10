import {APPLICATION_JSON, get, post, put} from '@renderer/utils/request';

export const useInviteCodeApi = () => {
    return {
        generateInviteCode: (params) => {
            return put('/admin/invite/generate', params)
        },
        getInviteCodeList: (params) => {
            return get('/admin/invite/list', params)
        },
        removeInviteCode: (params) => {
            return put('/admin/invite/remove', params)
        }
    }
}