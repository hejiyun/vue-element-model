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
    path: '/B2BOrder',
    component: () => import('@page/home.vue'),
    name: 'B2B交易管理',
    iconCls: 'el-icon-tickets',
    meta: {
      keepAlive: true // 不需要缓存
    },
    children: [
      {
        path: 'order',
        component: () => import('@page/B2BOrder/orderList'),
        name: '订单列表',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'orderDetail',
        component: () => import('@page/B2BOrder/orderDetail'),
        name: '订单详情',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'orderEdit',
        component: () => import('@page/B2BOrder/orderEdit'),
        name: '修改订单',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'returnList',
        component: () => import('@page/B2BOrder/returnList'),
        name: '退货单列表',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'returnDetail',
        component: () => import('@page/B2BOrder/returnDetail'),
        name: '退货单详情',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  },
  {
    path: '/oms',
    component: () => import('@page/home.vue'),
    name: '线上订单管理',
    iconCls: 'el-icon-shopping-cart-full',
    meta: {
      keepAlive: true // 不需要缓存
    },
    children: [
      {
        path: 'transactionList',
        component: () => import('@page/oms/transactionList'),
        name: '交易单列表',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'transactionDetail',
        component: () => import('@page/oms/transactionDetail'),
        name: '订单详情',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'afterSaleList',
        component: () => import('@page/oms/afterSaleList'),
        name: '售后单列表',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'afterSaleDetail',
        component: () => import('@page/oms/afterSaleDetail'),
        name: '售后单详情',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  },
  {
    path: '/ods',
    component: () => import('@page/home.vue'),
    name: '收发货管理',
    iconCls: 'el-icon-s-grid',
    meta: {
      keepAlive: true // 不需要缓存
    },
    children: [
      {
        path: 'dispatchList',
        component: () => import('@page/ods/dispatchList'),
        name: '发货单列表',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'dispatchDetail',
        component: () => import('@page/ods/dispatchDetail'),
        name: '发货单详情',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'receiveList',
        component: () => import('@page/ods/receiveList'),
        name: '收货单列表',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'receiveDetail',
        component: () => import('@page/ods/receiveDetail'),
        name: '收货单详情',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'jitCombinedOrder',
        component: () => import('@page/ods/JITCombinedOrder'),
        name: 'JIT合单列表',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'jitCombinedOrderDetail',
        component: () => import('@page/ods/JITCombinedOrderDetail'),
        name: 'JIT合单详情',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  },
  {
    path: '/finance',
    component: () => import('@page/home.vue'),
    single: false,
    name: '财务管理',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-pie-chart', // 图标样式class
    children: [
      {
        path: 'jitFinance',
        name: 'JIT财务报表',
        component: () => import('@page/finance/jitFinance'),
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  },
  {
    path: '/basicArchives',
    component: () => import('@page/home.vue'),
    single: false,
    name: '基础档案管理',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-reading', // 图标样式class
    children: [
      {
        path: 'productManage',
        name: '商品管理',
        component: () => import('@page/basicArchives/productManage'),
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'productDetail',
        name: '商品详情',
        component: () => import('@page/basicArchives/productDetail'),
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      }
    ]
  },
  {
    path: '/supplyChain',
    component: () => import('@page/home.vue'),
    name: '供应链管理',
    meta: {
      keepAlive: true // 不需要缓存
    },
    iconCls: 'el-icon-connection', // 图标样式class
    children: [
      {
        path: 'stock',
        component: () => import('@page/supplyChain/stock'),
        name: '库存管理',
        meta: {
          keepAlive: true // 不需要缓存
        },
        children: [
          {
            path: 'physicalSearch',
            component: () => import('@page/supplyChain/stock/physicalSearch'),
            name: '实物库存查询',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'physicalManage',
            component: () => import('@page/supplyChain/stock/physicalManage'),
            name: '实物库存管理',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'channelManage',
            component: () => import('@page/supplyChain/stock/channelManage'),
            name: '渠道库存管理',
            meta: {
              keepAlive: true // 不需要缓存
            }
          }
        ]
      },
      {
        path: 'allocation',
        component: () => import('@page/supplyChain/allocation'),
        name: '调拨管理',
        meta: {
          keepAlive: true // 不需要缓存
        },
        iconCls: 'el-icon-message', // 图标样式class
        children: [
          {
            path: 'transferApplication',
            component: () => import('@page/supplyChain/allocation/transferApplication'),
            name: '调拨申请单列表',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'transferApplicationDetail',
            component: () => import('@page/supplyChain/allocation/transferApplicationDetail'),
            name: '调拨申请单明细',
            hidden: true,
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'addTransferApplication',
            component: () => import('@page/supplyChain/allocation/addTransferApplication'),
            name: '新增调拨申请单',
            hidden: true,
            meta: {
              keepAlive: true // 不需要缓存
            }
          }
        ]
      },
      {
        path: 'purchase',
        component: () => import('@page/supplyChain/purchase'),
        name: '采购管理',
        meta: {
          keepAlive: true // 不需要缓存
        },
        iconCls: 'el-icon-message', // 图标样式class
        children: [
          {
            path: 'document',
            component: () => import('@page/supplyChain/purchase/document'),
            name: '采购单据列表',
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'documentDetail',
            component: () => import('@page/supplyChain/purchase/documentDetail'),
            name: '采购单据明细',
            hidden: true,
            meta: {
              keepAlive: true // 不需要缓存
            }
          },
          {
            path: 'addDocument',
            component: () => import('@page/supplyChain/purchase/addDocument'),
            name: '新增采购单据',
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
    path: '/goodCharge',
    component: () => import('@page/home.vue'),
    name: '商品价格管理',
    iconCls: 'el-icon-edit-outline',
    meta: {
      keepAlive: true // 不需要缓存
    },
    children: [
      {
        path: 'productGuidePrice',
        component: () => import('@page/goodCharge/productGuidePrice'),
        name: '商品指导价管理',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'productGuidePriceDetail',
        component: () => import('@page/goodCharge/productGuidePriceDetail'),
        name: '商品指导价详情',
        hidden: true,
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'warningLog',
        component: () => import('@page/goodCharge/warningLog'),
        name: '预警日志',
        meta: {
          keepAlive: true // 不需要缓存
        }
      },
      {
        path: 'optionLog',
        component: () => import('@page/goodCharge/optionLog'),
        name: '操作日志',
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
