<template>
  <el-container class="order-box OMSDetailBox OmsOrderDetail">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="box-De">
          <div class="clearfix box-He" >
            <span>订单信息</span>
          </div>
          <!-- 详情组件 -->
          <detail-view :options="OMSOrderDetailOptions" :data="baseText" :width-span="12" class="detailStyle"/>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box-De">
          <div class="clearfix box-He" >
            <span>配送信息</span>
          </div>
          <!-- 详情组件 -->
          <detail-view :options="OMSOrderDetailOptions1" :data="baseText1" :width-span="12" class="detailStyle"/>
        </div>
      </el-col>
      <el-col :span="24" class="colStyle">
        <div class="box-De">
          <div class="clearfix box-He" >
            <span>发货单信息</span>
          </div>
          <!-- 表格组件 -->
          <div class="tbStyle">
            <el-dialog
              :visible.sync="cancelDialogVisible"
              title="提示"
              width="20%">
              <span>您确认要取消么?</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="cancel(nowQueryBillNo)">确 定</el-button>
              </span>
            </el-dialog>
            <table-common v-loading="loading" :table-header="OMSSendDetailtableHeader" :change-cell="[4]" :change-cell-color="'red'" :table-data="tableData" :table-button-width="150" table-button>
              <template slot="btn" slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="$router.push(`/ODS/DeliveryList/DeliveryDetail/${scope.rowData.row.billNo}`)">查看</el-button>
                <el-button v-if="scope.rowData.row.operation && scope.rowData.row.operation.cancelable" type="text" size="mini" class="red-color" @click="Cancelquery(scope.rowData.row.billNo)">取消</el-button>
              </template>
            </table-common>
          </div>
        </div>
      </el-col>
      <el-col :span="24" class="colToStyle">
        <div class="box-De">
          <div class="clearfix box-He" >
            <span>售后单信息</span>
          </div>
          <!-- 表格组件 -->
          <div class="tbToStyle">
            <table-common v-loading="loading" :table-header="OMSSendDetailtableHeader1" :table-data="tableData3" :table-button-width="150" table-button >
              <template slot="btn" slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="$router.push(`/OMS/ReceiveDetail/${scope.rowData.row.returnNo}/${scope.rowData.row.uid}`)">查看</el-button>
              </template>
            </table-common>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box-De">
          <div class="clearfix box-He" >
            <span>支付信息</span>
          </div>
          <!-- 详情组件 -->
          <detail-view :options="OMSOrderDetailOptions2" :data="baseText2" :width-span="12" class="detailStyle"/>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box-De">
          <div class="clearfix box-He" >
            <span>发票信息</span>
          </div>
          <!-- 详情组件 -->
          <detail-view :options="OMSOrderDetailOptions3" :data="baseText3" :width-span="12" class="detailStyle"/>
        </div>
      </el-col>
      <el-col :span="24" class="colStyle">
        <div class="box-De">
          <div class="clearfix box-He" >
            <span>商品详情</span>
            <el-button v-if="showReChangeStore && showReChangeStore.jitxRetrieverAble" class="fr" type="primary" @click="getReChangeMsg">重新占库</el-button>
          </div>
          <el-col :span="24" class="mr10">
            <el-col :span="8" >
              <el-radio-group v-model="form.type" size="mini">
                <el-radio-button label="productCode">货号</el-radio-button>
                <el-radio-button label="barCode" class="ml-2">条码</el-radio-button>
              </el-radio-group>
              <el-input v-model="form.input" class="wh60" placeholder="请输入内容"/>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="form.inadequate" :disabled="arr.indexOf(baseText.orderStatus) !== -1">缺货</el-checkbox>
            </el-col>
            <el-col :span="8">
              <el-button v-preventReClick type="primary" @click="getReSearch(form)">查询</el-button>
              <el-button type="primary" @click="getReset">重置</el-button>
            </el-col>
          </el-col>
          <!-- 表格组件 -->
          <div class="mr10andwh95">
            <!-- 本期隐藏操作项 -->
            <table-common v-loading="loading" :table-header="OMSSendDetailtableHeader2" :table-data="tableData4" :table-button-width="150" table-button>
              <!-- 增加操作按钮 -->
              <template slot="btn" slot-scope="scope">
                <!-- 此处还需要添加一个按钮判断条件, 当正在占库中的时候, 应该有一个字段来控制按钮显示 -->
                <el-button v-show="false" :disabled="true">正在占库中...</el-button>
                <el-button
                  v-if="scope.rowData.row.operations && scope.rowData.row.operations.showAuto"
                  type="text"
                  size="mini"
                  @click="automaticOccupy(scope.rowData.row)">系统自动占库</el-button>
                <el-button
                  v-if="scope.rowData.row.operations && scope.rowData.row.operations.showSpecification"
                  type="text"
                  size="mini"
                  @click="openChannelDialog(scope.rowData.row)">指定渠道占库</el-button>
                  <!-- 修改结束 -->
              </template>
            </table-common>
          </div>
          <!-- 分页器 -->
          <Pagination ref="page" :page-config="pageConfig" @query="query" @loading="load"/>
        </div>
      </el-col>
    </el-row>
    <!-- 增加指定渠道占库弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="指定渠道占库"
      width="50%">
      <div>
        <el-row>
          <el-col :span="8">
            <span class="btpr20">货号 : </span>
            <span>{{ nowRow.productCode || '' }}</span>
          </el-col>
          <el-col :span="8">
            <span class="btpr20">尺码 : </span>
            <span>{{ nowRow.skuSize || '' }}</span>
          </el-col>
          <el-col :span="8">
            <span class="btpr20">SKU条码 : </span>
            <span>{{ nowRow.barcode || '' }}</span>
          </el-col>
        </el-row>
        <el-row class="ptpb20">
          <el-col :span="8">
            <span class="btpr20">预计渠道占库数 : </span>
            <span>{{ (nowRow.operations && nowRow.operations.canOperationQty) ? nowRow.operations.canOperationQty : '' }}</span>
          </el-col>
        </el-row>
        <div class="relative">
          <el-table
            :data="channelData"
            stripe
            class="wh80">
            <el-table-column
              prop="date"
              label="指定渠道">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.date"
                  :remote-method="remoteMethod"
                  :loading="channelLoading"
                  :placeholder="'全部'"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  class="wh100"
                  @change="setVal(scope.row)">
                  <el-option :disabled="true" value="选项0" class="mw500">
                    <span class="spanClass">渠道代码</span>
                    <span class="spanClass1">渠道名称</span>
                    <span class="spanClass2">渠道可用库存</span>
                  </el-option>
                  <el-option
                    v-for="(item, index) in channelFilterList"
                    ref="optionCheck"
                    :key="index"
                    :label="item.channelName"
                    :value="item.channelCode"
                    class="mw500">
                    <el-tooltip :disabled="item.channelCode? item.channelCode.length < 10 : true" :content="item.channelCode" class="item" effect="light" placement="top">
                      <span class="spanClass" >{{ item.channelCode }}</span>
                    </el-tooltip>
                    <el-tooltip :disabled="item.channelName ? item.channelName.length < 10 : true" :content="item.channelName" class="item" effect="light" placement="top">
                      <span class="spanClass1">{{ item.channelName }}</span>
                    </el-tooltip>
                    <el-tooltip :disabled="item.availableQty ? item.availableQty.length < 10 : true" :content="`${item.availableQty}`" class="item" effect="light" placement="top">
                      <span class="spanClass2">{{ item.availableQty }}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="需要渠道占用数"
              width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="请输入内容" @keyup.native="inputNum(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="delChannelRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button v-show="NumShow" type="primary" class="absolute" icon="el-icon-circle-plus-outline" @click="addChannelRow"/>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfim">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 增加指定渠道占库弹窗 -->
    <el-dialog
      :visible.sync="reDialogVisible"
      :before-close="handleClose"
      title="重新占库"
      width="40%">
      <el-row class="pdpb10">
        <el-col :span="10">
          <span class="btpr20">订单号</span>
          <span>{{ reChangeDetail.orderNo || '' }}</span>
        </el-col>
        <el-col :span="8">
          <span class="btpr20">平台单号</span>
          <span>{{ reChangeDetail.platformNo || '' }}</span>
        </el-col>
        <el-col :span="6">
          <span class="btpr20">业务类型</span>
          <span>{{ reChangeDetail.bizTypeName || '' }}</span>
        </el-col>
      </el-row>
      <el-row class="pdpb10">
        <el-col :span="10">
          <span class="btpr20">重占原因</span>
          <el-select v-model="reChangeValue" clearable placeholder="请选择重占原因">
            <el-option
              v-for="item in reChangeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="pdpb10">
        <el-col>
          <span class="btpr20">占库方式</span>
          <el-radio-group v-model="reChangeRadioValue" class="pdlr10">
            <el-radio label="1">系统占库</el-radio>
            <el-radio label="2">指定渠道占库</el-radio>
          </el-radio-group>
          <el-select
            v-if="reChangeRadioValue === '2'"
            v-model="channelExctValue"
            :remote-method="remoteMethodChannel"
            :loading="loading"
            filterable
            remote
            reserve-keyword
            placeholder="请输入渠道名称或代码"
          >
            <el-option :disabled="true" value="选项0" style="width: 400px">
              <el-col :span="10">
                <span class="spanClass4">渠道代码</span>
              </el-col>
              <el-col :span="14">
                <span class="spanClass12">渠道名称</span>
              </el-col>
            </el-option>
            <el-option
              v-for="item in ChannelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <el-col :span="10">
                <span >{{ item.value }}</span>
              </el-col>
              <el-col :span="14">
                <span >{{ item.label }}</span>
              </el-col>
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div style="width: 50%">
        <table-common :table-header="[{label: '商品条码', prop: 'barcode'}, {label: '预计渠道占库数', prop: 'showNuber'}]" :table-data="tableData4"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeStore">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import TableCommon from './table'
import detailView from '@common/DetailView'
import { TableText, detailText, pageConfig } from '@base/module_oms/transaction_order_detail'
import Pagination from '@common/pagination'
import { getOmsDetailMsg, getOmsSearchType, getchannelType, cancelBtn, recapitalization,
  autocapitalization, channelcapitalization, submitChannelcapitalization
} from '@axios/module_oms/transaction_order_detail'

export default {
  name: 'OMSTransactionOrderDetail',
  components: { TableCommon, detailView, Pagination },
  data() {
    return {
      arr: [0, 1, 60, 30, 31, 32, 90], // 可以点击缺货的类型
      pageConfig: pageConfig,
      OMSOrderDetailOptions: detailText.OMSOrderDetailOptions, // 详情选项变量
      OMSOrderDetailOptions1: detailText.OMSOrderDetailOptions1, // 详情选项变量
      OMSOrderDetailOptions2: detailText.OMSOrderDetailOptions2, // 详情选项变量
      OMSOrderDetailOptions3: detailText.OMSOrderDetailOptions3, // 详情选项变量
      baseText: {}, // 详情选项数据源
      baseText1: {}, // 详情选项数据源
      baseText2: {}, // 详情选项数据源
      baseText3: {}, // 详情选项数据源
      loading: false, // 加载动画变量
      OMSSendDetailtableHeader: TableText.OMSSendDetailtableHeader, // 表格选项变量
      OMSSendDetailtableHeader1: TableText.OMSSendDetailtableHeader1, // 表格选项变量
      OMSSendDetailtableHeader2: TableText.OMSSendDetailtableHeader2, // 表格选项变量
      tableData: [{}], // 表格数据源
      tableData3: [], // 表格数据源
      tableData4: [], // 表格数据源
      form: { // 搜索条件变量
        input: '', // 输入值
        inadequate: false, // 缺货
        type: 'productCode' // 类型
      },
      reDialogVisible: false, // 重新占库弹窗
      dialogVisible: false, // 指定渠道弹窗控制变量
      channelData: [{ // 指定渠道table表格变量
        id: 1,
        date: '',
        name: '',
        address: ''
      }],
      channelList: [], // 全部渠道数组
      channelFilterList: [], // 输入过滤渠道数组
      channelLoading: false, // 渠道加载状态
      NumShow: false, // 控制添加渠道加号是否显示
      nowRow: {}, // 指定渠道占库中,当前选择的行信息
      ChannelOptions: [], // 重新占库当前渠道数组
      ChannelAllList: [], // 重新占库渠道所有数组
      reChangeValue: '', //  重新占库原因值
      reChangeoptions: [], // 重新占库原因数组
      reChangeRadioValue: '1', // 占库方式
      reChangeDetail: {}, //  重新占库信息
      channelExctValue: '', // 重新占库渠道值
      cancelDialogVisible: false,
      nowQueryBillNo: '',
      showReChangeStore: {}
    }
  },
  async created() {
    // 提取路由传递参数id, 为查询单号
    const id = this.$route.params.id || ''
    const No = this.$route.params.No
    this.pageConfig.defaultParamter.orderNo = this.$route.params.No
    // 请求单号详细信息
    const res = await getOmsDetailMsg(id, No)
    const lest = res.data.data
    // 订单信息内容
    this.baseText = lest.base
    this.showReChangeStore = lest['operation']
    // 配送信息内容
    this.baseText1 = lest.delivery
    // 配送信息地址拼接
    this.baseText1['provinceAndCity'] = `${lest.delivery.receiverProvince}-${lest.delivery.receiverCity}-${lest.delivery.receiverDistrict}`
    // this.baseText1['detailAdress'] = `${lest.delivery.receiverProvince}.${lest.delivery.receiverCity}.${lest.delivery.receiverDistrict}.${lest.delivery.receiverAddress}`
    // 支付信息内容
    this.baseText2 = lest.payment
    // 发票信息内容
    this.baseText3 = lest.invoice
    // 售后单信息内容
    this.tableData3 = lest.returnOrders
    // 发货信息
    this.tableData = lest.dispatchBills
  },
  beforeDestroy() {
    // 页面的变量后期可整理，组件销毁时，可以将变量释放掉。
  },
  methods: {
    async getReChangeMsg() {
      this.reDialogVisible = true
      this.reChangeDetail = this.baseText
      const res = await getOmsSearchType()
      const lest = res.data.data.retrieverReason
      lest.map(item => {
        item['value'] = item.dicKey
        item['label'] = item.dicValue
      })
      this.reChangeoptions = lest
      this.reChangeValue = lest[0].value || ''
      const channelres = await getchannelType('', ['JIT'])
      const channelList = channelres.data.data
      channelList.map(item => {
        item['value'] = item.channelCode
        item['label'] = item.channelName
        this.ChannelOptions.push(item)
        this.ChannelAllList.push(item)
      })
    },
    Cancelquery(billNo) {
      this.cancelDialogVisible = true
      this.nowQueryBillNo = billNo
    },
    // 增加取消按钮方法
    async cancel(NO) {
      const orderNo = this.$route.params.No
      const id = this.$route.params.id || ''
      const params = {
        orderNo: orderNo,
        dispatchNo: NO
      }
      const res = await cancelBtn(params)
      if (res.data.code === '0') {
        this.$notify({
          title: '成功',
          message: '取消成功',
          type: 'success',
          duration: 2000
        })
      } else if (res.data.code === '1') {
        this.$notify({
          title: '失败',
          message: '取消失败',
          type: 'error',
          duration: 2000
        })
      } else {
        this.$notify({
          title: '成功',
          message: '取消中，请稍后查看取消结果',
          type: 'success',
          duration: 2000
        })
      }
      // 一旦请求完成,需要更新下列表以获得列表数据的最新状态
      // 请求单号详细信息
      const disRes = await getOmsDetailMsg(id, orderNo)
      const lest = disRes.data.data
      // 发货信息
      this.tableData = lest.dispatchBills
      this.cancelDialogVisible = false
    },
    // 增加重新占库方法
    async changeStore() {
      // 确认时, 发送占库信息
      const params = {
        orderNo: this.$route.params.No,
        retrieverReasonCode: this.reChangeValue,
        retrieverReasonValue: this.reChangeoptions.filter(item => item.value === this.reChangeValue)[0]['label']
      }
      if (this.reChangeRadioValue === '2') {
        // 指定渠道占库
        params['channelCode'] = this.channelExctValue
      }
      console.log(params)
      await recapitalization(params)
      this.$notify({
        title: '成功',
        message: '请求成功, 正在占库中....',
        type: 'success',
        duration: 2000
      })
      this.reDialogVisible = false
      // 一旦请求完成,需要更新下列表以获得列表数据的最新状态
      // 请求单号详细信息
      // 提取路由传递参数id, 为查询单号
      const id = this.$route.params.id || ''
      const No = this.$route.params.No
      const res = await getOmsDetailMsg(id, No)
      const lest = res.data.data
      // 订单信息内容
      this.showReChangeStore = lest['operation']
      this.$refs.page.getList(this.SearchBarParams)
    },
    // 增加系统自动占库方法
    async automaticOccupy(row) {
      // 提取对应行单号, 传递后台进行自动占库
      const No = this.$route.params.No
      await autocapitalization(No, row.itemId)
      this.$message.error('请求成功, 正在占库中....')
    },
    // 增加指定渠道占库方法
    async openChannelDialog(row) {
      this.dialogVisible = true
      this.nowRow = row
      if (!this.nowRow.operations.canOperationQty) {
        this.nowRow.operations.canOperationQty = 0
      }
      // 请求当前条码下所有渠道
      const params = {
        barCodeList: [row.barcode],
        bizTypeList: ['JIT'],
        onlyManualChannel: false,
        pageSize: 10,
        pageNum: 1,
        customerCode: '47001257'
      }
      const res = await channelcapitalization(params)
      // 一旦请求完成,需要更新下列表以获得列表数据的最新状态
      this.channelList = res.data.data.list
      this.channelFilterList = res.data.data.list
    },
    // 增加当值为空时, 重置所有选项value
    setVal(row) {
      if (row.date === '') {
        this.channelFilterList = this.channelList
      } else {
        // 先判断当前选中渠道是否与上一个选中渠道重合
        let flag = false
        this.channelData.map(item => {
          if (item.id !== row.id && item.date === row.date) {
            flag = true
          }
        })
        if (flag) {
          row.date = ''
          this.$message({
            showClose: true,
            message: '当前选中渠道已存在！',
            type: 'error',
            duration: 1000
          })
          return
        }
        // 添加当前渠道信息
        const checkChannel = this.channelFilterList.filter(item => item.channelCode === row.date)
        row['changechannel'] = checkChannel.length > 0 ? checkChannel[0] : {}
      }
    },
    // 增加搜索功能方法
    remoteMethod(query) {
      if (query.trim() !== '') {
        this.channelLoading = true
        setTimeout(() => {
          this.channelLoading = false
          // 本地搜索,过滤提取符合条件数组选项,  并加载动画
          this.channelFilterList = this.channelList.filter(item => {
            if (item.channelCode.indexOf(query) > -1 || item.channelName.indexOf(query) > -1) {
              return item
            }
          })
        }, 200)
      } else {
        // 如果清除输入时,显示全部内容
        this.channelFilterList = this.channelList
      }
    },
    remoteMethodChannel(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.ChannelOptions = this.ChannelAllList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1 || item.value.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.ChannelOptions = []
      }
    },
    // 增加提交指定渠道占库方法
    async submitConfim() {
      // 将最后填写完成的channelData数据传递给后台,进行按渠道分配占库
      // 在发送请求之前, 将得到的数据处理过滤掉没有分配但是用户自主添加的数据, 即添加此行,但并未分配占库数(占库数为0),
      const arr = []
      let flag = false
      this.channelData.map(item => {
        if (item.name) {
          flag = true
        }
      })
      if (!flag) {
        this.$notify({
          title: '提示',
          message: '请输入指定渠道/需要渠道占用数',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.channelData.map(item => {
        // 可能输入字符串0, 使用pareInt转换为数字比较
        if (item.name && parseInt(item.name) !== 0 && item.date) {
          // 此循环中可过滤不必要传递参数
          const Obj = {
            channelCode: item.changechannel.channelCode,
            channelAccount: item.changechannel.companyId, // 账套
            amount: item.name
          }
          arr.push(Obj)
        }
      })
      // 转换符合条件的请求参数
      const params = {
        orderNo: this.$route.params.No,
        itemId: this.nowRow.itemId,
        retrieverChannels: arr
      }
      // 如果未分配, 则不请求接口
      if (arr.length === 0) {
        this.$notify({
          title: '提示',
          message: '请输入指定渠道/需要渠道占用数',
          type: 'error',
          duration: 2000
        })
        return
      }
      await submitChannelcapitalization(params)
      // 使用得到的处理过后的数据源作为参数信息
      // 一旦请求完成,需要更新下列表以获得列表数据的最新状态
      this.getReSearch(this.form)
      this.channelData = [{
        id: 1,
        date: '',
        name: '',
        address: ''
      }]
      this.dialogVisible = false
    },
    // 增加输入数量方法
    inputNum(row) {
      // 首先校验用户输入是否规范
      var re = /^[0-9]+$/
      if (!row.date) {
        this.$message({
          showClose: true,
          message: '请先选择分配渠道',
          type: 'error',
          duration: 3000
        })
        row.name = ''
        return
      }
      if (row.name === '') return
      if (!re.test(row.name) || parseInt(row.name) < 0) {
        this.$message({
          showClose: true,
          message: '输入数值异常或输入数量必须是大于0的整数',
          type: 'error',
          duration: 3000
        })
        row.name = ''
        return
      }
      // 校验通过后, 再核对总数量是否大于预计渠道占库数
      let num = 0
      this.channelData.map(item => {
        num += item.name ? parseInt(item.name) : 0
      })
      // 如果等于, 那么这个时候加号应该消失,
      if (num === this.nowRow.operations.canOperationQty) {
        this.NumShow = false
      } else if (num > this.nowRow.operations.canOperationQty) {
        // 如果大于, 则取消当前并退回, 如果小于或等于则校验通过,输入有效
        this.$message({
          showClose: true,
          message: '总计需要占库数需要≤ 预计渠道占库数，请重新分配！',
          type: 'error',
          duration: 1000
        })
        row.name = 0
        // 当输入超过预计占库数时, 重置当前输入并计算分配是否小于预计占库, 如果小于, 则+显示
        let num2 = 0
        this.channelData.map(item => {
          num2 += item.name ? parseInt(item.name) : 0
        })
        if (num2 < this.nowRow.operations.canOperationQty) {
          this.NumShow = true
        }
      } else {
        // 如果小于
        this.NumShow = true
      }
    },
    // 增加删除列表单行方法
    delChannelRow(row) {
      this.channelData = this.channelData.filter(item => item.id !== row.id)
      // 当删除一列时, 计算剩余分配是否小于预计占库, 如果小于, 则+显示
      let num2 = 0
      this.channelData.map(item => {
        num2 += item.name ? parseInt(item.name) : 0
      })
      if (num2 < this.nowRow.operations.canOperationQty) {
        this.NumShow = true
      }
    },
    // 增加新增指定渠道占库行方法
    addChannelRow() {
      if (this.channelData.length > 0 && (!this.channelData[this.channelData.length - 1].name || !this.channelData[this.channelData.length - 1].date)) {
        this.$message({
          showClose: true,
          message: '请先完善已添加渠道信息',
          type: 'error',
          duration: 1000
        })
        return
      }
      // 每次添加行的时候, 重置所有行id, 避免出现多行id相同的问题
      this.channelData.map((item, index) => {
        item.id = index + 1
      })
      const newData = {
        data: '',
        name: '',
        id: this.channelData.length + 1
      }
      this.channelData.push(newData)
    },
    // 增加关闭指定渠道占库弹窗方法
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.channelData = [{
            id: 1,
            date: '',
            name: '',
            address: ''
          }]
          done()
        })
        .catch(_ => {})
    },
    // 获取表格数据
    query(data) {
      console.log(data, 'chuandi')
      data.map(item => {
        item['showNuber'] = parseInt(item.quantity || 0) - parseInt(item.dispatchQty || 0)
      })
      this.tableData4 = data
    },
    // 加载动画
    load(status) {
      this.loading = status
    },
    // 查询
    async getReSearch(form) {
      const params = {
        orderStatus: this.baseText.orderStatus,
        inadequate: this.form.inadequate
      }
      this.form.type === 'productCode' ? (params['productCode'] = this.form.input) : (params['barCode'] = this.form.input)
      this.$refs.page.getList(params)
    },
    // 重置
    getReset() {
      this.form.inadequate = false
      this.form.input = ''
      this.form.type = 'productCode'
    }
  }
}
</script>
<style scoped>
.tbStyle{
  padding: 10px 10px 0 10px;
  width: 100%;
  max-width: 1200px ;
}
.mw500{
  width: 500px;
}
.wh100{
  width: 100%;
}
.fr{
  float: right;
}
.mr10andwh95{
  padding: 10px 10px 0 10px;
  width: 100%;
}
.spanClass{
    display:inline-block;
    width:25%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
 .spanClass1{
    display:inline-block;
    width:45%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
  .spanClass2{
    display:inline-block;
    width:20%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
 .wh80{
   width: 90%;
 }
.wh60{
  width:60%
}
.ml-2{
  margin-left:-2px;
}
.mr10{
  margin:10px
}
.tbToStyle{
  padding: 10px 10px 0 10px;
  width: 100%;
  max-width: 900px;
}
.colToStyle{
  margin: 0 0 10px 0;
  padding: 10px;
}
.colStyle{
  margin: 10px 0;
  padding: 10px;
}
.detailStyle{
  padding: 0 10px
}
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
  .el-divider{
    margin: 12px 0;
  }
  .mr{
    margin: 10px 0;
  }
  .box-De{
    border: 1px solid #C0C4CC;
    box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1);
  }
  .red-color {
    color: red
  }
  .box-He{
    background-color:#304156;
    border-bottom: 1px solid #ccc;
    color: white;
    font-size: 14px;
    padding: 6px
  }
  .absolute{
    position: absolute;
    bottom: 10px;
    right: 10px
  }
  .relative{
    position: relative;
  }
  .btpr20{
    color: black;
    font-size: 16px;
    padding-right: 3px;
  }
  .ptpb20{
    padding: 20px 0;
  }
  .pdpb10 {
    padding: 10px 0;
  }
  .pdlr10 {
    padding: 0 10px;
  }
</style>

