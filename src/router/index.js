import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// cv以下代码解决路由地址重复的报错问题(一劳永逸)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
    iconCls: 'el-icon-location', // 图标样式class
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
    iconCls: 'el-icon-s-custom', // 图标样式class
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
    path: '/pos',
    component: () => import('@page/home.vue'),
    name: '销售库存管理',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-view', // 图标样式class
    children: [
      {
        path: 'storePool',
        component: () => import('@page/pos/storePool'),
        name: '店铺商品池管理',
        meta: {
          keepAlive: true // 不需要缓存
        },
        children: [
          {
            path: 'setting',
            component: () => import('@page/pos/storePool/setting'),
            name: '店铺商品池配置',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'search',
            component: () => import('@page/pos/storePool/search'),
            name: '店铺商品池库存查询',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'push',
            component: () => import('@page/pos/storePool/push'),
            name: '商品上下架',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'batchPush',
            component: () => import('@page/pos/storePool/batchPush'),
            name: '批量上下架结果查询',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'batchPushDetail',
            component: () => import('@page/pos/storePool/batchPushDetail'),
            name: '批量上下架结果详情',
            hidden: true,
            meta: {
              keepAlive: true // 不需要缓存
            }
          }
        ]
      },
      {
        path: 'salePool',
        component: () => import('@page/pos/salePool'),
        name: '销售商品池管理',
        meta: {
          keepAlive: true // 不需要缓存
        },
        iconCls: 'el-icon-message', // 图标样式class
        children: [
          {
            path: 'setting',
            component: () => import('@page/pos/salePool/setting'),
            name: '销售商品池配置',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'search',
            component: () => import('@page/pos/salePool/search'),
            name: '销售商品池库存查询',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'pull',
            component: () => import('@page/pos/salePool/pull'),
            name: '商品下架出库',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'pullLog',
            component: () => import('@page/pos/salePool/pullLog'),
            name: '下架出库记录',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'pullLogDetail',
            component: () => import('@page/pos/salePool/pullLogDetail'),
            name: '下架出库记录详情',
            hidden: true,
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'selectProduct',
            component: () => import('@page/pos/salePool/selectProduct'),
            name: '商品分货',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'addSelect',
            component: () => import('@page/pos/salePool/addSelect'),
            name: '新增分货',
            hidden: true,
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'editSelect',
            component: () => import('@page/pos/salePool/editSelect'),
            name: '编辑分货',
            hidden: true,
            meta: {
              keepAlive: true // 不需要缓存
            }
          }
        ]
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
