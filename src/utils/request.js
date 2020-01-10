import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'
// import router from '@/router'
import { getToken } from '@/utils/auth'

let loading // 定义loading变量
function startLoading() { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    // spinner: 'el-icon-loading',
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.5)'
  })
}
function endLoading() { // 使用Element loading-close 方法
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
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
    // console.log('isTimeOut:' + store.getters.isTimeOut)
    var username = store.getters.roles.account
    // console.log('store.getters.roles', store.getters.roles)
    if (res.Status === '10000' || res.Status === '10001') {
      store.dispatch('setIsTimeOut', true)
      // console.log('router', router)
      MessageBox.alert(`<div role="alert" class="el-alert el-alert--error">
        <i class="el-alert__icon el-icon-info"></i>
          <div class="el-alert__content">
            <span class="el-alert__title">会话超时，请重新登录</span>
          </div>
        </div>
        <div style='margin-top:10px' class="el-input el-input--medium">
          <input id='pwd' type="password" autocomplete="off" class="el-input__inner" placeholder='请输入密码'>
        </div>`, '登录', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '登录',
        showCancelButton: true,
        cancelButtonText: '切换用户',
        showClose: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '登录中...'
            var pwd = document.getElementById('pwd').value
            var postData = {
              user_name: username,
              password: pwd
            }
            store.dispatch('LoginByUsername', postData).then(() => {
              Message.success('登录成功')
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '登录'
              done()
            }).catch((error) => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '登录'
              Message.error(error.Message)
            })
            store.dispatch('setIsTimeOut', false)
          } else if (action === 'cancel') {
            store.dispatch('setIsTimeOut', false)
            store.dispatch('LogOut').then(() => {
              location.reload() // In order to re-instantiate the vue-router object to avoid bugs
            })
          }
        }
      }).then(action => {

      })
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
