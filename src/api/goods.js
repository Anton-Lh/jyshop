import request from '@/utils/request'

export function getList (data) {
    return request({
        url: '/api/Goods/GetList',
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

