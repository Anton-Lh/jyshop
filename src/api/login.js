import request from '@/utils/request'

export function login(UserName, Password) {
  const data = {
    UserName,
    Password,
    is_web_login: true
  }
  return request({
    url: '/api/User/Login',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/User/GetUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/api/User/Logout',
    method: 'post',
    data
  })
}
