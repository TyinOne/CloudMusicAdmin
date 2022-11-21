import {upload} from '@renderer/utils/request';

export const useCommonApi = () => {
    return {
        uploadImg: (params) => {
            return upload('/admin/common/images/upload/tmp', params)
        },
        uploadPackage: (params) => {
            return upload('/admin/common/package/upload/tmp', params)
        },
        parseUpdateJson: (params) => {
            return upload('/admin/common/parse/update', params)
        }
    }
}