const name = 'AddPurchase'
const data = function() {
  return {
    addForm: {
      purchaseType: '', // 单据类型
      purchaseYearCode: '', // 年份
      purchaseSeasonCode: '', // 季节
      brandCode: '', // 品牌
      purchaseIncomingNo: '', // 采购到货单号
      buildNoDate: '', // 开单日期
      expectIncomingTime: '', // 预计到货时间
      supplierCode: '', // 供应商
      inWarehouseCode: '', // 入库仓库
      transportMethodCode: '', // 发运方式
      amountCalculationModeCode: 'C4013', // 金额计算方式
      sourceBillNo: '', // 来源单号
      manualBillNo: '', // 手工单号
      remark: '' // 备注
    },
    purchaseTypeList: [], // 单据类型List
    purchaseYearList: [], // 年份List
    purchaseSeasonList: [], // 季节List
    brandList: [], // 品牌List
    supplierList: [], // 供应商List
    inWarehouseList: [], // 入库仓库List
    transportMethodList: [], // 发运方式List
    amountCalculationModeList: [], // 金额计算方式List
    fileList: [], // 选取的文件List
    pickerOptions: { // 计算 预计到货日期不能早于开单日期 开单日期即当前日期
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7
      }
    },
    dialogTableVisible: false, // 自动分货弹框是否显示，默认不显示
    allocateList: [], // 仓库对应分配渠道信息
    inWarehouseCode: '', // 选中的入库仓库的代码
    inWarehouseName: '', // 选中的入库仓库的名称
    autoDeliveryInfo: [], // 存储设置了分货规则的仓库信息
    hasDelRules: false, // 是否设置了分货规则
    hasSetRulesTip: false, // 自动分货已设置提醒弹框 默认不显示
    formData: [], // 保存选择的文件
    discount: 0, // 控制刷新次数
    rules: { // 提交时的表单校验
      purchaseType: [
        { required: true, message: '请选择单据类型', trigger: 'change' }
      ],
      purchaseYearCode: [
        { required: true, message: '请选择年份', trigger: 'change' }
      ],
      purchaseSeasonCode: [
        { required: true, message: '请选择季节', trigger: 'change' }
      ],
      expectIncomingTime: [
        { required: true, message: '请选择预计到货时间', trigger: 'change' }
      ],
      inWarehouseCode: [
        { required: true, message: '请选择入库仓库', trigger: 'change' }
      ],
      brandCode: [
        { required: true, message: '请选择品牌', trigger: 'change' }
      ],
      supplierCode: [
        { required: true, message: '请选择供应商', trigger: 'change' }
      ],
      transportMethodCode: [
        { required: true, message: '请选择发运方式', trigger: 'change' }
      ],
      amountCalculationModeCode: [
        { required: true, message: '请选择金额计算方式', trigger: 'change' }
      ],
      sourceBillNo: [
        { required: true, message: '请输入来源单号', trigger: 'blur' }
      ]
    },
    loading: false
  }
}
export default {
  name: name,
  data: data
// eslint-disable-next-line semi
};
