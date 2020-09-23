import { InputC, NumberInput, Upload, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/sale_pool_manage/off_shelf_delivery'

const config = {
  searchBar: [
    {
      cmp: HeadSelect,
      prop: 'poolCode',
      options: [],
      placeholder: '请选择销售商品池',
      filterable: true,
      mapping: ['poolCode', 'poolName'],
      rules: {
        required: true, message: '请选择销售商品池', trigger: 'change'
      },
      label: '销售池'
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
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '销售商品池名称', prop: 'poolName' }, { label: '销售商品池编码', prop: 'poolCode' },
      { label: '商品条码', prop: 'productNo' },
      { label: '商品货号', prop: 'productCode', width: '120' }, { label: '品牌', prop: 'brandName', width: '120' },
      { label: '可用库存数', prop: 'availableQty' }, { label: '下架库存', prop: 'btn2', operation: true, width: '200' },
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
