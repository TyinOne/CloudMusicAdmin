import {APPLICATION_JSON, get, post, put} from '@renderer/utils/request';

export const useScheduledApi = () => {
    return {
        getGroups: () => {
            return get('/admin/label/sched_group')
        },
        getScheduledList: (params) => {
            return  get('/admin/scheduled/list', params)
        },
        saveSchedule: (params) => {
            return post('/admin/scheduled/save', params, APPLICATION_JSON)
        },
        getEditDetail: (params) => {
            return get(`/admin/scheduled/detail/${params.id}`)
        }
    }
}