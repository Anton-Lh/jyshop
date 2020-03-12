import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
    { path: '/login', component: () => import('@/views/login/index'), hidden: true },
    { path: '/404', component: () => import('@/views/404'), hidden: true },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        // hidden: true,
        children: [{
            path: 'dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '首页', icon: 'example' }
        }]
    },


    {
        path: '/user',
        component: Layout,
        children: [
            {
                path: 'userList',
                name: '账号管理',
                component: () => import('@/views/user/userList'),
                meta: { title: '账号管理', icon: 'team' }
            }
        ]
    },
    {
        path: '/customer',
        component: Layout,
        meta: { title: '客户管理', icon: '用户管理' },
        children: [
            {
                path: 'customer_list',
                name: '客户管理',
                component: () => import('@/views/customer/customer_list'),
                meta: { title: '客户管理', icon: '用户管理' }
            },
        ]
    },
    {
        path: '/codemanagement',
        component: Layout,
        meta: { title: '二维码管理', icon: 'tree' },
        children: [
            {
                path: 'code_list',
                name: '二维码管理',
                component: () => import('@/views/codemanagement/code_list'),
                meta: { title: '二维码管理', icon: 'tree' }
            },
        ]
    },
    {
        path: '/ordermanagement',
        component: Layout,
        meta: { title: '订单管理', icon: 'form' },
        children: [
            {
                path: 'order_list',
                name: '订单管理',
                component: () => import('@/views/ordermanagement/order_list'),
                meta: { title: '订单列表', icon: 'form' }
            },
        ]
    },
    {
        path: '/coupons',
        component: Layout,
        meta: { title: '卡券管理', icon: 'teacher' },
        children: [
            {
                path: 'coupons_list',
                name: '卡券管理',
                component: () => import('@/views/coupons/coupons_list'),
                meta: { title: '卡券列表', icon: 'table' }
            },
        ]
    },

    {
        path: '/commoditymanagement',
        component: Layout,
        meta: { title: '商品管理', icon: 'school' },
        children: [
            {
                path: 'commoditymanagement',
                name: '商品管理',
                component: () => import('@/views/commoditymanagement/commodity_list'),
                meta: { title: '商品管理', icon: 'school' }
            },
        ]
    },

    {
        path: '/bckgroundmap',
        component: Layout,
        meta: { title: '背景图管理', icon: 'example' },
        children: [
            {
                path: 'bckgroundmap',
                name: '背景图管理',
                component: () => import('@/views/bckgroundmap/bckgroundmap'),
                meta: { title: '背景图管理', icon: 'example' }
            },
        ]
    },

    // {
    //   path: '/user',
    //   component: Layout,
    //   name: 'User',
    //   meta: { title: '系统管理', icon: 'example' },
    //   children: [
    //     {
    //       path: 'userList',
    //       name: '账号列表',
    //       component: () => import('@/views/user/userList'),
    //       meta: { title: '账号列表', icon: 'table' }
    //     }
    //   ]
    // },

    { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
