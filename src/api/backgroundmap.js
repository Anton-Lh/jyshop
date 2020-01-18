import request from '@/utils/request'

export function getbgimg (data) {
    return request({
        url: '/api/Bgimg/GetList',
        method: 'post',
        data
    })
}
export function addbgimg (data) {
    return request({
        url: '/api/Bgimg/Add',
        method: 'post',
        data
    })
}
export function updatebgimg (data) {
    return request({
        url: '/api/Bgimg/Update',
        method: 'post',
        data
    })
}
export function delbgimg (data) {
    return request({
        url: '/api/Bgimg/Delete',
        method: 'post',
        data
    })
}

