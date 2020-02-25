import request from '@/utils/request'

export function getList (data) {
    return request({
        url: '/api/Goods/GetList',
        method: 'post',
        data
    })
}
export function allGoods (data) {
    return request({
        url: '/api/Goods/GetAll',
        method: 'post',
        data
    })
}
// 查看卡券
export function tikcetGoods (data) {
    return request({
        url: '/api/Goods/GetListByTicketId',
        method: 'post',
        data
    })
}


export function deletePollPicture (data) {
    return request({
        url: '/api/Goods/DeletePollPicture',
        method: 'post',
        data
    })
}

export function addApi (data) {
    return request({
        url: '/api/Goods/Add',
        method: 'post',
        data
    })
}

export function updateApi (data) {
    return request({
        url: 'api/Goods/Update',
        method: 'post',
        data
    })
}

export function deleteApi (data) {
    return request({
        url: 'api/Goods/Delete',
        method: 'post',
        data
    })
}
