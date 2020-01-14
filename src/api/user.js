import request from '@/utils/request'

export function getUserListApi (data) {
    return request({
        url: 'api/User/GetList',
        method: 'post',
        data
    })
}

export function updateLiveStateApi (data) {
    return request({
        url: 'api/User/UpdateLiveState',
        method: 'post',
        data
    })
}

export function deleteApi (data) {
    return request({
        url: 'api/User/Delete',
        method: 'post',
        data
    })
}

export function addApi (data) {
    return request({
        url: 'api/User/Add',
        method: 'post',
        data
    })
}
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



