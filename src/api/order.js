import request from '@/utils/request'

export function getOrder (data) {
    return request({
        url: '/api/Order/GetList',
        method: 'post',
        data
    })
}
export function editOrder (data) {
    return request({
        url: '/api/Order/Update',
        method: 'post',
        data
    })
}
