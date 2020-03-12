import request from '@/utils/request'

export function getList (params) {
    return request({
        url: '/table/list',
        method: 'get',
        params
    })
}
export function getEchart () {
    return request({
        url: '/api/Statistics/CustomerPieChart',
        method: 'post',
    })
}

