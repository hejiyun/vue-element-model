import Vue from "vue"
import VueRouter from "vue-router"

// 引入组件

import login from '../page/login.vue'
import home from '../page/home.vue'
import dashboard from '../page/dashboard.vue'
import test from '../page/test.vue'
import notFound from '../page/404.vue'
import sub11 from '../page/menu1/sub1.vue'
import sub12 from '../page/menu1/sub2.vue'
import sub121 from '../page/menu1/sub21.vue'
import sub122 from '../page/menu1/sub22.vue'
import sub13 from '../page/menu1/sub3.vue'
import sub21 from '../page/menu2/sub1.vue'
// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

let routes = [
  {
    path: "/",
    redirect: 'dashboard',
    hidden: true
  },
  {
    path: '/login',
    component: login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: notFound,
    name: '',
    hidden: true
  },
  {
    path: '',
    component: home,
    single: true,
    name: '宝唯首页',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-message', //图标样式class
    children: [
      {
        path: '/dashboard',
        name: '宝唯首页',
        component: dashboard,
        meta: {
          keepAlive: true // 不需要缓存
        },
      }
    ]
  },
  {
    path: '',
    component: home,
    single: true,
    name: '宝唯首页2',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-message', //图标样式class
    children: [
      {
        path: '/test',
        name: '宝唯首页2',
        component: test,
        meta: {
          keepAlive: true // 不需要缓存
        },
      }
    ]
  },
  {
    path: '/menu1',
    component: home,
    name: '菜單一',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-message', //图标样式class
    children: [
      {
        path: 'sub1',
        component: sub11,
        name: '子菜單一',
        meta: {
          keepAlive: true // 不需要缓存
        },
      },
      {
        path: 'sub2',
        component: sub12,
        name: '子菜單二',
        meta: {
          keepAlive: true // 不需要缓存
        },
        iconCls: 'el-icon-message', //图标样式class
        children: [
          {
            path: 'sub21',
            component: sub121,
            name: '复子菜單一',
            meta: {
              keepAlive: true // 不需要缓存
            },
            iconCls: 'el-icon-message', //图标样式class
          },
          {
            path: 'sub22',
            component: sub122,
            name: '复子菜單二',
            meta: {
              keepAlive: true // 不需要缓存
            },
            iconCls: 'el-icon-message', //图标样式class
          }
        ]
      },
      {
        path: 'sub3',
        component: sub13,
        name: '子菜單三',
        meta: {
          keepAlive: true // 不需要缓存
        },
      }
    ]
  },
  {
    path: '/menu2',
    component: home,
    name: '菜單二',
    iconCls: 'el-icon-message',
    meta: {
      keepAlive: true // 不需要缓存
    },
    children: [
      {
        path: 'sub1',
        component: sub21,
        name: '配置管理',
        meta: {
          keepAlive: true // 不需要缓存
        },
      }
    ]
  }
];
var router = new VueRouter({
    routes
})
export default router;