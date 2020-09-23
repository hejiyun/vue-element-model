// 价格管理页table
export const goodsListTableConfig = {
  labelArr: [{
    label: '货品简称',
    type: 1,
    width: 200,
    key: 'short_name'
  },
  {
    label: '品牌',
    type: 1,
    key: 'brand_value'
  },
  {
    label: '恒康货号',
    type: 1,
    key: 'hk_product_code'
  },
  {
    label: '类别',
    type: 1,
    key: 'product_type_value'
  }, {
    label: '系列',
    type: 1,
    key: 'product_series_value'
  }, {
    label: '项目',
    type: 1,
    key: 'product_project_value'
  }, {
    label: '性别',
    type: 1,
    key: 'sex_value'
  }, {
    label: '年份',
    type: 1,
    key: 'product_year'
  }, {
    label: '季节',
    type: 1,
    key: 'develop_season_value'
  }, {
    label: '上市时间',
    type: 1,
    key: 'listing_date'
  }, {
    label: '吊牌价',
    type: 1,
    key: 'tag_price'
  }, {
    label: '采购成本',
    type: 1,
    key: 'procurement_cost'
  }, {
    label: '净值成本',
    type: 1,
    key: 'net_cost'
  }, {
    label: '商品指导价',
    type: 1,
    key: 'guide_price'
  }, {
    label: '商品指导折扣',
    type: 1,
    key: 'guide_price_ratio'
  }, {
    label: '操作',
    type: 4,
    btnName1: '查看详情',
    btnName2: '监控配置',
    key: 'key2'
  }],
  dataList: [{
    key1: 'portal',
    key2: 'portal',
    key3: 'portal',
    key4: 'portal'
  }],
  selection: false // 是否展示
}
// 价格管理详情页table
export const goodsDetailTableConfig = {
  labelArr: [{
    label: '导入时间',
    type: 1,
    key: 'create_time'
  },
  {
    label: '价格执行周期',
    type: 1,
    width: 300,
    key: 'price_execution_cycle_start'
  },
  {
    label: '零售价',
    type: 1,
    key: 'tag_price'
  },
  {
    label: '商品指导价',
    type: 1,
    key: 'guide_price'
  },
  {
    label: '商品指导折扣',
    type: 1,
    key: 'guide_price_ratio'
  },
  {
    label: '操作人',
    type: 1,
    key: 'created_by_user_name'
  }],
  dataList: [{
    key1: 'portal',
    key2: 'portal',
    key3: 'portal',
    key4: 'portal'
  }],
  selection: false // 是否展示
}
// 价格管理警告页table
export const goodsWarningTableConfig = {
  labelArr: [{
    label: '平台订单',
    type: 5,
    width: 220,
    key: 'warn_book_no'
  },
  {
    label: '所属店铺',
    type: 1,
    key: 'shop_name'
  },
  {
    label: '货号',
    type: 1,
    key: 'warn_hk_product_code'
  },
  {
    label: '折扣差值',
    type: 1,
    key: 'discount_diff'
  },
  {
    label: '预警原因',
    type: 1,
    width: 200,
    key: 'reason'
  },
  {
    label: '预警时间',
    type: 1,
    width: 200,
    key: 'create_time'
  },
  {
    label: '操作反馈',
    type: 1,
    key: 'feedback'
  },
  {
    label: '操作',
    type: 2,
    btnName1: '编辑',
    key: 'key2'
  }],
  dataList: [{
    key1: 'portal',
    key2: 'portal',
    key3: 'portal',
    key4: 'portal'
  }],
  selection: false // 是否展示
}
// 价格管理操作日志，数据导入日志table
export const goodsOptionDataTableConfig = {
  labelArr: [{
    label: '操作人',
    type: 1,
    key: 'created_by_user_name'
  },
  {
    label: '操作时间',
    type: 1,
    key: 'create_time'
  },
  {
    label: '状态',
    type: 1,
    key: 'import_status'
  },
  {
    label: '导入成功/数据总数',
    type: 1,
    key: 'import_count'
  },
  {
    label: '操作',
    type: 2,
    btnName1: '导入结果下载',
    key: 'key2'
  }],
  dataList: [{
    key1: 'portal',
    key2: 'portal',
    key3: 'portal',
    key4: 'portal'
  }],
  selection: false // 是否展示
}
// 价格管理操作日志，监控设置日志table
export const goodsOptionWatchTableConfig = {
  labelArr: [{
    label: '操作人',
    type: 1,
    key: 'created_by_user_name'
  },
  {
    label: '操作时间',
    type: 1,
    key: 'create_time'
  },
  {
    label: '监控范围',
    type: 1,
    key: 'source_code'
  },
  {
    label: '阈值',
    type: 1,
    key: 'monitor_threshold'
  }],
  dataList: [{
    key1: 'portal',
    key2: 'portal',
    key3: 'portal',
    key4: 'portal'
  }],
  selection: false // 是否展示
}
// 价格管理操作日志，数据导入日志table
export const goodsOptionWarningTableConfig = {
  labelArr: [{
    label: '操作人',
    type: 1,
    key: 'created_by_user_name'
  },
  {
    label: '操作时间',
    type: 1,
    key: 'create_time'
  },
  {
    label: '预警货号',
    type: 1,
    key: 'warn_hk_product_code'
  },
  {
    label: '预警订单',
    type: 1,
    key: 'warn_book_no'
  }],
  dataList: [{
    key1: 'portal',
    key2: 'portal',
    key3: 'portal',
    key4: 'portal'
  }],
  selection: false // 是否展示
}
