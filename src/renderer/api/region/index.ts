import {APPLICATION_JSON, get, post, put} from '@renderer/utils/request';

export const useRegionApi = () => {
    return {
        getRegionLabel: () => {
            return get('/admin/label/region')
        }
    }
}