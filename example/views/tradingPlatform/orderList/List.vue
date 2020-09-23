<template>
  <div>
    <el-container class="order-box B2BOrderBox">
      <el-col :span="24" >
        <search-bar
          ref="searchtop"
          :all-oreder-params="true"
          :default-params="SearchBarParams"
          :options="orderListOptions"
          :out-export-options="modelList"
          :out-export-name="modelText"
          :width-px="120"
          @search="searchList"
        >
          <template slot="btn">
            <el-button type="primary" @click="importExcel('DISCOUNT_TEMPLATE')">导入订单(折扣)</el-button>
            <el-button class="p-r" type="text" @click="exportCut">
              <span class="span-model">导出模板(折扣)</span>
            </el-button>
            <el-button class="ml-90" type="primary" @click="importExcel('SALES_AMOUNT_TEMPLATE')">导入订单(结算金额)</el-button>
            <el-button class="p-r" type="text" @click="exportPrice">
              <span class="span-model">导出模板(结算金额)</span>
            </el-button>
          </template>
        </search-bar>
      </el-col>
      <table-common v-loading="loading" :height="150" :table-header="OrderListHeader" :table-button-fixed="`left`" :table-button-width="120" :table-data="tableData" table-button @getSortList="gfetLisdt">
        <template slot="btn" slot-scope="scope">
          <el-button type="text" @click="handleView(scope.rowData.$index, scope.rowData.row)">查看</el-button>
        </template>
      </table-common>
      <page-common
        ref="page"
        :page-size-list="[50, 100]"
        api="/bff/b2b/api/v1/orderList"
        method="post"
        @query="query"
        @loading="load"
      />
      <el-dialog :visible.sync="dialogVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="max-width: 400px; margin:0 auto;">
          <el-form-item label="客户" prop="customerCode">
            <el-select v-model="temp.customerCode" filterable clearable placeholder="请输入客户" style="width: 90%">
              <el-option
                v-for="item in customerList"
                :key="item.value"
                :label="item.value + ' : ' + item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="手工单号" prop="123">
            <el-input v-model="temp.manualBillNo" maxlength="20" placeholder="请输入手工单号" style="width: 90%"/>
          </el-form-item>
          <el-form-item label="仓库" prop="cangku">
            <el-select v-model="temp.cangku" filterable clearable placeholder="请输入仓库代码或名称" style="width: 90%">
              <el-option
                v-for="item in warehouseList"
                :key="item.value"
                :label="item.value + ' : ' + item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label=" " class="el-item-billtype" prop="billType">
            <el-radio-group v-model="temp.billType">
              <el-radio label="FUTURE">期货</el-radio>
              <el-radio label="SPECIAL">特价</el-radio>
              <el-radio label="SPOT">现货</el-radio>
              <el-radio label="OTHER" style="width:38%">
                其他
                <el-select v-model="temp.billType1" placeholder="请选择" style="width:74%">
                  <el-option
                    v-for="item in resurceoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    style="margin-right:10px"/>
                </el-select>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-upload
            ref="uploadx"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            class="upload-demo"
            name="file"
            list-type="text"
            accept=".xls,.xlsx,.xlsm"
            action="aa"
            multiple>
            <el-button size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">一次只能上传一个excel文件，仅限格式xlsx、xls、xlsm，单个文件不超过10MB</div>
          </el-upload>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button :disabled="isDisable" type="primary" @click="createData()">确定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar/index'
import PageCommon from '@/components/PageCommon'
import TableCommon from '@/components/TableCommon'
import TableText from '@/textResources/tableText'
import searchBarOptions from '@/textResources/searchBarOptions'
import DialogButton from '@/components/DialogButton'
import moment from 'moment'
import { get } from '@/utils/request'
// 权限菜单请求接口
const getRole = () => get('/bff/b2b/api/v2/auth/createOrder')

export default{
  name: 'OrderList',
  components: {
    SearchBar, // 搜索组件
    PageCommon, // 分页组件
    TableCommon, // 表格组件
    DialogButton
  },
  data: function() {
    return {
      modelList: ['*货号', '*尺码', '*数量', '*折扣'],
      modelText: '订单模板(折扣).xlsx',
      DialogOptions: [
        {
          type: 'upload', // 相较搜索框, 新增的类型, 该类型定义文件上传功能控件
          uploadType: 'picview', // 定义文件上传的显示类型, file为文件上传, picview为图片上传(带二次弹窗查看图片)
          name: 'fileList', // 定义文件接收的文件名
          label: '123213',
          span: 20 // 定义当前控件占据整个弹窗一行的宽度,  同栅格布局, 默认20
        },
        {
          type: 'upload', // 相较搜索框, 新增的类型, 该类型定义文件上传功能控件
          uploadType: 'file', // 定义文件上传的显示类型, file为文件上传, picview为图片上传(带二次弹窗查看图片)
          name: 'fileFiw', // 定义文件接收的文件名
          label: '123213',
          span: 20 // 定义当前控件占据整个弹窗一行的宽度,  同栅格布局, 默认20
        },
        {
          type: 'text', // 新增text类型, 对应文本类型
          name: 'text',
          label: '单号',
          span: 8
        },
        {
          type: 'text', // 新增text类型, 对应文本类型
          name: 'text',
          label: '业务类型',
          span: 8
        },
        {
          type: 'text', // 新增text类型, 对应文本类型
          name: 'text',
          label: '平台单号',
          span: 8
        }
      ],
      showThisDialog: false,
      isDisable: false, // 控制弹窗创建订单是否可点击
      resurceoptions: [ // 弹窗其他类型下子类型
        {
          value: 'CLAIM_COMPENSATE',
          label: '索赔'
        },
        {
          value: 'TRANSFER_REPOSITORY',
          label: '转仓'
        },
        {
          value: 'CHARGE_ACCOUNT',
          label: '走账'
        },
        {
          value: 'TRANSFER_PRODUCT',
          label: '货品中转'
        },
        {
          value: 'OTHER',
          label: '其他'
        }
      ],
      str: '', // 选择导入模板类型
      moment: moment, // 第三方插件改变时间格式
      loading: false, // 加载状态动画变量
      OrderListHeader: TableText.OrderListHeader, // 表格头
      orderListOptions: searchBarOptions.orderListOptions, // 搜索项内容
      getFlag: false, // 控制无结果时显示的提示变量
      temp: { // 弹窗整体变量
        id: undefined,
        customerCode: undefined, // 用户代码
        attachName: undefined,
        cangku: '', // 仓库
        file: undefined,
        bizType: undefined,
        manualBillNo: undefined, // 手工单号
        billType: undefined, // 订单类型
        billType1: undefined // 其他类型下子类型
      },
      rules: { // 表格校验变量
        customerCode: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        cangku: [{ required: true, message: '仓库不能为空', trigger: 'change' }],
        billType: [{ required: true, message: '客户不能为空', trigger: 'change' }]
      },
      step: '', // 无用变量
      dialogVisible: false, // 控制弹窗显示变量
      tableData: [], // 表格数据变量
      orderStatus: { // 订单状态变量
        WAIT_OCCUPY_INVENTORY: '待占库',
        OCCUPYING_INVENTORY: '占库中',
        OCCUPYING_INVENTORY_FAILED: '占库失败',
        OCCUPYING_INVENTORY_FINISH: '占库完成',
        DISPATCH_CONFIRMATION: '发货单确认中',
        DISPATCH_CONFIRMED: '发货中',
        AGREE_APPROVAL: '审批通过',
        DOING_APPROVAL: '审批中',
        REFUSE_APPROVAL: '审批不通过',
        WAITING_FOR_PAYMENT: '待付款',
        COLLECTION_CONFIRMATION: '审批通过',
        PAID: '已付款',
        ORDER_CONFIRMATION: '订单确认中',
        ORDER_CONFIRMED: '订单已确认',
        IN_DELIVERY: '发货中',
        SHIPPED: '已发货',
        CANCELLED: '订单已取消',
        CANCELING: '订单取消中',
        PARTIAL_DELIVERY: '部分发货'
      },
      formData: [], // 保存弹窗内选择内容
      discount: 0, // 控制刷新次数
      customerList: [], // 用户列表变量
      SearchBarParams: { // 初始化搜索参数
      },
      orderByList: [], // 保存排序数据变量
      optionsCopy: [], // 仓库保存list
      warehouseList: [] // 仓库list
    }
  },
  async created() {
    // 发送统计请求
    // 请求客商信息
    const res = await this.$api.getCustormer('')
    // 改变客商信息数据格式以适应下拉框
    res.data.data.map(item => {
      item['label'] = item.shortNameValue
      item['value'] = item.customerCode
    })
    this.customerList = res.data.data
    // 获取全部仓库信息
    const res3 = await this.$api.getwarehouse('')
    const warehouseList = res3.data.data.warehouseList
    // 修改仓库数据格式以适应下拉框
    warehouseList.map(item => {
      item['label'] = item.warehouseName
      item['value'] = item.warehouseCode
    })
    this.optionsCopy = warehouseList
    this.warehouseList = warehouseList
    // 根据后端返回动态添加搜索框下拉条件选项
    // const resObj = await this.$api.getSearchTypeObj()
    // const OrderStatusList = resObj.data.data.orderStatus
    // if (OrderStatusList.length) {
    //   OrderStatusList.map(item => {
    //     item['label'] = item.value
    //     item['value'] = item.code
    //   })
    // }
    // const orderTypeList = resObj.data.data.orderType
    // if (orderTypeList.length) {
    //   orderTypeList.map(item => {
    //     item['label'] = item.value
    //     item['value'] = item.code
    //   })
    // }
    // console.log(orderTypeList, OrderStatusList)
    // this.orderListOptions[2].options = orderTypeList
    // this.orderListOptions[3].options = OrderStatusList
  },
  mounted() {
  },
  methods: {
    exportCut() {
      this.modelList = ['*货号', '*尺码', '*数量', '*折扣']
      this.modelText = '订单模板(折扣).xlsx'
      this.$refs.searchtop.outExport()
    },
    exportPrice() {
      this.modelList = ['*货号', '*尺码', '*数量', '*含税结算金额']
      this.modelText = '订单模板(结算金额).xlsx'
      console.log(this.modelText)
      this.$refs.searchtop.outExport()
    },
    async tanchuang(msg, row) {
      const res = await this.$api.createReturnOrder(msg)
      console.log(res)
      this.showThisDialog = false
    },
    // 排序方法函数
    gfetLisdt(column) {
      if (column.order) {
        // 获取并判断处理当前点击排序列名及选择的排序方式
        const data = {
          orderByList: [{
            columnName: column.prop === 'createDate' ? 'createTime' : 'lastUpdateTime',
            order: column.order === 'descending' ? 'DESC' : 'ASC'
          }]
        }
        // 发送请求, 返回排序后表格数据
        this.orderByList = data.orderByList
        this.$refs.page.getList(data)
      }
    },
    // 搜索函数
    searchList(params) {
      // 如果选择了时间段, 处理拆份时间格式,
      // 标注: 此处逻辑可以精简修正,
      for (var k in params) {
        if (k === 'createTime') {
          if (params[k]) {
            params.startDate = moment(params[k][0]).format('YYYY/MM/DD')
            params.endDate = moment(params[k][1]).format('YYYY/MM/DD')
          }
          delete params[k]
        }
      }
      // 改变时间格式
      if (params.endDate) {
        params.endDate = params.endDate + ' 23:59:59'
      }
      // 改变时间格式
      if (params.startDate) {
        params.startDate = params.startDate + ' 00:00:00'
      }
      // 如果有排序规则, 则传递
      if (this.orderByList) {
        params['orderByList'] = this.orderByList
      }
      this.getFlag = true
      this.$refs.page.getList(params)
    },
    // 搜索查询返回结果data函数
    query(data) {
      data.map((item) => {
        item.createDate = item.createDate.substring(0, 11)
      })
      this.tableData = data
    },
    // 加载表格数据渲染动画函数
    load(status) {
      this.loading = status
    },
    // 处理订单异常状态
    OrderStatusReplace(row, column) {
      return this.orderStatus[row.orderStatus] || '订单状态异常'
    },
    // 处理表格数据
    formatter(row, column) {
      return row.address
    },
    // 跳转详情页查看相应订单详情
    handleView(index, row) {
      this.$router.push(`/TradingPlatform/List/ListDetail/${row.orderNo}`)
    },
    // 关闭弹窗
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 获取详情信息
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 移除文件前触发函数
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 创建订单函数
    createData() {
      const that = this
      that.formData = new FormData()
      that.$refs['uploadx'].submit()
      if (this.discount === 1) {
        this.discount = 0
        return
      }
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          // 给formData对象中添加用户当前选择的对应信息
          that.formData.append('customerCode', this.temp.customerCode)
          that.formData.append('manualNo', this.temp.manualBillNo || '')
          that.formData.append('templateModel', this.str || '')
          that.formData.append('userCode', this.$store.getters.code)
          that.formData.append('bwWarehouseCode', this.temp.cangku)
          that.formData.append('bwWarehouseName ', this.warehouseList.filter(e => e.value === this.temp.cangku)[0].label || '')
          // that.formData.append('billType', this.temp.billType)
          // 判断是否选择的是其他类型订单
          // 标注: 可替换成二元判断式, 减少5行代码,  此处修改暂留到整改计划当中
          if (this.temp.billType === 'OTHER') {
            that.formData.append('billType', this.temp.billType1)
          } else {
            that.formData.append('billType', this.temp.billType)
          }
          // 如果没有文件属性 或者文件属性大于10M, 则报错
          // 标注: 此处可合并判断式, 此处修改暂留到整改计划当中
          if (!that.formData.get('file')) {
            this.$notify({
              title: '错误',
              message: '文件不能为空',
              type: 'error',
              duration: 2000
            })
            return
          }
          if (that.formData.get('file').size / 1024 / 1024 >= 10) {
            this.$notify({
              title: '错误',
              message: '上传文件大小不能超过 10MB!',
              type: 'error',
              duration: 2000
            })
            return
          }
          // 此处防重复点击保护可替换成指令方法
          // 标注: 此处修改可减去定时器,  此修改方案暂留到整改计划当中
          this.isDisable = true
          setTimeout(() => {
            that.isDisable = false
          }, 1000)
          await getRole()
          try {
            // 调用接口,请求数据
            console.log(this.temp, 'asdfkaj')
            const res = await this.$api.createOrder(that.formData)
            // 此判断可在拦截器中统一处理
            // 标注: 此修改暂留到整改计划中
            if (res.data.code === '4011005') {
              this.$notify({
                title: '错误',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
              this.$router.push('/login')
              return
            }
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
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '导入成功',
              type: 'success',
              duration: 2000
            })
            // 刷新列表
            this.$nextTick(() => {
              this.$refs.page.getList(this.params)
            })
            // 清除表单数据
            that.$refs['uploadx'].clearFiles()
          } catch (e) {
            this.$notify({
              title: '错误',
              message: e.response.data.msg || '导入文件失败,请稍后重试',
              type: 'error',
              duration: 2000
            })
          }
        }
      })
    },
    // 上传前触发函数
    beforeUpload(file) {
      // 过滤格式不正确的文件
      const str = file.name.substring(file.name.length, file.name.length - 5)
      if (str.indexOf('xlsx') !== -1 || str.indexOf('.xls') !== -1 || str.indexOf('xlsm') !== -1) {
        this.formData.append('file', file)
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
    // 导入订单函数
    importExcel(str) {
      this.str = str
      this.dialogVisible = true
    }
  }
}
</script>
<style scoped>
  .order-box {
    display: block;
    width:100%;
    padding: 15px 40px;
  }
  .blue-line{
    width: 15px;
    font-weight: 900;
    color: blue;
    display: inline-block;
  }
  .ml-90 {
    margin-left:90px;
  }
  .p-r {
    position: relative;
  }
  .el-divider{
    margin: 12px 0;
  }
  .mr{
    margin: 10px 0;
  }
  .dingwei {
    position:absolute;
    top:7px;
    left:-10px;
    color:red
  }
  .span-model {
    position: absolute;
    bottom: 0;
    left:-10px;
    text-decoration: underline;
    color:#409EFF;
  }
</style>
<style>
.el-item-billtype label.el-form-item__label {
      width: 20px !important;
  }
  .el-item-billtype div.el-form-item__content {
    margin-left: 20px !important;
    width:130%
  }
</style>
