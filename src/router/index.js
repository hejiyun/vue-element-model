import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: 'dashboard',
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@page/login.vue'),
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@page/404.vue'),
    name: '',
    hidden: true
  },
  {
    path: '',
    component: () => import('@page/home.vue'),
    single: true,
    name: '宝唯首页',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-message', // 图标样式class
    children: [
      {
        path: '/dashboard',
        name: '宝唯首页',
        component: () => import('@page/dashboard.vue'),
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  },
  {
    path: '/role',
    component: () => import('@page/home.vue'),
    single: false,
    name: '权限管理',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-message', // 图标样式class
    children: [
      {
        path: 'enterRole',
        name: '用户管理-内部',
        component: () => import('@page/role/enterRole'),
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'setRole',
        component: () => import('@page/role/setRole'),
        name: '角色管理-设置权限',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'addRole',
        component: () => import('@page/role/addRole'),
        name: '新增资源',
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  },
  {
    path: '/menu1',
    component: () => import('@page/home.vue'),
    name: '菜單一',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-message', // 图标样式class
    children: [
      {
        path: 'sub1',
        component: () => import('@page/menu1/sub1.vue'),
        name: '子菜單一',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'sub2',
        component: () => import('@page/menu1/sub2.vue'),
        name: '子菜單二',
        meta: {
          keepAlive: true // 不需要缓存
        },
        iconCls: 'el-icon-message', // 图标样式class
        children: [
          {
            path: 'sub21',
            component: () => import('@page/menu1/sub21.vue'),
            name: '复子菜單一',
            meta: {
              keepAlive: true // 不需要缓存
            },
            iconCls: 'el-icon-message' // 图标样式class
          },
          {
            path: 'sub22',
            component: () => import('@page/menu1/sub22.vue'),
            name: '复子菜單二',
            meta: {
              keepAlive: true // 不需要缓存
            },
            iconCls: 'el-icon-message' // 图标样式class
          }
        ]
      },
      {
        path: 'sub3',
        component: () => import('@page/menu1/sub3.vue'),
        name: '子菜單三',
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  },
  {
    path: '/menu2',
    component: () => import('@page/home.vue'),
    name: '菜單二',
    iconCls: 'el-icon-message',
    meta: {
      keepAlive: true // 不需要缓存
    },
    children: [
      {
        path: 'sub1',
        component: () => import('@page/menu2/sub1.vue'),
        name: '配置管理',
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  }
];
var router = new VueRouter({
  routes
})
export default router;
