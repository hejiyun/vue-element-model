// labelArr 表头数组，label，字段名，type:表格cell类型，key:内容字段，与列表内容对应
// dataList 表格内容数组
// selection 是否有选择框
// type:1 文字 2:1个 btn 3 两个btn 4 两个按钮上下
const goodsChargeTableConfig = {
  labelArr: [{
    label: '宝唯',
    type: 1,
    key: 'key1'
  },
  {
    label: '宝唯',
    type: 2,
    key: 'key2'
  },
  {
    label: '宝唯',
    type: 3,
    btnName1: '宝唯',
    key: 'key3'
  },
  {
    label: '宝唯',
    type: 4,
    btnName1: '宝唯',
    btnName2: '宝唯',
    key: 'key4'
  },
  {
    label: '宝唯',
    type: 5,
    key: 'key4'
  }],
  dataList: [{
    key1: 'portal',
    key2: 'portal',
    key3: 'portal',
    key4: 'portal'
  }],
  selection: false // 是否展示
}
export default goodsChargeTableConfig
