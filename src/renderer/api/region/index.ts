import {get} from '@renderer/utils/request';

export const useRegionApi = () => {
    return {
        getRegionLabel: () => {
            return get('/admin/label/region')
        },
        getRegionList: (params) => {
            let parentId = params.parentId | 0
            delete params.parentId
            return get('/admin/region/list/' + parentId, params)
        }
    }
}