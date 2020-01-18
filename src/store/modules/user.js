import {
  login,
  logout,
  getUserInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  Message
} from 'element-ui'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userid: 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERID: (state, userid) => {
      state.userid = userid
      sessionStorage.setItem('userid', userid)
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({
      commit
    }, userInfo) {
      const username = userInfo.user_name.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          if (data.Result) {
            commit('SET_TOKEN', data.Data.token)
            setToken(data.Data.token)
            resolve(data)
          } else {
            reject(data)
          }
        }).catch(e => {
          console.log('store LoginByUsername', e)
          console.log(e instanceof SyntaxError) // true
          console.log(e.message) // "missing ; before statement"
          console.log(e.name) // "SyntaxError"
          console.log(e.fileName) // "Scratchpad/1"
          console.log(e.lineNumber) // 1
          console.log(e.columnNumber) // 4
          console.log(e.stack) // "@Scratchpad/1:2:3\n"
          reject(e)
        })
      })
    },

    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data

          if (data.Result) {
            commit('SET_TOKEN', data.Data.token)
            setToken(data.Data.token)
          } else {
            Message.error(data.Message)
          }
          resolve(data)
        }).catch(error => {
          console.log('请求网络失败', error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          console.log('GetInfo')
          const data = response.data
          // if (data.Data.roles && data.Data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.Data.roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          commit('SET_NAME', data.Data.UserName)
          commit('SET_USERID', data.Data.ID)
          resolve(data.Data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
