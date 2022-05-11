import {get, upLoad} from '@renderer/utils/request';

export const useCommonApi = () => {
    return {
        upLoad: (params) => {
            return upLoad('/admin/common/images/upload/tmp', params)
        }
    }
}