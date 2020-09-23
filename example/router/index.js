import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
// 无权限页面
// 采购
const Purchase = resolve => require(['@/views/purchase/index.vue'], resolve)
const PurchaseList = resolve => require(['@/views/purchase/list/index.vue'], resolve)
const AddPurchase = resolve => require(['@/views/purchase/add/index.vue'], resolve)
const PurchaseDetail = resolve => require(['@/views/purchase/detail/index.vue'], resolve)
const DownloadPurchase = resolve => require(['@/views/purchase/download/index.vue'], resolve)

// 价格管理
const GoodsChargeList = resolve => require(['@new/views/goodsCharge/goodsList/list/index.vue'], resolve)
const GoodsChargeDetail = resolve => require(['@new/views/goodsCharge/goodsList/detail/index.vue'], resolve)
const GoodsChargeWarning = resolve => require(['@new/views/goodsCharge/warning/index.vue'], resolve)
const GoodsChargeOption = resolve => require(['@new/views/goodsCharge/option/index.vue'], resolve)

// 库存批量导入结果下载页
const DownloadStock = resolve => require(['@/views/stock/download/index.vue'], resolve)
// 通用下载页
const CommonDownload = resolve => require(['@new/views/download/index.vue'], resolve)
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    name: 'Dashboard',
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        // component: () => import('@/views/dashboard/dashboard'),
        name: 'Dashboard',
        meta: { title: 'BAOWEI首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // }
]

const router = new Router({
  // mode: 'history', // require service support   //  routers
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
router.beforeEach((to, from, next) => {
  // 全局路由判断跳转非登录页定时返回登录
  next()
})
export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    name: 'User',
    meta: {
      title: '权限管理', icon: 'user', roles: ['AuthorizationManage']
    },
    children: [
      {
        path: '/internal/list',
        component: () => import('@/views/role/user/list'),
        name: 'InternalUser',
        meta: { title: '用户管理-内部' }
      },
      {
        path: '/role/internal/setRole',
        component: () => import('@/views/role/setRole'),
        name: 'setRole',
        meta: { title: '角色管理-权限设置改' }
      },
      {
        path: '/role/internal/addRole',
        component: () => import('@/views/role/addRole'),
        name: 'addRole',
        meta: { title: '新增资源改' }
      }
    ]
  },
  {
    path: '/pos',
    component: Layout,
    name: 'pos',
    meta: {
      title: '销售库存管理',
      icon: 'eye-open',
      roles: ['POS_MGR']
    },
    children: [
      {
        path: '/pos/storepool',
        component: () => import('@/views/pos/storePool/index'),
        name: 'StorePool',
        meta: { title: '店铺商品池管理', roles: ['POS_STORE_MGR'] },
        children: [
          {
            path: '/pos/storepool/setting',
            component: () => import('@/views/pos/storePool/setting'),
            name: 'StorePoolSetting',
            meta: { title: '店铺商品池配置改', roles: ['POS_STORE_POOL_MGR'] }
          },
          {
            path: '/pos/storepool/search',
            component: () => import('@/views/pos/storePool/search'),
            name: 'StorePoolSearch',
            meta: { title: '店铺商品池库存查询改', roles: ['POS_STORE_PRODUCT_MGR'] }
          },
          {
            path: '/pos/storepool/pushFlow',
            component: () => import('@/views/pos/storePool/inventory_push_flow'),
            name: 'StorePoolInventoryPushFlow',
            meta: { title: '库存推送流水查询改', roles: ['POS_STORE_PRODUCT_MGR'] }
          },
          {
            path: '/pos/storepool/push',
            component: () => import('@/views/pos/storePool/upper_lower_shelves'),
            name: 'StorePoolShelves',
            meta: { title: '商品上下架改', roles: ['POS_STORE_PRODUCT_ONFFLINE_MGR'] }
          },
          {
            path: '/pos/storepool/batchproduct',
            component: () => import('@/views/pos/storePool/shelves_result'),
            name: 'StorePoolShelvesResult',
            meta: { title: '批量上下架结果查询改', roles: ['POS_STORE_PRODUCT_ONFFLINE_DETAIL_MGR'] }
          },
          {
            path: '/pos/storepool/batchdetail/:id?',
            component: () => import('@/views/pos/storePool/shelves_result_detail'),
            hidden: true,
            name: 'StorePoolShelvesResultDetail',
            meta: { title: '批量上下架结果详情改', roles: ['POS_STORE_PRODUCT_ONFFLINE_DETAIL_MGR'] }
          }
        ]
      },
      {
        path: '/pos/salepool',
        component: () => import('@/views/pos/salePool/index'),
        name: 'salepool',
        // hidden: true,
        meta: {
          title: '销售商品池管理',
          roles: ['POS_SALES_MGR']
        },
        children: [
          {
            path: '/pos/salepool/product',
            component: () => import('@/views/pos/salePool/setting'),
            name: 'SalePoolSetting',
            meta: { title: '销售商品池配置改', roles: ['POS_SALES_POOL_MGR'] }
            // hidden: true
          },
          {
            path: '/pos/salepool/search',
            component: () => import('@/views/pos/salePool/search'),
            name: 'SalePoolSearch',
            meta: { title: '销售商品池库存查询改', noCache: true, roles: ['POS_SALES_PRODUCT_MGR'] }
          },
          {
            path: '/pos/salepool/pull',
            component: () => import('@/views/pos/salePool/off_shelf_delivery'),
            name: 'SalePoolOffShelfDelivery',
            meta: { title: '商品下架出库改', noCache: true, roles: ['POS_SALES_ONFFLINE_MGR'] }
          },
          {
            path: '/pos/salepool/pulllog',
            component: () => import('@/views/pos/salePool/off_shelf_delivery_log'),
            name: 'SalePoolOffShelfDeliveryLog',
            meta: { title: '下架出库记录改', noCache: true, roles: ['POS_SALES_ONFFLINE_DETAIL_MGR'] }
          },
          {
            path: '/pos/salepool/pulldetail/:id?',
            component: () => import('@/views/pos/salePool/off_shelf_delivery_log_detail'),
            name: 'SalePoolOffShelfDeliveryLogDetail',
            hidden: true,
            meta: { title: '下架出库记录详情改', noCache: true, roles: ['POS_SALES_ONFFLINE_DETAIL_MGR'] }
          },
          {
            path: '/pos/salepool/select',
            component: () => import('@/views/pos/salePool/product_distribute'),
            name: 'SalePoolProductDistribute',
            meta: { title: '商品分货改', noCache: true, roles: ['POS_SALES_PRODUCT_TRANSFER_LIST_MGR'] }
          },
          {
            path: '/pos/salepool/selectDetail/:id?',
            component: () => import('@/views/pos/salePool/product_distribute_detail'),
            name: 'SalePoolProductDistributeDetail',
            hidden: true,
            meta: { title: '分货详情改', noCache: true, roles: ['POS_SALES_PRODUCT_TRANSFER_MGR'] }
          },
          {
            path: '/pos/salepool/addselect',
            component: () => import('@/views/pos/salePool/product_distribute_add'),
            name: 'SalePoolProductDistributeAdd',
            hidden: true,
            meta: { title: '新增分货改', noCache: true, roles: ['POS_SALES_PRODUCT_TRANSFER_CREATE_MGR'] }
          },
          {
            path: '/pos/salepool/editselect/:id?',
            component: () => import('@/views/pos/salePool/product_distribute_edit'),
            name: 'SalePoolProductDistributeEdit',
            hidden: true,
            meta: { title: '编辑分货改', noCache: true, roles: ['POS_SALES_PRODUCT_TRANSFER_EDIT_MGR'] }
          }
        ]
      },
      {
        path: '/pos/channelpool',
        component: () => import('@/views/pos/channelPool/index'),
        name: 'ChannelPool',
        meta: {
          title: '渠道商品池管理'
        },
        children: [
          {
            path: '/pos/channelpool/search',
            component: () => import('@/views/pos/channelPool/search'),
            name: 'ChannelPoolSearch',
            meta: { title: '渠道商品池库存查询', noCache: true }
          }
        ]
      }
    ]
  },
  {
    path: '/TradingPlatform',
    component: Layout,
    redirect: '/TradingPlatform/orderList',
    name: 'TradingPlatform',
    meta: {
      title: 'B2B交易管理',
      roles: ['B2B_Transaction'],
      icon: 'form'
    },
    children: [
      {
        path: '/TradingPlatform/orderList1',
        component: () => import('@/views/tradingPlatform/orderList/List'),
        name: 'OrderList',
        meta: { title: '订单列表', roles: ['B2B_Sales_List'] }
      },
      {
        path: '/TradingPlatform/orderList',
        component: () => import('@/views/B2BTranctionManage/order'),
        name: 'B2BTranctionManageOrder',
        meta: { title: '订单列表改', roles: ['B2B_Sales_List'] }
      },
      {
        path: '/TradingPlatform/returnList1',
        component: () => import('@/views/tradingPlatform/returnList/List'),
        name: 'ReturnList',
        meta: { title: '退货单列表', roles: ['B2B_Return_List'] }
      },
      {
        path: '/TradingPlatform/returnList',
        component: () => import('@/views/B2BTranctionManage/return'),
        name: 'B2BTranctionManageReturn',
        meta: { title: '退货单列表改', roles: ['B2B_Return_List'] }
      },
      {
        path: '/TradingPlatform/List/ListDetail/:id?',
        component: () => import('@/views/tradingPlatform/ListDetail/Detail'),
        name: 'ListDetail',
        meta: { title: '订单详情', noCache: true },
        hidden: true
      },
      {
        path: '/TradingPlatform/List/ListDetail/EditOrder/:id?',
        component: () => import('@/views/tradingPlatform/ListDetail/EditOrder'),
        name: 'EditOrder',
        meta: { title: '修改订单', noCache: true },
        hidden: true
      },
      {
        path: '/TradingPlatform/returnList/creditDetail/:id?',
        component: () => import('@/views/tradingPlatform/returnList/creditDetail'),
        name: 'CreditDetail',
        meta: { title: '销售退货单详情', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/OMS',
    component: Layout,
    name: 'OMS',
    // hidden: true,
    meta: {
      title: '线上订单管理', roles: ['Online_Order_Manage'], icon: 'shopping'
    },
    children: [
      {
        path: '/OMS/OrderList',
        component: () => import('@/views/OMS/transaction_order'),
        name: 'OMSTransactionOrder',
        meta: { title: '交易单列表改', roles: ['Transaction_List'] }
      },
      {
        path: '/OMS/OrderDetail/:No?/:id?',
        component: () => import('@/views/OMS/transaction_order_detail'),
        name: 'OMSTransactionOrderDetail',
        meta: { title: '交易单详情改', noCache: true },
        hidden: true
      },
      {
        path: '/OMS/ReceiveList',
        component: () => import('@/views/OMS/after_sale_order'),
        name: 'OMSAfterSaleOrder',
        meta: { title: '售后单列表改', roles: ['After_Sale_Bill_List'] }
      },
      {
        path: '/OMS/ReceiveDetail/:No?/:id?',
        component: () => import('@/views/OMS/after_sale_order_detail'),
        name: 'OMSAfterSaleOrderDetail',
        meta: { title: '售后单详情改', noCache: true },
        hidden: true
      },
      {
        path: '/OMS/saleSetting',
        component: () => import('@/views/OMS/sale_setting/index.vue'),
        name: 'SaleSetting',
        meta: { title: '销售配置', roles: ['sales_configuration_manage'] },
        children: [
          {
            path: '/OMS/saleSettingExport',
            component: () => import('@/views/OMS/sale_setting/export.vue'),
            name: 'SaleSettingExport',
            meta: { title: '门店JITX选货', roles: ['chosenProductManage'] }
          }
        ]
      }
    ]
  },
  {
    path: '/ODS',
    component: Layout,
    redirect: '/ODS/DeliveryList',
    name: 'ODS',
    meta: {
      title: '收发货管理',
      roles: ['Receive_And_Deliver_Manage'],
      icon: 'table'
    },
    children: [
      {
        path: '/ODS/DeliveryList',
        component: () => import('@/views/ODS/delivery_order'),
        name: 'ODSDeliveryOrder',
        meta: { title: '发货单列表改', roles: ['Dispatch_Bill_List'] }
      },
      {
        path: '/ODS/DeliveryList/DeliveryDetail/:id?/:isMerge?',
        component: () => import('@/views/ODS/delivery_order_detail'),
        name: 'ODSDeliveryOrderDetail',
        meta: { title: '发货详情改', noCache: true },
        hidden: true
      },
      {
        path: '/ODS/DeliveryList/DeliveryDetail1/:id?/:isMerge?',
        component: () => import('@/views/ODS/DeliveryList/DeliveryDetail'),
        name: 'DeliveryDetail',
        meta: { title: '发货详情', noCache: true },
        hidden: true
      },
      {
        path: '/ODS/ReceiveList',
        component: () => import('@/views/ODS/receive_order'),
        name: 'ODSReceiveOrder',
        meta: { title: '收货单列表改', roles: ['Receive_Bill_List'] }
      },
      {
        path: '/ODS/ReceiveList/ReceiveDetail/:id?',
        component: () => import('@/views/ODS/receive_order_detail'),
        name: 'ODSReceiveOrderDetail',
        meta: { title: '收货详情改', noCache: true },
        hidden: true
      },
      {
        path: '/ODS/JITCombinedOrder',
        component: () => import('@/views/ODS/combined_order'),
        name: 'ODSCombinedOrder',
        meta: { title: 'JIT合单列表改', roles: ['Dispatch_Bill_List'] }
      },
      {
        path: '/ODS/JITCombinedOrderDetail/:id?',
        component: () => import('@/views/ODS/combined_order_detail'),
        name: 'ODSCombinedOrderDetail',
        meta: { title: 'JIT合单详情改', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/list',
    name: 'Goods',
    meta: {
      title: '基础档案管理',
      roles: ['Archive_Manage'],
      icon: 'component'
    },
    children: [
      {
        path: '/goods/detail/:id?',
        component: () => import('@/views/goods/detail'),
        name: 'GoodsDetail',
        meta: { title: '货品详情' },
        hidden: true
      },
      {
        path: '/goods/list',
        component: () => import('@/views/goods/list'),
        name: 'GoodsList',
        meta: { title: '商品管理', roles: ['Commodity_Manage'] }
      },
      {
        path: '/warehouseManage/list',
        component: () => import('@/views/warehouseManage/list'),
        name: 'WareHoseList',
        meta: { title: '仓库管理', roles: ['Store_Manage'] }
      },
      {
        path: '/sysmLog/log',
        component: () => import('@/views/sysmLog/index'),
        name: 'SysmLogQuery',
        meta: { title: '仓库日志管理', roles: ['bdOperationLog'] }
      }
    ]
  },
  {
    path: '/stock',
    component: Layout,
    name: 'Stock',
    meta: {
      title: '供应链管理',
      roles: ['Supply_Chain_Mange'],
      icon: 'eye-open'
    },
    children: [
      {
        path: '/stock/index',
        component: () => import('@/views/stock/index'),
        name: 'StockSearch',
        meta: { title: '库存管理', roles: ['Inventory_Allocation'] },
        children: [
          {
            path: '/stock/PhysicalSearch',
            component: () => import('@/views/stock/PhysicalSearch'),
            name: 'PhysicalSearch',
            meta: { title: '实物库存查询', roles: ['Physical_Inventory_Query'] }
          },
          {
            path: '/stock/PhysicalAllocation',
            component: () => import('@/views/stock/PhysicalAllocation'),
            name: 'PhysicalAllocation',
            meta: { title: '实物库存管理', roles: ['Physical_Inventory_Allocation'] }
            // hidden: true
          },
          {
            path: '/stock/ChannelAllocation',
            component: () => import('@/views/stock/ChannelAllocation'),
            name: 'ChannelAllocation',
            meta: { title: '渠道库存管理', roles: ['Channel_Inventory_Allocation'] }
          },
          {
            path: '/stock/ChannelAllocationB2C',
            component: () => import('@/views/stock/ChannelAllocationB2C'),
            name: 'ChannelAllocationB2C',
            meta: { title: '渠道库存管理-B2C', roles: ['Channel_Inventory_Allocation_B2C'] }
          },
          {
            path: '/stock/ChannelAllocationBBC',
            component: () => import('@/views/stock/ChannelAllocationBBC'),
            name: 'ChannelAllocationBBC',
            meta: { title: '渠道库存管理-BBC', roles: ['Channel_Inventory_Allocation_BBC'] }
          },
          {
            path: '/stock/ChannelAllocationJIT',
            component: () => import('@/views/stock/ChannelAllocationJIT'),
            name: 'ChannelAllocationJIT',
            meta: { title: '渠道库存管理-JIT', roles: ['Channel_Inventory_Allocation_JIT'] }
          },
          {
            path: '/stock/download',
            component: DownloadStock,
            name: 'DownloadStock',
            meta: { title: '采购单据明细下载' },
            hidden: true
          }
          // {
          //   path: '/stock/download',
          //   component: DownloadStock,
          //   name: 'DownloadStock',
          //   meta: { title: '采购单据明细下载' },
          //   hidden: true
          // }
        ]
      },
      {
        path: '/transfer',
        component: () => import('@/views/scm/index'),
        name: '调拨管理',
        // hidden: true,
        meta: {
          title: '调拨管理', roles: ['Allocate_Mange']
        },
        children: [
          {
            path: '/scm/list',
            component: () => import('@/views/scm/list'),
            name: 'ScmList',
            meta: { title: '调拨申请单列表', roles: ['Apply_Allocate_Bill_List'] }
            // hidden: true
          },
          {
            path: '/scm/detail/:id?',
            component: () => import('@/views/scm/detail'),
            name: 'ScmDetail',
            meta: { title: '调拨申请单-明细信息', noCache: true },
            hidden: true
          },
          {
            path: '/scm/add',
            component: () => import('@/views/scm/add.vue'),
            name: 'ScmAdd',
            meta: { title: '调拨申请单-新增', noCache: true },
            hidden: true
          }
        ]
      },
      // 采购管理系统
      {
        path: 'Purchase',
        component: Purchase,
        name: 'Purchase',
        meta: { title: '采购管理', roles: ['PurchaseManage'] },
        children: [
          {
            path: '/Purchase/PurchaseList',
            component: PurchaseList,
            name: 'PurchaseList',
            meta: { title: '采购单据列表', noCache: false }
            // hidden: true
          },
          // {
          //   path: '/Purchase/PurchaseDetail/:id?',
          //   component: PurchaseDetail,
          //   name: 'PurchaseDetail',
          //   meta: { title: '采购单据明细' },
          //   hidden: true
          // },
          {
            path: '/purchase/download',
            component: DownloadPurchase,
            name: 'DownloadPurchase',
            meta: { title: '采购单据明细下载' },
            hidden: true
          }
        ]
      },
      {
        path: '/Purchase/AddPurchase',
        component: AddPurchase,
        name: 'AddPurchase',
        meta: { title: '新增采购单', noCache: true },
        hidden: true
      },
      {
        path: '/Purchase/PurchaseDetail/:id?',
        component: PurchaseDetail,
        name: 'PurchaseDetail',
        meta: { title: '采购单据明细', noCache: true },
        hidden: true
      }
    ]
  },

  /** When your routing table is too long, you can split it into small modules**/
  //  无完全遮罩
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    hidden: true,
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },
  {
    path: '/goodsCharge',
    component: Layout,
    redirect: '/GoodsChargeList/list',
    name: 'goodsCharge',
    meta: {
      title: '商品价格管理',
      icon: 'component', roles: ['Pricing_Manage']
    },
    children: [
      {
        path: '/GoodsChargeList/list',
        component: GoodsChargeList,
        name: 'GoodsChargeList',
        meta: { title: '商品指导价管理', noCache: true, roles: ['Pricing_Guide_Price_Manag'] }
      },
      {
        path: '/GoodsCharge/detail/:id?',
        component: GoodsChargeDetail,
        name: 'GoodsChargeDetail',
        meta: { title: '货品详情' },
        hidden: true
      },
      {
        path: '/GoodsChargeWarning',
        component: GoodsChargeWarning,
        name: 'GoodsChargeWarning',
        meta: { title: '预警日志', roles: ['Pricing_Alarm_Log'] }
      },
      {
        path: '/GoodsChargeOption',
        component: GoodsChargeOption,
        name: 'GoodsChargeOption',
        meta: { title: '操作日志', roles: ['Pricing_Operation_Log'] }
      }
    ]
  },
  // 通用下载
  {
    path: '/common',
    component: Layout,
    name: 'CommonDownload',
    meta: { title: 'portal文件下载', noCache: true },
    redirect: '/common/download',
    hidden: true,
    children: [
      {
        path: '/common/download',
        component: CommonDownload,
        name: 'Download',
        meta: { title: 'portal文件下载', noCache: true }
      }
    ]
  },

  { path: '*', redirect: '/error/404', hidden: true }
]
export default router
