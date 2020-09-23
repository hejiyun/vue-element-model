import { InputC, SelectC, HeadSelect, DateC } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_oms/after_sale_order'
import { getCurrentTime } from '@/utils/globalFunction'

const arr = getCurrentTime()

const pageConfig = {
  noGetList: true,
  request: getTableList
}
const searchOptions = [
  {
    cmp: InputC,
    prop: 'returnNo',
    placeholder: '请输入售后单号',
    label: '售后单号'
  },
  {
    cmp: InputC,
    prop: 'orderNo',
    placeholder: '请输入交易单号',
    label: '交易单号'
  },
  {
    cmp: InputC,
    prop: 'externalNo',
    placeholder: '请输入外部单号',
    label: '外部单号'
  },
  {
    cmp: InputC,
    prop: 'platformNo',
    placeholder: '请输入平台单号',
    label: '平台单号'
  },
  {
    cmp: SelectC,
    prop: 'bizTypes',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dicKey', 'dicValue'],
    label: '业务类型'
  },
  {
    cmp: SelectC,
    prop: 'returnTypes',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dicKey', 'dicValue'],
    label: '单据类型'
  },
  {
    cmp: SelectC,
    prop: 'returnStatus',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dicKey', 'dicValue'],
    label: '单据状态'
  },
  {
    cmp: HeadSelect,
    prop: 'shopCode',
    options: [],
    placeholder: '全部',
    filterable: true,
    mapping: ['vendCustCode', 'vendCustName'],
    label: '客店名称'
  },
  {
    cmp: InputC,
    prop: 'senderNameLike',
    placeholder: '请输入客户姓名',
    label: '客户姓名'
  },
  {
    cmp: InputC,
    prop: 'senderMobileLike',
    placeholder: '请输入客户电话',
    label: '客户电话'
  },
  {
    cmp: InputC,
    prop: 'expressNum',
    placeholder: '请输入快递单号',
    label: '快递单号'
  },
  {
    cmp: DateC,
    prop: 'createTime',
    label: '售后单创建时间',
    splitKey: ['createTimeStart', 'createTimeEnd'],
    setDefaultValue: arr
  }

]

export { searchOptions, pageConfig }
