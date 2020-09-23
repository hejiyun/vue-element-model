import { InputC, NumberInput, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/channel_pool_manage/search'

const config = {
  searchBar: [
    {
      cmp: HeadSelect,
      prop: 'poolCode',
      options: [],
      placeholder: '请选择渠道商品池',
      optionHeader: ['渠道代码', '渠道名称'],
      mapping: ['poolCode', 'poolName'],
      filterable: true,
      rules: {
        required: true, message: '请选择渠道商品池', trigger: 'change'
      },
      label: '渠道池'
    },
    {
      cmp: HeadSelect,
      prop: 'brand',
      options: [],
      optionHeader: ['品牌代码', '品牌名称'],
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
      { label: '渠道商品池名称', prop: 'poolName' }, { label: '渠道商品池编码', prop: 'poolCode' },
      { label: '商品条码', prop: 'productNo' },
      { label: '商品货号', prop: 'productCode', width: '120' }, { label: '可用库存数', prop: 'availableQty' },
      { label: '占用库存数', prop: 'occupiedQty', width: '120' }, { label: '冻结库存数', prop: 'frozenQty' },
      { label: '品牌', prop: 'brandName', width: '120' }, { label: '尺码', prop: 'sizeName' },
      { label: '吊牌价', prop: 'suggestedRetailPrice' }, { label: '类别', prop: 'productTypeValue', width: '120' },
      { label: '项目', prop: 'productProjectValue' }, { label: '系列', prop: 'productSeriesValue', width: '120' },
      { label: '款型', prop: 'productPatternValue' }, { label: '最后更新时间', prop: 'updateTime' }
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

export { config }
