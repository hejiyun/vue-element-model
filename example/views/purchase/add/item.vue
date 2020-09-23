<template>
  <div>
    <!-- 采购单新增页 -->
    <el-container class="purchase-add">
      <el-col :span="24" class="add-box">
        <el-form ref="addForm" :model="addForm" :rules="rules">
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="单据类型" label-width="100px" prop="purchaseType">
                <el-radio-group v-model="addForm.purchaseType">
                  <el-radio v-for="(item, index) in purchaseTypeList" :key="index" :label="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="年份" label-width="88px" prop="purchaseYear">
                <el-select v-model="addForm.purchaseYear" class="optionWidth" placeholder="">
                  <el-option
                    v-for="item in purchaseYearList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="季节" label-width="105px" prop="purchaseSeasonCode">
                <el-select v-model="addForm.purchaseSeasonCode" class="optionWidth" placeholder="请选择">
                  <div>
                    <template>
                      <span class="add-code">代码</span>
                      <span class="add-name">名称</span>
                    </template>
                  </div>
                  <el-option
                    v-for="item in purchaseSeasonList"
                    :key="item.value"
                    :label="item.value + '  ' + item.label"
                    :value="item.value">
                    <span class="add-show-code">{{ item.value }}</span>
                    <span class="add-show-season">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="采购到货单号" label-width="100px">
                <el-input v-model="addForm.purchaseIncomingNo" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="开单日期" label-width="88px">
                <el-input v-model="addForm.buildNoDate" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="预计到货时间" label-width="105px" prop="expectIncomingTime">
                <el-date-picker
                  :picker-options="pickerOptions"
                  v-model="addForm.expectIncomingTime"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                  type="date"
                  placeholder="选择日期"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="入库仓库" label-width="100px" prop="inWarehouseCode">
                <el-select v-model="addForm.inWarehouseCode" class="optionWidth" filterable reserve-keyword placeholder="请选择" @change="changeWarehouse">
                  <div>
                    <template>
                      <span class="add-code">仓库代码</span>
                      <span class="add-name">仓库名称</span>
                    </template>
                  </div>
                  <el-option
                    v-for="item in inWarehouseList"
                    :key="item.value"
                    :label="item.value + '  ' + item.label"
                    :value="item.value">
                    <span class="add-ware-code">{{ item.value }}</span>
                    <span class="add-ware-name">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="品牌" label-width="88px" prop="brandCode">
                <el-select v-model="addForm.brandCode" class="optionWidth" filterable reserve-keyword placeholder="请选择">
                  <div>
                    <template>
                      <span class="add-code">代码</span>
                      <span class="add-name">名称</span>
                    </template>
                  </div>
                  <el-option
                    v-for="item in brandList"
                    :key="item.value"
                    :label="item.value + '  ' + item.label"
                    :value="item.value">
                    <span class="add-show-code">{{ item.value }}</span>
                    <span class="add-brand-name">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="金额计算方式" label-width="105px" prop="amountCalculationModeCode">
                <el-select v-model="addForm.amountCalculationModeCode" class="optionWidth" placeholder="">
                  <div>
                    <template>
                      <span class="add-code">代码</span>
                      <span class="add-name">名称</span>
                    </template>
                  </div>
                  <el-option
                    v-for="item in amountCalculationModeList"
                    :key="item.value"
                    :label="item.value + '  ' + item.label"
                    :value="item.value">
                    <span class="add-show-code">{{ item.value }}</span>
                    <span class="add-show-name">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="发运方式" label-width="100px" prop="transportMethodCode">
                <el-select v-model="addForm.transportMethodCode" class="optionWidth" placeholder="请选择">
                  <div>
                    <template>
                      <span class="add-code">代码</span>
                      <span class="add-name">名称</span>
                    </template>
                  </div>
                  <el-option
                    v-for="item in transportMethodList"
                    :key="item.value"
                    :label="item.value + '  ' + item.label"
                    :value="item.value">
                    <span class="add-show-code">{{ item.value }}</span>
                    <span class="add-show-name">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="供应商" label-width="88px" prop="supplierCode">
                <el-select v-model="addForm.supplierCode" class="optionWidth" filterable reserve-keyword placeholder="请选择">
                  <div>
                    <template>
                      <span class="add-code">代码</span>
                      <span class="supp-name">名称</span>
                    </template>
                  </div>
                  <el-option
                    v-for="item in supplierList"
                    :key="item.value"
                    :label="item.value + '  ' + item.label"
                    :value="item.value">
                    <span class="add-show-code">{{ item.value }}</span>
                    <span class="add-supp-name">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="手工单号" label-width="105px">
                <el-input v-model="addForm.manualBillNo" placeholder="请输入少于40个字符" maxlength="40"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item v-if="addForm.transportMethodCode !== 'D5017'" label="来源单号" label-width="100px">
                <el-input v-model="addForm.sourceBillNo" placeholder="请输入SS开头的销售出货单"/>
              </el-form-item>
            </el-col>
            <!-- 发运方式为货主转移D5017 来源单号变为必传 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item v-if="addForm.transportMethodCode === 'D5017'" label="来源单号" label-width="100px" prop="sourceBillNo">
                <el-input v-model="addForm.sourceBillNo" placeholder="请输入SS开头的销售出货单"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item v-if="addForm.transportMethodCode !== 'D5017'" label="关联公司账套" label-width="88px">
                <el-input v-model="addForm.relationCompanyCode" placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <!-- 发运方式为货主转移D5017 关联公司账套变为必传 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item v-if="addForm.transportMethodCode === 'D5017'" label="关联公司账套" label-width="88px" prop="relationCompanyCode">
                <el-input v-model="addForm.relationCompanyCode" placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="备注" label-width="105px">
                <el-input v-model="addForm.remark" placeholder="请输入少于200个字符" maxlength="200"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6" class="auto-action">
              <!-- 自动分货 -->
              <Dialog ref="dialog" :add-form="addForm" :in-warehouse-list="inWarehouseList" @childFn="dialogFn(arguments)"/>
            </el-col>
          </el-row>
        </el-form>
        <!-- 上传文件组件 -->
        <Upload ref="upload" @childFn="uploadFn(arguments)" @getFile="getFileList"/>
        <!-- 提交按钮组件 -->
        <Submit ref="submit" :add-form="addForm" :auto-delivery-info="autoDeliveryInfo" :rules="rules" :test-form="testForm" :obj-data="objData" :reset-form="resetForm" :get-purchase-code="getPurchaseCode" :file-list="fileList" @sumbitFn="sumbitFn"/>
      </el-col>
    </el-container>
  </div>
</template>
<script>
import moment from 'moment'
import Upload from './upload'
import Submit from './submit'
import Dialog from './dialog'
export default {
  name: 'AddPurchase',
  components: {
    Upload,
    Submit,
    Dialog
  },
  data() {
    return {
      addForm: {
        purchaseType: '', // 单据类型
        purchaseYear: '', // 年份
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
        relationCompanyCode: '', // 关联公司账套
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
      pickerOptions: { // 计算 预计到货日期不能早于开单日期 开单日期即当前日期
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: { // 提交时的表单校验
        purchaseType: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ],
        purchaseYear: [
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
          { required: true, message: '请输入来源单号', trigger: 'change' }
        ],
        relationCompanyCode: [
          { required: true, message: '请输入关联公司账套', trigger: 'change' }
        ]
      },
      autoDeliveryInfo: [], // 存储设置了分货规则的仓库信息
      allocateList: [], // 仓库对应分配渠道信息
      objData: {
        fileId: '', // 上传文件id
        formData: {} // 上传的文件
      },
      fileList: []
    }
  },
  async created() {
    this.getPurchaseType() // 获取单据类型
    this.getPurchaseCode() // 获取采购到货单号
    this.getBrand() // 获取品牌
    this.getSeason() // 获取季节
    this.addForm.buildNoDate = moment(new Date()).format('YYYY-MM-DD') // 获取默认的开单日期
    this.addForm.expectIncomingTime = moment(new Date()).format('YYYY-MM-DD') // 获取默认的开单日期
    this.getSupplier() // 获取供应商
    this.getInwarehouse() // 获取仓库
    this.getTransportMethod() // 获取发运方式
    this.getAmountCalculationMode() // 获取金额计算方式
    this.getPurchaseYear() // 获取未来十年年份
  },
  methods: {
    // 换仓提示
    changeWarehouse() {
      this.$refs.dialog.changeWarehouse()
    },
    // 表单校验
    testForm() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$refs.submit.submitForm()
        } else {
          return false
        }
      })
    },
    // 接收Dialog组件的传值
    dialogFn(data) {
      this.autoDeliveryInfo = data[0]
      this.allocateList = data[1]
    },
    // 接受upload组件的传值
    uploadFn(data) {
      this.objData.fileId = data[0]
      this.objData.formData = data[1]
    },
    getFileList(file) {
      this.fileList = [file]
    },
    // 获取未来十年年份
    getPurchaseYear() {
      var date = new Date()
      var currentYear = date.getFullYear()
      this.addForm.purchaseYear = currentYear
      var json = []
      for (var i = currentYear; i < currentYear + 10; i++) {
        json.push({
          value: i.toString(),
          label: i.toString()
        })
      }
      this.purchaseYearList = json.map(item => {
        return {
          value: item.value,
          label: item.label
        }
      })
    },
    // 获取单据类型List
    async getPurchaseType() {
      const res = await this.$axios('/bff/api/v1/dict/type?typeCode=purchase_bill_type')
      this.purchaseTypeList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },
    // 获取季节List
    async getSeason() {
      const res = await this.$axios('/bff/api/v1/dict/type?typeCode=purchase_season_type')
      this.purchaseSeasonList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },
    // 获取品牌List
    async getBrand() {
      const res = await this.$axios('/bff/api/v1/brands')
      this.brandList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },
    // 获取采购到货单号
    async getPurchaseCode() {
      const res = await this.$axios.get('/bff/api/v1/no/_generate?billType=PUR_RECEIPT')
      this.addForm.purchaseIncomingNo = res.data.data
    },
    // 获取供应商List
    async getSupplier() {
      const res = await this.$axios.get('/bff/api/v1/vend-cust?vendCusts=supplier')
      this.supplierList = res.data.data.map(item => {
        return {
          value: item.vendCustCode,
          label: item.vendCustName
        }
      })
    },
    // 获取入库仓库List
    async getInwarehouse() {
      const res = await this.$axios.get('/bff/api/v1/warehouses')
      this.inWarehouseList = res.data.data.warehouseList.map(item => {
        return {
          value: item.warehouseCode,
          label: item.warehouseName
        }
      })
    },
    // 获取发运方式
    async getTransportMethod() {
      const res = await this.$axios('/bff/api/v1/dict/type?typeCode=transport_method_type')
      this.transportMethodList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },
    // 获取金额计算方式
    async getAmountCalculationMode() {
      const res = await this.$axios('/bff/api/v1/dict/type?typeCode=amount_calculation_mode_type')
      this.amountCalculationModeList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },
    // 重置addForm
    resetForm() {
      this.$refs['addForm'].resetFields()
      this.addForm.sourceBillNo = ''
      this.addForm.manualBillNo = ''
      this.addForm.relationCompanyCode = ''
      this.addForm.remark = ''
    },
    sumbitFn() {
      this.$refs.dialog.clearAutoInfo()
    }
  }
}
</script>
