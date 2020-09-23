<template>
  <div class="order-box">
    <el-container class="add-list">
      <el-col :span="24" class="noFloat">
        <p class="mr"><span class="blue-line">|</span>调拨信息填写</p>
        <el-form ref="form" :model="form" class="searchBox">
          <el-row>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="单号" label-width="70px">
                <el-col :span="1">
                  <span style="color: red;font-size:16px">*</span>
                </el-col>
                <el-col :span="23">
                  <el-input
                    v-model="form.transferNo"
                    :disabled="true"
                    maxlength="30"
                    placeholder="请输入"/>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="8">
              <el-form-item label="手工单号" label-width="70px">
                <el-input
                  v-model="form.manualBillNo"
                  maxlength="40"
                  style="width: 100%;"
                  clearable
                  placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="调拨方式" label-width="70px">
                <el-col :span="1">
                  <span style="color: red;font-size:16px">*</span>
                </el-col>
                <el-col :span="23">
                  <el-select
                    v-model="form.transferModeCode"
                    style="width: 100%;"
                    clearable
                    placeholder="请选择">
                    <el-option
                      v-for="(item, index) in options1"
                      :key="index"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="调拨类型" label-width="70px">
                <el-col :span="1">
                  <span style="color: red;font-size:16px">*</span>
                </el-col>
                <el-col :span="23">
                  <el-select
                    v-model="form.transferTypeCode"
                    clearable
                    style="width: 100%;"
                    placeholder="请选择">
                    <el-option
                      v-for="(item, index) in options2"
                      :key="index"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="调出仓库" label-width="70px">
                <el-col :span="1">
                  <span style="color: red;font-size:16px">*</span>
                </el-col>
                <el-col :span="23">
                  <el-select
                    :loading="loading"
                    :remote-method="remoteSearchOutWarehouse"
                    v-model="form.outExternalWarehouseCode"
                    clearable
                    filterable
                    remote
                    placeholder="请选择"
                    style="width: 100%;"
                    @change="getOutAddress"
                    @clear="clearOutWarehouse">
                    <div style="overflow-y:auto;padding-top:10px;">
                      <template>
                        <span style="margin-left:6%;color: #8492a6;">仓库外码</span>
                        <span style="margin-left:20%;color: #8492a6;">仓库名称</span>
                      </template>
                      <el-option
                        v-for="(item, index) in options3"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        <span style="float: left;font-size: 13px;">{{ item.value2 }}</span>
                        <span style="float: left;padding-left:20px;font-size: 13px;">{{ item.label }}</span>
                      </el-option>
                    </div>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="调入仓库" label-width="70px">
                <el-col :span="1">
                  <span style="color: red;font-size:16px">*</span>
                </el-col>
                <el-col :span="23">
                  <el-select
                    :loading="loading"
                    :remote-method="remoteSearchInWarehouse"
                    v-model="form.inExternalWarehouseCode"
                    clearable
                    filterable
                    remote
                    placeholder="请选择"
                    style="width: 100%;"
                    @change="getInAddress"
                    @clear="clearInWarehouse">
                    <div style="overflow-y:auto;padding-top:5px;">
                      <template>
                        <span style="margin-left:6%;color: #8492a6;">仓库外码</span>
                        <span style="margin-left:20%;color: #8492a6;">仓库名称</span>
                      </template>
                      <el-option
                        v-for="(item, index) in options4"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        <span style="float: left;font-size: 13px;">{{ item.value2 }}</span>
                        <span style="float: left;padding-left:20px;font-size: 13px;">{{ item.label }}</span>
                      </el-option>
                    </div>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="11">
              <el-form-item label="出货地址" label-width="70px">
                <el-input
                  v-model="input2"
                  :disabled="true"/>
              </el-form-item>
            </el-col> -->
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="操作员" label-width="70px">
                <el-input
                  v-model="form.operatorName"
                  :disabled="true"
                  style="width:100%;font-sise:14px;"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="备注" label-width="70px">
                <el-input
                  v-model="form.remark"
                  style="width: 100%;"
                  placeholder="请输入"
                  maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="8" :xl="8" :md="8" :xs="24" :sm="12">
              <el-form-item label="出货地址" label-width="70px">
                <el-input
                  v-model="input2"
                  :disabled="true"
                  style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="8" :md="8" :xs="24" :sm="12">
              <el-form-item label="收货地址" label-width="70px">
                <el-input
                  v-model="input4"
                  :disabled="true"
                  style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12" style="padding-left: 2px;">
              <el-button type="primary" size="mini" @click="uploadModel">下载模板</el-button>
              <el-button type="primary" size="mini" @click="dispatchUpload">批量导入</el-button>
              <autoDel ref="autoDel" :form="form" :options4="options4" @childFn="parentFn"/>
            </el-col>
          </el-row>
          <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal = "false"
            title="调拨明细批量导入"
            width="35%">
            <el-row>
              <el-col :span="8">
                <el-upload
                  ref="uploadExcel"
                  :limit="1"
                  :before-upload="onBeforeUpload"
                  :auto-upload="false"
                  name="file"
                  accept=".xls,.xlsx,.xlsm"
                  class="upload-demo"
                  action= "">
                  <el-button size="mini" icon="el-icon-folder-add" type="primary">选取文件</el-button>
                </el-upload>
              </el-col>
              <el-col :span="16">
                <p>备注:</p>
                <p>1.一次只能上传一个excel文件，仅限格式xlsx、xls、xlsm;</p>
                <p>2.一次性导入不能超过5000行.</p>
              </el-col>
            </el-row>
            <el-row class="upload-text">
              <el-button type="primary" size="mini" @click="uploadData">提 交</el-button>
              <el-button size="mini" @click="cancleUpload">取 消</el-button>
            </el-row>
            <!-- <span slot="footer" class="dialog-footer">
            </span> -->
          </el-dialog>
          <el-row>
            <el-col :span="6">
              <span>总数量：</span>
              <span> {{ totalApplyQty }}</span>
            </el-col>
            <el-col :span="6">
              <span>总金额：</span>
              <span> {{ totalApplyPrice }}</span>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <div v-show="isBatch" class="mr">
        <div><span class="blue-line">|</span><span>货品信息填写</span></div>
      </div>
      <div v-show="isBatch" class="add_result">
        <el-table
          ref="multipleTable"
          :data="tableData"
          :header-cell-style="{background: '#204060', color: 'white'}"
          style="width: 100%"
          height="400"
          border
          @select="getTotal"
          @selection-change="selsChange">
          <el-table-column
            type="selection"
            prop="choose"
            label="选择"
            align="center"
            width=""/>
          <el-table-column
            prop="barCode"
            label="条码"
            align="center"
            width="170">
            <template slot-scope="scope">
              <el-input
                v-if="scope.$index === 0 ? !show : show"
                v-model="barCodeList"
                placeholder="请输入"
                @keyup.native="showInfo"/>
              <span v-else>{{ scope.row.barCode }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialCode"
            label="货号"
            align="center"
            width="180">
            <template slot-scope="scope">
              <el-input
                v-if="scope.$index === 0 ? !show : show"
                v-model="materialCodeList"
                :data-id="scope.$index"
                placeholder="请输入"
                class="itemNumber_input"
                @keyup.native="showBarcode"/>
              <div v-if="showMaterialCodeQueryDialog && !scope.$index" id="materialCodeQueryDialog" class="barCode_box" tabindex="0" style="height:200px;overflow-y:auto">
                <el-table
                  v-if="inventoryList&&inventoryList.length"
                  ref="inventoryTable"
                  :data="inventoryList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="200"
                  @select="handleSelectionChange"
                  @select-all="selectAll">
                  <el-table-column
                    type="selection"
                    width="40"
                    align="center"/>
                  <el-table-column
                    prop="barCode"
                    label="条码"
                    width="120"
                    align="center"/>
                  <el-table-column
                    prop="size"
                    label="尺寸"
                    width=""
                    align="center"/>
                  <el-table-column
                    prop="transferDisplayAvailableQty"
                    label="库存"
                    width=""
                    align="center"/>
                </el-table>
              </div>
              <span v-else>{{ scope.row.materialCode }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            label="尺码"
            align="center"/>
          <el-table-column
            prop="retailPrice"
            label="吊牌价"
            align="center"/>
          <el-table-column
            prop="totalMoney"
            label="金额"
            align="center"/>
          <el-table-column
            prop="productTypeValue"
            label="类别"
            align="center"/>
          <el-table-column
            prop="projectValue"
            label="项目"
            align="center"/>
          <el-table-column
            prop="productSeriesValue"
            label="系列"
            align="center"/>
          <el-table-column
            prop="productPatternKey"
            label="款型"
            align="center"/>
          <el-table-column
            prop="brandName"
            label="品牌"
            align="center"/>
          <el-table-column
            prop="applyQty"
            label="申请数量"
            align="center"
            width="110">
            <template slot-scope="scope">
              <el-input
                v-if="scope.$index === 0 ? show : !show"
                v-model="scope.row.applyQty"
                @blur="applyAmount(scope.row)"/>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="occupied_number"
            label="占库数"
            align="center"/> -->
          <af-table-column
            prop="transferDisplayAvailableQty"
            label="可用库存数"
            align="center"
            width=""/>
        </el-table>
      </div>
      <div v-show="isBatch" class="add-pages">
        <div class="left">
          <el-radio-group v-model="radio">
            <!-- <el-radio :label="1" @change="selectCurrent">当前页全选</el-radio> -->
            <!-- <el-radio :label="2" @change="selectAll">所有页全选</el-radio> -->
            <!-- <el-checkbox :disabled="checkAll" v-model="checkCurrent" @change="selectCurrentPage">当前页全选</el-checkbox>
            <el-checkbox :disabled="checkCurrent" v-model="checkAll" @change="selectAllPage">所有页全选</el-checkbox> -->
          </el-radio-group>
        </div>
        <div class="right">
          <span>共 <span>{{ total }} 条</span></span>
        </div>
      </div>
      <div class="add_actions" style="text-align:center">
        <el-row>
          <el-button v-show="isBatch" :disabled="sels.length === 0" type="primary" size="small" @click="batchClean(sels)">批量清除</el-button>
          <el-button v-show="isBatch" type="primary" size="small" @click="saveDraft">保存草稿</el-button>
          <el-button type="primary" size="small" @click="confirmDocu">确认单据</el-button>
          <!-- <el-button type="primary" size="small">作废单据</el-button> -->
        </el-row>
      </div>
    </el-container>
  </div>
</template>

<script>
import PageCommon from './components/PageCommon/index'
import autoDel from './autoDel'
import { postAxios } from '@/utils/axiosWrap.js'
export default {
  name: 'ScmAdd',
  components: {
    PageCommon,
    autoDel
  },
  data() {
    return {
      show: false,
      input: '', // 备注
      input2: '', // 出货地址
      input3: '', // 操作员
      value: '',
      state: '', // 单号
      options1: [], // 调拨方式
      value1: '',
      options2: [], // 调拨类型
      value2: '',
      options3: [], // 调出仓库
      options4: [], // 调入仓库
      input4: '', // 收货地址
      radio: '',
      tableData: [
        {
          barCode: '', // 条码
          materialCode: '' // 货号
        }
      ],
      inventoryList: [], // 根据货号查询出的库存列表
      selection: [], // 勾选的数据
      totalApplyQty: '', // 货品信息的总数量
      totalApplyPrice: '', // 货品信息的总金额
      form: {
        inWarehouseCode: '', // 调出仓库代码
        operatorCode: '', // 操作员代码
        operatorName: '', // 操作员姓名
        operationType: '', // 单据类型 草稿/非草稿
        outWarehouseCode: '', // 调出仓
        remark: '', // 备注
        transferModeCode: '', // 调拨方式
        transferNo: '', // 单号
        transferTypeCode: '', // 调拨类型
        transferDetailList: [],
        warehouseCode: '', // 仓库内码
        inExternalWarehouseCode: '', // 调入仓库
        outExternalWarehouseCode: '', // 调出仓库
        manualBillNo: '' // 手工单号
      },
      dangqian: {},
      multipleSelection: [],
      barCodeList: '', // 用户输入的条码
      materialCodeList: '', // 用户输入的货号
      sels: [], // 用户勾选的货品
      checkCurrent: false, // 当前页 已弃用
      checkAll: false, // 所有页 已弃用
      checkedBarcode: [],
      multipleTable: [],
      total: 0, // 货品总条数
      barCode: '', // 条码
      inCK: '', // 用户选中的调入仓代码
      outCK: '', // 用户选中的调出仓代码
      // isIndeterminate: true,
      showMaterialCodeQueryDialog: false, // 是否显示货号查询对话框
      loading: false, // 是否加载 默认不加载
      allWarehouseList: [], // 请求的仓库数据
      dialogVisible: false, // 批量导入弹框
      objData: {
        formData: [], // 保存选择的文件
        discount: 0 // 控制刷新次数
      },
      fileId: '', // 用户批量导入后请求接口获取的id
      allocationList: [], // 自动分货信息
      warehouseTypeObj: {
        outhouse: '',
        inhouse: ''
      }, // 记录调入仓库账套与调出仓库账套,inhouse:调入仓库账套，outhouse:调出仓库账套，
      isBatch: true // 是否批量导入
    }
  },
  // watch: {
  //   tableData: {
  //     handler(newVal) {
  //       console.log(newVal, 'newVal')
  //       this.tableData = newVal
  //     },
  //     deep: true
  //   }
  // },
  async created() {
    if (sessionStorage.getItem('urlName') !== '调拨管理-调拨申请单新增页面') {
      window._paq.push(['setDocumentTitle', '调拨管理-调拨申请单新增页面'])
      window._paq.push(['trackPageView'])
      sessionStorage.setItem('urlName', '调拨管理-调拨申请单新增页面')
    }
    this.form.operatorName = this.$store.getters.name // 获取操作员姓名
    this.listToAdd()
    this.listToAdd2()
    this.getAllWarehouse()
    this.getOutWarehouse() // 调出仓库
    this.getInWarehouse() // 调入仓库
    this.getdbType() // 调拨类型
    this.getdbWays() // 调拨方式
    this.registerWindowClickHandler()
  },
  destroyed() {
    this.unregisterWindowClickHandler()
  },
  methods: {
    parentFn(data) {
      this.allocationList = data
    },
    // 下载模板
    async uploadModel() {
      this.$axios({
        method: 'get',
        url: '/bff/api/v1/transfer/download/template',
        responseType: 'blob'
      }).then(res => {
        if (res.data.code) {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '调拨申请单模板.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 上传前触发函数
    onBeforeUpload(file) {
      // 过滤格式不正确的文件
      const str = file.name.split('.')[file.name.split('.').length - 1]
      if (str.indexOf('xlsx') !== -1 || str.indexOf('.xls') !== -1 || str.indexOf('xlsm') !== -1) {
        this.objData.formData.append('uploadFile', file)
        // this.objData.formData.append('fileType', str)
        this.$emit('getFile', file)
        this.discount = 0
        return false
      } else {
        this.$notify({
          title: '错误',
          message: '上传文件格式错误',
          type: 'error',
          duration: 2000
        })
        this.discount = 1
        return
      }
    },
    // 批量导入
    async dispatchUpload() {
      this.dialogVisible = true
    },
    // 提交
    async uploadData() {
      const that = this
      that.objData.formData = new FormData()
      that.$refs['uploadExcel'].submit()
      if (this.discount === 1) {
        this.discount = 0
        return
      }
      // 给formData对象中添加用户当前选择的对应信息
      that.objData.formData.append('needValid', false)
      that.objData.formData.append('fileType', 'TRANSFER_DETAIL_EXCEL')
      // 如果没有文件属性 则报错
      if (!that.objData.formData.get('uploadFile')) {
        this.$notify({
          title: '错误',
          message: '文件不能为空',
          type: 'error',
          duration: 2000
        })
        return
      }
      try {
        // 调用接口,请求数据
        const res = await this.$axios.post('/bff/api/v1/file/upload', that.objData.formData)
        this.fileId = res.data.data
        this.$emit('childFn', this.fileId, that.objData.formData)
        // 不成功提示
        if (res.data.code !== '0') {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        // 重置状态控制变量
        this.discount = 0
        this.$notify({
          title: '成功',
          message: '导入成功',
          type: 'success',
          duration: 2000
        })
        this.isBatch = false
        // 清除表单数据
        that.$refs['uploadExcel'].clearFiles()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '上传文件失败',
          type: 'error',
          duration: 2000
        })
      }
      this.dialogVisible = false
    },
    // 取消
    cancleUpload() {
      this.dialogVisible = false
    },
    async listToAdd() { // 草稿的继续编辑跳转至新增页
      const draftInfo = this.$route.query.info
      this.form.transferNo = draftInfo
      if (!draftInfo) {
        this.getTransfer()
        // return this.form.transferNo
      } else {
        this.form.transferNo = draftInfo
        const res = await this.$axios.get(`/bff/api/v1/transfer/edit/_query?isDraft=true&&transferNo=${draftInfo}`)
        const draftMsg = res.data.data
        console.log(draftMsg, '草稿信息')
        const physicalInfo = draftMsg.physicalInventoryList
        this.total = physicalInfo.length
        this.input2 = draftMsg.inWarehouseAddress
        this.input4 = draftMsg.outWarehouseAddress
        this.inCK = draftMsg.inWarehouseCode
        this.outCK = draftMsg.outWarehouseCode
        this.totalApplyQty = draftMsg.totalApplyQty
        this.totalApplyPrice = draftMsg.totalApplyPrice.toFixed(2)
        this.form = draftMsg
        this.tableData.push(...draftMsg.physicalInventoryList)
        // console.log(this.tableData, '改变了啊')
        this.tableData.map(item => {
          item.totalMoney = item.applyPrice
        })
      }
    },
    async listToAdd2() { // 非草稿的继续编辑跳转至新增页
      const noDraftInfo = this.$route.query.info2
      this.form.transferNo = noDraftInfo
      if (!noDraftInfo) {
        this.getTransfer()
        // return this.form.transferNo
      } else {
        this.form.transferNo = noDraftInfo
        const res = await this.$axios.get(`/bff/api/v1/transfer/edit/_query?isDraft=false&&transferNo=${noDraftInfo}`)
        const noDraftMsg = res.data.data
        // console.log(noDraftMsg, '非草稿信息')
        const physicalInfom = noDraftMsg.physicalInventoryList
        this.total = physicalInfom.length
        this.input2 = noDraftMsg.inWarehouseAddress
        this.input4 = noDraftMsg.outWarehouseAddress
        this.inCK = noDraftMsg.inWarehouseCode
        this.outCK = noDraftMsg.outWarehouseCode
        this.totalApplyQty = noDraftMsg.totalApplyQty
        this.totalApplyPrice = noDraftMsg.totalApplyPrice.toFixed(2)
        this.form = noDraftMsg
        this.tableData.push(...noDraftMsg.physicalInventoryList)
        // console.log(this.tableData, '改变了啊')
        this.tableData.map(item => {
          item.totalMoney = item.applyPrice
        })
      }
    },
    async getTransfer() { // 获取系统生成的调拨单号
      const res = await this.$axios.get('/bff/api/v1/transfer/no/_generate')
      const oddNumber = res.data.data
      this.form.transferNo = oddNumber
    },
    // 输入条码查询
    async showInfo(e) {
      if (e.key === 'Enter') {
        // 校验重复
        if (this.tableData.filter(value => value.barCode === this.barCodeList).length > 0) {
          this.$message({
            showClose: true,
            message: '您已输入过此条码，请重新输入',
            type: 'error',
            duration: 0
          })
          return
        }
        const params = {
          barCodeList: [this.barCodeList],
          // externalWarehouseCodeList: [this.form.outExternalWarehouseCode]
          // 改为传仓库内码
          warehouseCodeList: [this.outCK]
        }
        const res = await this.$axios.post('/bff/api/v1/physical_inventory/_list', params)
        const data = res.data.data.list
        if (res.data && !res.data.data.list.length) {
          return
        }
        // 新搜到的条码放在头部
        this.tableData.splice(1, 0, data[0])
        this.total = this.tableData.length - 1
      }
    },
    // 输入货号查询
    async showBarcode(e) {
      if (e.key === 'Enter') {
        this.index = parseInt(e.target.dataset.id)
        const res = await this.$axios.post('/bff/api/v1/physical_inventory/_list', {
          materialCodeList: [this.materialCodeList],
          // externalWarehouseCodeList: [this.form.outExternalWarehouseCode]
          // 改为传仓库内码
          warehouseCodeList: [this.outCK]
        })
        if (res.data && !res.data.data.list.length) {
          return
        }
        console.log(res, '输入货号查到的数据')
        this.inventoryList = res.data.data.list
        this.showMaterialCodeQueryDialog = true

        this.$nextTick(function() {
          // 迭代查询结果，检查是否已经被选中了
          for (const i of this.inventoryList) {
            // 如果之前被选中了就勾选
            for (const j of this.tableData) {
              if (i.barCode === j.barCode) {
                this.$refs.inventoryTable.toggleRowSelection(i, true)
              }
            }
          }
        })
      }
      if (e && e.keyCode === 27) { // Esc
        this.closeMaterialCodeQueryDialog()
        // this.showMaterialCodeQueryDialog = false
      }
    },
    windowClickHandler(e) {
      if (!this.showMaterialCodeQueryDialog) {
        return false
      }
      let shouldClose = true
      let node = e.target
      while (node.nodeName !== 'BODY') {
        if (node.id === 'materialCodeQueryDialog') {
          shouldClose = false
          break
        }
        node = node.parentNode
      }

      if (shouldClose) {
        this.showMaterialCodeQueryDialog = false
      }
    },
    registerWindowClickHandler() {
      const rootNode = document.getElementById('app')
      if (!rootNode) {
        return
      }
      rootNode.addEventListener('click', e => {
        if (!this.showMaterialCodeQueryDialog) {
          return false
        }
        console.log(e)
      })
      rootNode.addEventListener('click', this.windowClickHandler)
    },
    unregisterWindowClickHandler() {
      const rootNode = document.getElementById('app')
      if (!rootNode) {
        return
      }
      rootNode.removeEventListener('click', this.windowClickHandler)
    },
    closeMaterialCodeQueryDialog() {
      this.showMaterialCodeQueryDialog = false
    },
    // 货号查询手动勾选条码
    handleSelectionChange(selection, row) {
      const isChecked = selection.indexOf(row) >= 0

      if (isChecked) {
        // 如果是勾选库存，把新增库存放到最前面
        this.tableData.splice(1, 0, row)
        this.total = this.tableData.length - 1
      } else {
        // 如果是取消勾选库存，删除库存
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].barCode === row.barCode) {
            this.tableData.splice(i, 1)
          }
        }
        // 取消勾选总条数联动改变
        this.total = this.tableData.length - 1
      }
    },
    // 货号查询条码全选
    selectAll(selection) {
      if (selection.length === 0) {
        // 取消全选
        for (const i of this.inventoryList) {
          for (let j = 0; j < this.tableData.length; j++) {
            if (i.barCode === this.tableData[j].barCode) {
              this.tableData.splice(j, 1)
            }
          }
        }
      } else {
        // 全选
        for (const i of selection) {
          let contains = false
          for (const j of this.tableData) {
            if (i.barCode === j.barCode) {
              contains = true
            }
          }
          if (!contains) {
            this.tableData.splice(1, 0, i)
            this.total = this.tableData.length - 1
          }
        }
      }
    },
    // 申请数量 失焦后计算金额
    applyAmount(row) {
      if (row.applyQty > row.transferDisplayAvailableQty) {
        this.$notify({
          title: '警告',
          message: '输入数量超过最大可用库存数量，请重新输入!',
          type: 'error',
          duration: 3000
        })
        row.applyQty = 0
      } else {
        row.totalMoney = (row.applyQty * row.retailPrice).toFixed(2)
        this.tableData.reverse().reverse() // key值不变的话 vue就地复用原则 tableData也不会改变，只有当key变化 才会刷新你改变的值
      }
    },
    // 勾选后的总数量 总金额 封装函数
    getTotalFunc(sels) {
      var sum = 0
      var sum2 = 0
      if (sels && sels.length > 0) {
        for (var i = 0; i < sels.length; i++) {
          if (sels[i]['totalMoney']) {
            sum += parseInt(sels[i]['totalMoney'])
            if (isNaN(sum)) {
              return
            }
            sum2 += parseInt(sels[i]['applyQty'])
            if (isNaN(sum2)) {
              return
            }
          }
        }
      }
      this.totalApplyPrice = sum.toFixed(2)
      this.totalApplyQty = sum2
    },
    getTotal(selection, row) {
      this.getTotalFunc(selection)
    },
    // 手动勾选表格数据
    selsChange(sels) {
      // this.sels = sels
      // 去重
      this.sels = sels.filter(item => item.inventoryId)
      this.getTotalFunc(this.sels)
    },
    // 当前页全选
    selectCurrentPage(val) {
      // console.log(val, 'val')
      this.checkedBarcode = val ? this.tableData : []
      // console.log(this.checkedBarcode, 'checkedBarcode')
      this.$nextTick(() => {
        if (this.checkedBarcode) {
          for (var i = 0; i < this.checkedBarcode.length; i++) {
            this.$refs.multipleTable.toggleRowSelection(this.checkedBarcode[i], true)
          }
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      })
    },
    // 所有页全选
    selectAllPage(val) {
      console.log(val, 'val2')
    },
    // 批量清除
    batchClean(sels) {
      if (!sels.length) {
        return
      }
      sels = sels.filter(value => value.inventoryId) // 过滤查询项
      this.tableData = this.tableData.filter((value, index) => !sels.filter(selectedValue => value.inventoryId === selectedValue.inventoryId).length)
      // 获取总条数
      this.total = this.tableData.length - 1
    },
    async getAllWarehouse() {
      const res = await this.$axios.get('/bff/api/v1/transfer/wh')
      const data = res.data.data
      this.allWarehouseList = data
    },
    // 调出仓库
    async getOutWarehouse() {
      const res = await this.$axios.get('/bff/api/v1/transfer/wh')
      const outWarehouseTypeList = res.data.data
      outWarehouseTypeList.map(item => {
        // 同步修改仓库内码
        item['value'] = item.warehouseCode
        item['value2'] = item.externalWarehouseCode
        item['label'] = item.warehouseName
      })
      for (var i = 0; i < outWarehouseTypeList.length; i++) {
        this.options3.push({
          value: outWarehouseTypeList[i].value,
          value2: outWarehouseTypeList[i].value2,
          label: outWarehouseTypeList[i].label,
          warehouseAccount: outWarehouseTypeList[i].warehouseAccount,
          address: outWarehouseTypeList[i].addressValue,
          outValue: outWarehouseTypeList[i].warehouseCode
        })
      }
    },
    // 调入仓库
    async getInWarehouse() {
      const res = await this.$axios.get('/bff/api/v1/transfer/wh')
      const inWarehouseTypeList = res.data.data
      inWarehouseTypeList.map(item => {
        // 同步修改仓库内码
        item['value'] = item.warehouseCode
        item['value2'] = item.externalWarehouseCode
        item['label'] = item.warehouseName
      })
      for (var i = 0; i < inWarehouseTypeList.length; i++) {
        this.options4.push({
          value: inWarehouseTypeList[i].value,
          value2: inWarehouseTypeList[i].value2,
          label: inWarehouseTypeList[i].label,
          warehouseAccount: inWarehouseTypeList[i].warehouseAccount,
          address: inWarehouseTypeList[i].addressValue,
          inValue: inWarehouseTypeList[i].warehouseCode
        })
      }
    },
    // 远程搜索调出仓
    remoteSearchOutWarehouse(query) {
      const allWarehouse = this.allWarehouseList
      const remoteWarehouse = allWarehouse.map(item => {
        return {
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode,
          address: item.addressValue,
          warehouseAccount: item.warehouseAccount,
          outValue: item.warehouseCode
        }
      })
      if (query.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options3 = remoteWarehouse.filter(item => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item
            }
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            }
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.value.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            }
          })
        }, 200)
      }
      return this.options3
    },
    // 远程搜索调入仓
    remoteSearchInWarehouse(query) {
      const allWarehouse = this.allWarehouseList
      const remoteWarehouse = allWarehouse.map(item => {
        return {
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode,
          warehouseAccount: item.warehouseAccount,
          address: item.addressValue,
          inValue: item.warehouseCode
        }
      })
      if (query.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options4 = remoteWarehouse.filter(item => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item
            }
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            }
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.value.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            }
          })
        }, 200)
      }
      return this.options4
    },
    // 点击调出仓的清除按钮
    clearOutWarehouse() {
      const allWarehouse = this.allWarehouseList
      const remoteWarehouse = allWarehouse.map(item => {
        return {
          // 同步更改仓库内码
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode
        }
      })
      this.options3 = remoteWarehouse
      this.form.outExternalWarehouseCode = ''
      this.outCK = ''
    },
    // 点击调入仓的清除按钮
    clearInWarehouse() {
      const allWarehouse = this.allWarehouseList
      const remoteWarehouse = allWarehouse.map(item => {
        return {
          // 同步更改仓库内码
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode
        }
      })
      this.options4 = remoteWarehouse
      this.form.inExternalWarehouseCode = ''
      this.inCK = ''
    },
    // 出货地址
    getOutAddress(val) {
      if (val) {
        const res = this.options3.filter(item => item.value === val)[0]
        this.input2 = res.address
        this.outCK = res.outValue
        this.warehouseTypeObj.outhouse = res.warehouseAccount
        console.log(res, 88888)
      } else {
        this.input2 = ''
      }
    },
    // 收货地址
    getInAddress(val) {
      this.$refs.autoDel.changeWarehouse()
      if (val) {
        const res = this.options4.filter(item => item.value === val)[0]
        this.input4 = res.address
        this.warehouseTypeObj.inhouse = res.warehouseAccount
        console.log(res, '改变了')
        this.inCK = res.inValue
      } else {
        this.input4 = ''
      }
    },
    // 保存草稿
    async saveDraft() {
      // const draftTransNo = this.form.transferNo
      let draftIn = this.tableData.filter(value => value.inventoryId)
      if (!draftIn) {
        return
      }
      if (this.warehouseTypeObj.inhouse !== this.warehouseTypeObj.outhouse) {
        this.$alert('调入仓账套与调出仓账套不一致', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })
        return
      }
      draftIn = draftIn.map(item => {
        return {
          productNo: item.barCode,
          retailPrice: item.retailPrice,
          materialCode: item.materialCode,
          applyQty: item.applyQty
        }
      })
      const res = await postAxios('/bff/api/v1/transfer', {
        inWarehouseCode: this.inCK,
        outWarehouseCode: this.outCK,
        operatorCode: this.form.operatorCode,
        operatorName: this.form.operatorName,
        remark: this.form.remark,
        transferModeCode: this.form.transferModeCode,
        transferNo: this.form.transferNo,
        transferTypeCode: this.form.transferTypeCode,
        operationType: 'DRAFT',
        transferDetailList: draftIn,
        manualBillNo: this.form.manualBillNo
      }, {
        timeout: 120000
      })
      // console.log(res.status, 'dddddddd')
      const data2 = res.status
      if (data2 === 200) {
        this.$alert('保存成功', {
          confirmButtonText: '确定',
          type: 'success',
          center: true,
          showClose: false
        }).then(() => {
          this.$router.push({
            path: '/scm/list/'
          })
        })
      } else {
        this.$alert('保存失败，请重试！', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })
      }
      return this.tableData
    },
    // 确认单据
    async confirmDocu() {
      // 校验调入仓与调出仓的账套
      // const docuTransNo = this.form.transferNo
      let docuIn = this.tableData.filter(value => value.inventoryId)
      if (!docuIn) {
        return
      }
      if (this.warehouseTypeObj.inhouse !== this.warehouseTypeObj.outhouse) {
        this.$alert('调入仓账套与调出仓账套不一致', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })
        return
      }
      docuIn = docuIn.map(item => {
        return {
          productNo: item.barCode,
          retailPrice: item.retailPrice,
          materialCode: item.materialCode,
          applyQty: item.applyQty
        }
      })
      const arr = this.allocationList.map(item => {
        return {
          allowShortAllocate: true,
          channelCode: item.theChannelCode,
          percentage: item.thePercentage
        }
      })
      const res = await postAxios('/bff/api/v1/transfer', {
        inWarehouseCode: this.inCK,
        outWarehouseCode: this.outCK,
        operatorCode: this.form.operatorCode,
        operatorName: this.form.operatorName,
        remark: this.form.remark,
        transferModeCode: this.form.transferModeCode,
        transferNo: this.form.transferNo,
        transferTypeCode: this.form.transferTypeCode,
        operationType: 'CONFIRM',
        transferDetailList: docuIn,
        fileId: this.fileId,
        allocationList: arr.filter(item => item.percentage > 0),
        manualBillNo: this.form.manualBillNo
      }, {
        timeout: 120000
      })
      const data2 = res.status
      if (data2 === 200) {
        this.$alert('保存成功', '提交结果', {
          confirmButtonText: '确定',
          type: 'success',
          center: true,
          showClose: false
        }).then(() => {
          this.$router.push({
            path: '/scm/list/'
          })
        })
      } else {
        this.$alert('系统异常，请重新提交！', '提交结果', {
          confirmButtonText: '重新提交',
          cancelButtonText: '关闭',
          center: true
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer', {
            inWarehouseCode: this.form.warehouseCode,
            operatorCode: this.form.operatorCode,
            operatorName: this.form.operatorName,
            outWarehouseCode: this.form.warehouseCode,
            remark: this.form.remark,
            transferModeCode: this.form.transferModeCode,
            transferNo: this.form.transferNo,
            transferTypeCode: this.form.transferTypeCode,
            operationType: 'CONFIRM',
            transferDetailList: docuIn
          })
          console.log(res, 'kule')
        })
      }
    },
    async getdbType() {
      const res = await this.$axios.get('/bff/api/v1/dict/type?typeCode=inventory_transfer_type')
      const transferType = res.data.data
      // console.log(transferType, '调拨类型')
      transferType.map(item => {
        item['value'] = item.dictCode
        item['label'] = item.dictValue
      })
      for (var i = 0; i < transferType.length; i++) {
        this.options2.push({
          value: transferType[i].value,
          label: transferType[i].label
        })
      }
    },
    // 调拨方式
    async getdbWays() {
      const res = await this.$axios.get('/bff/api/v1/transfer/modes')
      const dbWays = res.data.data
      // console.log(dbWays, '调拨方式')
      dbWays.map(item => {
        item['value'] = item.transferModeCode
        item['label'] = item.transferModeName
      })
      for (var i = 0; i < dbWays.length; i++) {
        this.options1.push({
          value: dbWays[i].value,
          label: dbWays[i].label
        })
      }
    }
  }
}
</script>

<style>
  label {
    font-size: 11px !important;
    font-weight: 500;
  }
</style>
<style scoped>
* {
    font-size: 11px;
    font-family: tahoma, arial, 宋体, sans-serif;
  }
  .noFloat{
    float: none !important;
  }
.add-list {
  display: block;
  width:100%;
  padding: 10px 10px
}
.blue-line{
  width: 15px;
  font-weight: 900;
  color: blue;
  display: inline-block;
}
.searchBox {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 15px 0 15px 10px;
  border: 1px solid #efefef;
  border-radius: 4px;
}
.add_result {
  margin-top: 10px;
}
.add-pages {
  overflow: hidden;
}
.add-pages > .left {
  float: left;
  line-height: 40px;
  margin-left: 10px;
}
.add-pages > .right {
  float: right;
  line-height: 40px;
  margin-top: 3px;
  margin-right: 20px;
}
.itemNumber_input {
  position: relative;
}
.barCode_box {
  position: absolute;
  /* left: -5%; */
  /* top: -170px; */
  /* height: 170px; */
  z-index: 99;
  border: none;
  overflow: auto;
  border: 1px solid #eee;
  box-shadow: 2px 2px 10px #999;
  margin-top: 4px;
}
.barCode_box2 {
  position: absolute;
  left: -20%;
  top: -170px;
  height: 170px;
  z-index: 99;
  border: none;
  overflow: auto;
  border: 1px solid #eee;
  box-shadow: 2px 2px 10px #999;
  margin-top: 4px;
}
.barCode_box > .el-table {
  border: none;
}
.upload-text {
  text-align: right;
  margin-top: 30px;
}
</style>

