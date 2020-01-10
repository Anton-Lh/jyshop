import { constantRouterMap } from '@/router' // asyncRouterMap,
import Layout from '@/views/layout/Layout'
const _import = require('@/router/_import_' + process.env.NODE_ENV)

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      // 获取权限菜单
      // commit('SET_ROUTERS', asyncRouterMap)
    //   return new Promise((resolve, reject) => {
    //     getMenuApi({
    //       id: data.role_id
    //     })
    //       .then(res => {
    //         const data = res.data
    //         if (data.Result) {
    //           // 构造树形菜单
    //           console.log('获取权限菜单', data)
    //           var menuArr = data.Data
    //           var parentArr = menuArr.filter(c => !c.pid)
    //           var routers = parentArr.map(v => {
    //             var children = menuArr.filter(c => c.pid === v.id).map(m => {
    //               return {
    //                 path: m.path,
    //                 component: _import(m.component),
    //                 name: m.name,
    //                 hidden: m.hidden,
    //                 meta: {
    //                   title: m.title,
    //                   icon: m.icon,
    //                   noCache: m.noCache
    //                 }
    //               }
    //             })
    //             var redirect = v.path
    //             if (children.length > 0) {
    //               redirect += '/' + children[0].path
    //             }
    //             console.log(v.title, redirect)
    //             return {
    //               path: v.path,
    //               component: Layout,
    //               redirect: redirect,
    //               name: v.name,
    //               meta: {
    //                 title: v.title,
    //                 icon: v.icon,
    //                 noCache: v.noCache
    //               },
    //               alwaysShow: v.always_show,
    //               hidden: v.hidden,
    //               children: children
    //             }
    //           })
    //           console.log('routers', routers)
    //           commit('SET_ROUTERS', routers)
    //           resolve(menuArr)
    //         }
    //         resolve()
    //       })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    }
  }
}

export default permission
