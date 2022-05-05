import {get} from '@renderer/utils/request';

export const useServerApi = () => {
    return {
        getServerConfig: () => {
            return get('/admin/sys/server/config')
        },
        getRedisInfo: () => {
            return get('/admin/sys/server/redis')
        },
        getLogList: (params) => {
            return get('/admin/log/list', params)
        }
    }
}