import { InputC, SelectC, NumberInput, Radio, Upload, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/store_pool_manage/upper_lower_shelves'

const config = {
  searchBar: [
    {
      cmp: HeadSelect,
      prop: 'poolCode',
      options: [],
      placeholder: '请选择店铺',
      filterable: true,
      mapping: ['poolCode', 'poolName'],
      rules: {
        required: true, message: '请选择店铺', trigger: 'change'
      },
      label: '店铺'
    },
    {
      cmp: HeadSelect,
      prop: 'brand',
      options: [],
      filterable: true,
      rules: {
        required: true, message: '请选择品牌', trigger: 'change'
      },
      mapping: ['dictCode', 'dictValue'],
      placeholder: '请选择品牌',
      label: '品牌'
    },
    {
      cmp: InputC,
      prop: 'productNos',
      placeholder: '请输入商品条码',
      label: '商品条码'
    }, {
      cmp: InputC,
      prop: 'productCodes',
      placeholder: '请输入商品货号',
      label: '商品货号'
    },
    {
      cmp: NumberInput,
      prop: 'availableQty',
      placeholder: '请输入可用库存',
      label: '可用库存>='
    },
    {
      cmp: SelectC,
      prop: 'onffLineStatus',
      options: [],
      mapping: ['itemCode', 'itemName'],
      placeholder: '请选择商品状态',
      label: '商品状态'
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '店铺名称', prop: 'poolName' }, { label: '店铺编码', prop: 'poolCode' },
      { label: '商品条码', prop: 'productNo' },
      { label: '商品货号', prop: 'productCode', width: '120' }, { label: '品牌', prop: 'brandName', width: '120' },
      { label: '可用库存数', prop: 'availableQty' }, { label: '商品状态', prop: 'onffLineStatusShow' },
      { label: '操作', prop: 'btn', operate: true, width: '120' }
    ],
    tableData: []
  },
  pageConfig: {
    defaultParamter: {
      orderByList: [{ columnName: 'id', order: 'desc' }]
    },
    noGetList: true,
    request: getTableList
  }
}

const shelvesConfig = { options: [
  {
    label: '上架/下架',
    prop: 'onffLineType',
    cmp: Radio,
    list: [{ value: 'ONFFLINE_YES', label: '上架' }, { value: 'ONFFLINE_NOT', label: '下架' }]
  },
  {
    label: '批量导入模板',
    prop: 'export',
    operate: true
  },
  {
    label: '文件',
    prop: 'file',
    cmp: Upload,
    FileTypeList: ['xlsx']
  }
] }

export { config, shelvesConfig }
