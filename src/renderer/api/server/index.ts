import {APPLICATION_JSON, get, post} from '@renderer/utils/request';

export const useServerApi = () => {
    return {
        getServerConfig: () => {
            return get('/admin/sys/server/config')
        },
        getRedisInfo: () => {
            return get('/admin/sys/server/redis')
        }
    }
}