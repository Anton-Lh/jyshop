import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'
// import router from '@/router'
import { getToken } from '@/utils/auth'

let loading // 定义loading变量
function startLoading () { // 使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        // spinner: 'el-icon-loading',
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.5)'
    })
}
function endLoading () { // 使用Element loading-close 方法
    loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading () {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading () {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api 的 base_url
    timeout: 0 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        /**
         * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
         * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
         */
        const res = response.data
        if (res.Status === '10000' || res.Status === '10001') {
            Message.error('会话超时，请重新登录')
        }
        return response
    },
    error => {
        console.log('interceptors err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
