import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          if (res) {
            store.dispatch('GenerateRoutes', res).then(() => { // 根据roles权限生成可访问的路由表
              console.log('动态可访问路由表', store.getters.addRouters)
              // router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              
              // if (store.getters.addRouters.length > 0) {
              //   var has = false
              //   store.getters.addRouters.map(v => {
              //     v.children.map(c => {
              //       if (c.path === to.path) {
              //         has = true
              //       }
              //     })
              //   })
              //   if (has) {
              //     next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              //   } else {
              //     var children = store.getters.addRouters[0].children
              //     if (children.length > 0) {
              //       var defaultPath = store.getters.addRouters[0].path + '/' + children[0].path
              //       console.log('*************************跟踪*************************')
              //       console.log(defaultPath)
              //       // next({ path: defaultPath })
              //     } else {
              //       next({ path: '/login' })
              //     }
              //   }
              // } else {
              //   next({ path: '/login' })
              // }
            })
          } else {
            console.log('res为null', to)
            next({ path: '/login' })
          }
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  console.log('router.onError::' + isChunkLoadFailed)
  if (isChunkLoadFailed) {
   router.replace(targetPath);
  }
 });
