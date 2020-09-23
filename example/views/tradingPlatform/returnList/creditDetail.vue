<template>
  <el-container class="order-box creditDetail">
    <detail-view :options="returnListDetailOptions" :data="baseText"/>
    <el-divider />
    <el-col :span="24">
      <el-form ref="form" :model="form" label-width="80px" label-position="left">
        <el-col :span="4">
          <el-form-item label="订单号" style="width: 100%;">
            <el-input v-model="form.orderNo" placeholder="请输入订单号" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="货号" style="width: 100%;">
            <el-input v-model="form.code" placeholder="请输入货号" />
          </el-form-item>
        </el-col>
      </el-form>
      <el-col v-if="isHide" :span="15" :offset="1">
        <el-button v-preventReClick type="primary" icon="el-icon-search" @click="searchProduct">查询</el-button>
        <el-button v-preventReClick type="primary" @click="Export($route.params.id)">导出</el-button>
        <el-button v-preventReClick v-if="Nostatus === '10'" type="primary" @click="submitApprovalVa = true">提交审批</el-button>
        <el-button :disabled="Nostatus === '10' || Nostatus === '15'" type="primary" @click="viewAproo">查看审批文件</el-button>
        <el-button v-preventReClick v-if="Nostatus === '20' || (Nostatus === '10' && baseText.retType === '现货正常' ) || (Nostatus === '10' && baseText.retType === '现货品质')" type="primary" @click="submitReceiveOrder = true">提交退货单</el-button>
        <!-- <el-button type="primary" @click="tijiaotuihuodan = true">提交退货单</el-button> -->
        <el-button v-preventReClick v-if="Nostatus === '25'" :disabled="ready" type="primary" @click="serviceApprove">确认退货单</el-button>
        <!-- <el-button type="primary" @click="serviceApprove">确认退货单</el-button> -->
        <el-button v-preventReClick v-if="Nostatus === '25'" :disabled="ready" type="primary" @click="refuseReceiveOrder = true">拒绝退货单</el-button>
        <!-- <el-button type="primary" @click="jujuetuihuodan = true">拒绝退货单</el-button> -->
        <el-button v-preventReClick v-if="(Nostatus !== '50' && Nostatus !== '900' && Nostatus !== '999')" type="primary" @click="cancelReceiveOrder = true">取消退货单</el-button>
        <el-button v-if="Nostatus === '50' " type="primary" @click="$router.push(`/ODS/ReceiveList/ReceiveDetail/${baseText.collectOrderNo}`)">查看收货单</el-button>
      </el-col>
    </el-col>
    <table-common :table-header="returnDetailtableHeader" :table-data="tableData" :height="315"/>
    <page-common
      ref="page"
      :page-size-list="[50, 100]"
      :default-parameters="params1"
      api="/bff/b2b/api/v1/ret_order_detail/_list"
      method="post"
      @query="query"
      @loading="load"/>
    <el-dialog
      :visible.sync="submitApprovalVa"
      title="提交审核"
      width="50%">
      <div style="backgroundColor:white;overflow: auto; text-align:center">
        <submit-approval :key="menuKey" :current-infomation="currentInfomation" @changeVa="changeVa2"/>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="viewApprovalDialog"
      title="审批信息"
      width="50%">
      <div>
        <table-common :table-header="HeaderTest" :table-data="viewTableData"/>
        <h3 style="margin: 20px 0">文件信息</h3>
        <p v-for="(item, index) in URLList" :key="index" style="margin: 20px 0">
          <a :href="item.attachmentUrl" style="text-decoration:none" target="_blank">{{ item.attachmentName }}</a>
        </p>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="submitReceiveOrder"
      title="退货单方式"
      width="40%">
      <el-form>
        <el-form-item label="账务类别">
          <el-select v-model="accountingCategoryKey" placeholder="请选择" label="送货方式">
            <el-option
              v-for="item in selectOptions.accountingCategory"
              :key="item.value"
              :label="`${item.value}: ${item.name}`"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="金额计算方式">
          <el-select v-model="priceCalculateModeKet" placeholder="请选择" label="金额计算方式">
            <el-option
              v-for="item in selectOptions.amtcalcMode"
              :key="item.value"
              :label="`${item.name}`"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发运方式">
          <el-select v-model="transportMethodCodeKey" placeholder="请选择" label="发运方式">
            <el-option
              v-for="item in selectOptions.transportMethodCode"
              :key="item.value"
              :label="`${item.value}: ${item.name}`"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="submitReceive">确 定</el-button>
        <el-button type="primary" @click="submitReceiveOrder = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="refuseReceiveOrder"
      title="拒绝退货单理由"
      width="40%">
      <el-input
        v-model="remark"
        type="textarea"
        autosize
        placeholder="请输入拒绝理由内容"/>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="serviceRefuse">确 定</el-button>
        <el-button type="primary" @click="refuseReceiveOrder = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="cancelReceiveOrder"
      title="温馨提示"
      width="40%">
      <span>您确定要取消退货单么?</span>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="DelOrder">确 定</el-button>
        <el-button type="primary" @click="cancelReceiveOrder = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import PageCommon from '@/components/PageCommon'
import TableCommon from '../components/TableCommon'
import TableText from '@/textResources/tableText'
import SubmitApproval from './submitApproval'
import detailText from '@/textResources/detail'
import detailView from '@/components/detailView'

export default {
  name: 'CreditDetail',
  components: {
    PageCommon, // 分页组件
    TableCommon, // 表格组件
    SubmitApproval, // 审批组件
    detailView // 详情组件
  },
  data() {
    return {
      isHide: true, // 隐藏按钮变量
      getFlag: false, // 控制无结果时显示提示文字变量
      ready: false, // 控制按钮随状态显示隐藏变量
      params1: { // 初始化搜索变量
        retOrderNo: this.$route.params.id // 路由传参变量
      },
      Nostatus: '未知', // 判断按钮显示状态变量
      menuKey: 1, // 控制审批组件更新变量
      cancelReceiveOrder: false, // 取消退货单弹窗变量
      remark: '', // 备注
      refuseReceiveOrder: false, // 拒绝收货单变量
      viewApprovalDialog: false, // 查看审批信息弹窗
      submitReceiveOrder: false, // 退货单方式弹窗
      viewTableData: [], // 审批信息表格数据
      HeaderTest: [ // 审批信息表格表头
        { label: '审批单号', prop: 'approvalNo' },
        { label: '单据类型', prop: 'billType' },
        { label: '单据状态', prop: 'approvalResults' }
      ],
      URLList: [], // 链接地址数据
      returnListDetailOptions: detailText.returnListDetailOptions, // 退货单明细详情数据
      returnDetailtableHeader: TableText.returnDetailtableHeader, // 退货单商品表头信息
      submitApprovalVa: false, // 审批弹窗
      baseText: {}, // 详情信息数据源
      tableData: [], // 商品信息表格数据源
      currentInfomation: {}, // 当前基本信息
      form: { // 搜索项数据集合
        code: '',
        orderNo: ''
      },
      selectOptions: '', // 字典数据
      accountingCategoryKey: '', // 账务信息
      priceCalculateModeKet: '', // 金额计算方式
      transportMethodCodeKey: '', // 发运方式
      rootList: []
    }
  },
  // 初始化加载页面
  async created() {
    this.onRush()
  },
  methods: {
    // 提价退货单
    async submitReceive() {
      // 判断账务/金额计算方式/发运方式都选择, 否则结束逻辑
      if (this.accountingCategoryKey === '' || this.priceCalculateModeKet === '' || this.transportMethodCodeKey === '') {
        this.$notify({
          title: '提示',
          message: '所有方式都选择之后才能确认提交',
          duration: 2000
        })
        return
      }
      try {
        // 处理请求参数
        const params = {
          retOrderNo: this.$route.params.id,
          accountingCategoryKey: this.accountingCategoryKey,
          accountingCategoryValue: this.selectOptions.accountingCategory.filter(item => item.value === this.accountingCategoryKey)[0].name,
          priceCalculateModeKet: this.priceCalculateModeKet,
          priceCalculateModeValue: this.selectOptions.amtcalcMode.filter(item => item.value === this.priceCalculateModeKet)[0].name,
          transportMethodCodeKey: this.transportMethodCodeKey,
          transportMethodCodeValue: this.selectOptions.transportMethodCode.filter(item => item.value === this.transportMethodCodeKey)[0].name

        }
        // 发送请求并处理返回异常
        const res = await this.$api.submitReturnOrder(params) // tuihuo fangfa
        console.log(res)
        if (res.data.code !== '0') {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
        // 关闭弹窗刷新页面信息
        this.submitReceiveOrder = false
        this.onRush() // shuaxin
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '网络异常,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 点击查看审批按钮触发事件
    async viewAproo() {
      this.viewApprovalDialog = true
      // 获取审批信息
      const res = await this.$api.getApprovaView(this.$route.params.id)
      this.viewTableData = res.data.data.approvalInformation
      // 获取审批内容
      const res1 = await this.$api.getApproCailiao('APPROVAL_ANNEX,APPROVAL_IMAGE', this.$route.params.id)
      console.log(res1)
      this.URLList = res1.data.data
    },
    // 暂时无触发
    async getApproval() {
      let flag = false
      this.menuKey = 2
      const arr = this.tableData.filter(item => item.discount !== 1 && item.discount !== 0 && item.discount !== '')
      if (arr.length > 0) {
        flag = true
      }
      if (flag) {
        this.submitApprovalVa = true
        // this.$router.push(`/TradingPlatform/List/ListDetail/Approval/${this.$route.params.id}`)
      } else {
        this.$notify({
          title: '提示',
          message: '所有商品折扣都必须填写或订单无商品',
          duration: 2000
        })
      }
    },
    // 根据值改变审批弹窗信息状态
    changeVa2(va, index) {
      this.submitApprovalVa = va
      if (this.menuKey === 1) {
        this.menuKey = 2
      } else {
        this.menuKey = 1
      }
      this.onRush()
      if (index === 1) return
    },
    // table数据源
    query(data) {
      // 如果状态为50 改变table数据源部分数据格式
      if (this.Nostatus === '50') {
        data.map((item) => {
          for (var k in item) {
            if (k === 'retailPrice' || k === 'discount' || k === 'balanceAmount') {
              item[k] = item[k].toFixed(4)
            }
            if (k === 'planRetAmount' || k === 'receiveAmount') {
              item[k] = item[k].toFixed(2)
            }
          }
        })
      } else {
        // 如果不状态为50 改变table数据源部分数据格式
        data.map((item) => {
          for (var k in item) {
            if (k === 'retailPrice' || k === 'discount' || k === 'balanceAmount') {
              item[k] = item[k].toFixed(4)
            }
            if (k === 'planRetAmount') {
              item[k] = item[k].toFixed(2)
            }
            if (k === 'receiveAmount' || k === 'receiveQty') {
              item[k] = ''
            }
          }
        })
      }
      this.tableData = data
    },
    // 加载动画函数
    load(status) {
      this.loading = status
    },
    // 查询函数
    searchProduct() {
      // 处理请求参数
      const params = {
        orderNo: this.form.orderNo,
        productCode: this.form.code
      }
      // 判断商品代码是否存在并移除空属性, 存在则转换为数组
      if (params.productCode === '') {
        delete params.productCode
      } else {
        params.productCode = params.productCode.split(',')
      }
      this.$nextTick(() => {
        this.getFlag = true
        this.$refs.page.getList(params)
      })
    },
    // 导出函数
    Export(id) {
      this.$axios({
        method: 'post',
        url: '/b2b_order/api/v1/ret_order/_export',
        data: { retOrderNo: id, pageSize: 0 },
        responseType: 'blob'
      }).then(res => {
        // 处理非文件流形式异常
        if (res.data.code) {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        const blob = new Blob([res.data], { type: 'text/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        // const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(res.data)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '占库结果导出数据表.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 拒绝退货单函数
    async serviceRefuse() {
      // 处理请求参数
      const params = {
        retOrderNo: this.$route.params.id,
        result: '2',
        remark: this.remark
      }
      // 如果无备注,结束逻辑并提示
      if (params.remark === '') {
        this.$notify({
          title: '提示',
          message: '请填写拒绝理由',
          duration: 2000
        })
        return
      }
      try {
        // 此处可优化, 暂留整改计划整改
        this.ready = true
        const that = this
        setTimeout(() => {
          that.ready = false
        }, 2000)
        // 发送拒绝退货单请求,并处理异常
        const res = await this.$api.confirmReturnOrder(params) // jujuefahuodan
        if (res.data.code !== '0') {
          this.$notify({
            title: '提示',
            message: res.data.msg,
            duration: 2000
          })
          return
        }
        this.$notify({
          title: '成功',
          message: '拒绝成功',
          type: 'success',
          duration: 2000
        })
        this.refuseReceiveOrder = false
        this.onRush()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '拒绝失败,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 确认退货单函数
    async serviceApprove() {
      // 处理请求参数
      const params = {
        retOrderNo: this.$route.params.id,
        result: '1'
      }
      try {
        // 此处可替换定时器,暂留到整改计划整改
        this.ready = true
        const that = this
        setTimeout(() => {
          that.ready = false
        }, 2000)
        // 发送确认退货单请求并处理异常
        const res = await this.$api.confirmReturnOrder(params)
        if (res.data.code !== '0') {
          this.$notify({
            title: '提示',
            message: res.data.msg,
            duration: 2000
          })
          return
        }
        this.$notify({
          title: '成功',
          message: '确认成功',
          type: 'success',
          duration: 2000
        })
        this.onRush()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '确认失败,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 取消退货单
    async DelOrder() {
      try {
        // 发送取消退货单请求, 并处理异常
        const res = await this.$api.refuseRetNo(this.$route.params.id)
        if (res.data.code !== '0') {
          this.$notify({
            title: '提示',
            message: res.data.msg,
            duration: 2000
          })
          this.onRush()
          this.cancelReceiveOrder = false
          return
        }
        this.$notify({
          title: '成功',
          message: '取消成功',
          type: 'success',
          duration: 2000
        })
        this.cancelReceiveOrder = false
        this.onRush()
        this.$router.push('/TradingPlatform/returnList')
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '取消失败,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 初始化函数
    async onRush() {
      // 此处可替换定时器, 保留至统一整改
      this.isHide = false
      const that = this
      setTimeout(() => {
        that.isHide = true
      }, 200)
      console.log(this.$route.params.id)
      this.rootList = this.$store.getters.resourceCode
      // // 获取销售退货单明细
      const res1 = await this.$api.getReturnDetail(this.$route.params.id)
      this.baseText = res1.data.data
      this.baseText.planRetTotalAmount = this.baseText.planRetTotalAmount ? this.baseText.planRetTotalAmount.toFixed(2) : this.baseText.planRetTotalAmount
      if (this.baseText.retStatusCode === '50') {
        this.baseText.receiveTotalAmount = this.baseText.receiveTotalAmount ? this.baseText.receiveTotalAmount.toFixed(2) : this.baseText.receiveTotalAmount
      } else {
        this.baseText.receiveTotalAmount = ''
        this.baseText.receiveTotalQty = ''
      }
      this.currentInfomation = this.baseText
      this.Nostatus = this.baseText.retStatusCode
      // 获取发货单对话框基本信息
      const data = await this.$api.getDispatchSelectInfo()
      // 发货单弹窗各项信息
      this.selectOptions = data.data.data
      const arr2 = []
      for (const k in this.selectOptions) {
        const arr = this.selectOptions[k]
        arr['name'] = k
        arr2.push(arr)
      }
      arr2.map(item => {
        item[item.name] = []
        for (const k in item) {
          const arr = {}
          arr['value'] = k
          arr['name'] = item[k]
          item[item.name].push(arr)
        }
        item[item.name].pop()
        item[item.name].pop()
      })
      this.selectOptions = {}
      for (let i = 0; i < arr2.length; i++) {
        this.selectOptions[arr2[i].name] = arr2[i][arr2[i].name]
      }
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
  .tabel-detail span:last-child{
    display: inline-block;
    margin-left: 20px;
    font-weight: 200;

  }
  .tabel-detail span{
    font-weight: 200;
    font-size: 15px;
  }
  .tabel-detail{
    overflow: hidden;
    padding-bottom: 30px;
  }
  .mt{
    margin-top: 20px;
  }
  .tr{
    text-align: right;
  }
</style>
