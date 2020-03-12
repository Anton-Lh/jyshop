import request from '@/utils/request'

export function geteCodeList (data) {
    return request({
        url: '/api/Qrcode/GetList',
        method: 'post',
        data
    })
}
export function addEcode (data) {
    return request({
        url: '/api/Qrcode/Add',
        method: 'post',
        data
    })
}

export function delEcode (data) {
    return request({
        url: '/api/Qrcode/Delete',
        method: 'post',
        data
    })
}
//导出Excel
export function excelApi (data) {
    return request({
        url: '/api/Qrcode/ImportExcel',
        method: 'post',
        data
    })
}

