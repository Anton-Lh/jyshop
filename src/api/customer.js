import request from '@/utils/request'

export function getList (data) {
    return request({
        url: '/api/Customer/GetList',
        method: 'post',
        data
    })
}
export function addList (data) {
    return request({
        url: '/api/Customer/Add',
        method: 'post',
        data
    })
}
export function delList (data) {
    return request({
        url: '/api/Customer/Delete',
        method: 'post',
        data
    })
}