import request from '@/utils/request'

export function getCoupons (data) {
    return request({
        url: '/api/Ticket/GetList',
        method: 'post',
        data
    })
}
export function delCoupons (data) {
    return request({
        url: '/api/Ticket/Delete',
        method: 'post',
        data
    })
}
export function addCoupons (data) {
    return request({
        url: '/api/Ticket/Add',
        method: 'post',
        data
    })
}
export function editCoupons (data) {
    return request({
        url: '/api/Ticket/Update',
        method: 'post',
        data
    })
}
// 静态卡券
export function GetTTicketAll () {
    return request({
        url: '/api/Ticket/GetTTicketAll',
        method: 'post',
    })
}