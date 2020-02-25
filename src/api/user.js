import request from '@/utils/request'

export function getUserListApi(data) {
  return request({
    url: 'api/User/GetList',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: 'api/User/Update',
    method: 'post',
    data
  })
}

export function deleteApi(data) {
  return request({
    url: 'api/User/Delete',
    method: 'post',
    data
  })
}

export function addApi(data) {
  return request({
    url: 'api/User/Add',
    method: 'post',
    data
  })
}
