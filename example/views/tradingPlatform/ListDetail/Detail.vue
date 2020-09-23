<template>
  <el-container class="order-box">
    <el-col :span="24" >
      <el-button v-loading.fullscreen.lock="fullscreenLoading" class="full-box" icon="el-icon-refresh" circle @click="resetFuction"/>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="订单信息" name="first">
          <!-- <detail-view :options="orderDetailOptions" :data="resDetail" :width-span="8"/> -->
          <el-col :span="24">
            <el-col :span="24" class="tabel-detail">
              <el-col :span="8">
                <span>订单号</span><span >{{ resDetail.orderNo }}</span>
              </el-col>
              <el-col :span="8">
                <span>订单日期</span><span >{{ resDetail.createDate }}</span>
              </el-col>
              <el-col :span="8">
                <span>订单状态</span><span>{{ orderStatusList[resDetail.orderStatus] || '订单状态异常' }}</span>
              </el-col>
            </el-col>
            <el-col :span="24" class="tabel-detail">
              <el-col :span="8">
                <span>客户代码</span><span >{{ resDetail.customerCode }}</span>
              </el-col>
              <el-col :span="8">
                <span>客户简称</span><span>{{ resDetail.customerShortName }}</span>
              </el-col>
              <el-col :span="8">
                <span>金额计算方式</span><span >{{ resDetail.priceCalculateModeValue }}</span>
              </el-col>
              <!-- <el-col :span="8">
                <span>订单金额</span><span>{{ resDetail.orderAmount }}</span>
              </el-col> -->
            </el-col>
            <el-col :span="24" class="tabel-detail">
              <el-col :span="8">
                <span>账务类别</span><span>{{ resDetail.accountingCategoryValue }}</span>
              </el-col>
              <el-col :span="8">
                <span>货币</span><span>{{ resDetail.balanceCurrencyValue }}</span>
              </el-col>
              <el-col :span="8">
                <span>业务员</span><span >{{ resDetail.businessMan }}</span>
              </el-col>
            </el-col>
            <el-col :span="24" class="tabel-detail">
              <el-col :span="8">
                <span>制单人</span><span>{{ resDetail.creator }}</span>
              </el-col>
              <el-col :span="8">
                <span>下单数量</span><span >{{ resDetail.cutQtyTotal }}</span>
              </el-col>
              <el-col :span="8">
                <span>下单金额</span><span>{{ resDetail.cutAmountTotal }}</span>
              </el-col>
            </el-col>
            <el-col :span="24" class="tabel-detail">

              <el-col :span="8">
                <span>占库数量</span><span>{{ resDetail.occupyQtyTotal }}</span>
              </el-col>
              <el-col :span="8">
                <span>占库金额</span><span >{{ resDetail.occupyAmountTotal }}</span>
              </el-col>
              <el-col :span="8">
                <span>发货数量</span><span>{{ resDetail.dispatchQtyTotal }}</span>
              </el-col>
            </el-col>
            <el-col :span="24" class="tabel-detail">
              <el-col :span="8">
                <span>发货金额</span><span>{{ resDetail.dispatchAmountTotal }}</span>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-form ref="form" :model="form" label-width="80px" label-position="left">
                <el-col :span="4">
                  <el-form-item label="货号">
                    <el-input v-model="form.code" placeholder="请输入货号" />
                  </el-form-item>
                </el-col>
                <el-col :span="18" :offset="2">
                  <el-checkbox-group v-model="form.type">
                    <el-checkbox label="只看全部占用" name="type"/>
                    <el-checkbox label="只看部分占用" name="type" />
                    <el-checkbox label="只看占用失败" name="type" />
                    <el-button type="primary" icon="el-icon-search" style="margin-left:20px" @click="searchProduct">查询</el-button>
                  </el-checkbox-group>
                </el-col>
              </el-form>
            </el-col>
            <el-col v-if="isHide" :span="24" class="button-box">
              <!-- <el-button
                type="primary"
                @click="$router.push(`/TradingPlatform/returnList/creatReturn/${$route.params.id}`)" >退货</el-button> -->
              <!-- <el-button
                v-if="(resDetail.billType !== 'FUTURE' && resDetail.billType !== 'SPOT') && (curOrderStatus === 'WAIT_OCCUPY_INVENTORY' || curOrderStatus === 'OCCUPYING_INVENTORY_FINISH' || curOrderStatus === 'OCCUPYING_INVENTORY') && rootList.find(item => item === 'importOrderDiscount')"
                :disabled="tableData.length === 0"
                type="primary"
                @click="currenView = 0, daoruzhekou = true" >导入折扣</el-button> -->
              <el-button
                v-if="!(curOrderStatus === 'WAIT_OCCUPY_INVENTORY' || curOrderStatus === 'OCCUPYING_INVENTORY')"
                type="primary"
                @click="open2()">查看占库结果</el-button>
              <el-button
                v-if="!(curOrderStatus === 'WAIT_OCCUPY_INVENTORY' || curOrderStatus === 'OCCUPYING_INVENTORY')"
                :disabled="textShow === '正在导出' || tableData.length === 0 "
                type="primary"
                @click="open1()">{{ textShow }}</el-button>
              <el-button
                v-if="curOrderStatus === 'OCCUPYING_INVENTORY_FINISH'"
                :disabled="tableData.length === 0"
                type="primary"
                @click="$router.push('/TradingPlatform/List/ListDetail/EditOrder/'+ $route.params.id)">修改订单</el-button>
              <el-button
                v-preventReClick
                v-if="curOrderStatus === 'OCCUPYING_INVENTORY_FINISH'"
                :disabled="tableData.length === 0"
                type="primary"
                @click="getApproval">提交审批</el-button>
              <el-button
                v-if="(curOrderStatus !== 'WAIT_OCCUPY_INVENTORY' && curOrderStatus !== 'OCCUPYING_INVENTORY_FINISH' && curOrderStatus !== 'OCCUPYING_INVENTORY')"
                :disabled="tableData.length === 0"
                type="primary"
                @click="viewAproo">查看审批材料</el-button>
              <el-button
                v-preventReClick
                v-if="(curOrderStatus === 'OCCUPYING_INVENTORY_FINISH' || curOrderStatus === 'AGREE_APPROVAL') && (curOrderStatus === 'PAID' || curOrderStatus === 'AGREE_APPROVAL' || curOrderStatus === 'COLLECTION_CONFIRMATION' || resDetail.billType === 'FUTURE' || resDetail.billType === 'OTHER' || resDetail.billType === 'SPOT')"
                type="primary"
                @click="handleOrder">提交订单</el-button>
              <el-button
                v-if="curOrderStatus === 'ORDER_CONFIRMATION'"
                :disabled="ready"
                type="primary"
                @click="serviceApprove">确认订单</el-button>
              <el-button
                v-if="curOrderStatus === 'ORDER_CONFIRMATION'"
                :disabled="ready"
                type="primary"
                @click="jujuedingdan = true">拒绝订单</el-button>
              <el-button
                v-if="curOrderStatus === 'ORDER_CONFIRMED'"
                type="primary"
                @click="tijiaofahuodan = true">提交发货单</el-button>
              <el-button
                v-preventReClick
                v-if="(curOrderStatus === 'OCCUPYING_INVENTORY_FINISH' || curOrderStatus === 'AGREE_APPROVAL' || curOrderStatus === 'COLLECTION_CONFIRMATION' || curOrderStatus === 'DOING_APPROVAL' || curOrderStatus === 'PAID' || curOrderStatus === 'ORDER_CONFIRMATION' || curOrderStatus === 'ORDER_CONFIRMED' || curOrderStatus === 'IN_DELIVERY' || curOrderStatus === 'DISPATCH_CONFIRMED')"
                type="primary"
                @click="quxiaodingdan = true">取消订单</el-button>
            </el-col>
            <table-common v-loading="loading" :height="410" :change-cell="[22]" :change-cell-color="'red'" :table-header="OrdertableHeader" :table-data="tableData" remark/>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="发货信息" name="second">
          <el-col :span="24" class="tabel-detail">
            <el-col :span="8">
              <span>订单号</span><span >{{ dispathInfo.orderNo }}</span>
            </el-col>
            <el-col :span="8">
              <span>客户编码</span><span >{{ dispathInfo.customerCode }}</span>
            </el-col>
            <el-col :span="8">
              <span>客户简称</span><span>{{ dispathInfo.customerShortName }}</span>
            </el-col>
          </el-col>
          <table-common v-loading="loading" :height="156" :table-header="dispatchtableHeader" :table-button-width="320" :table-data="tableData" table-button remark>
            <template slot="btn" slot-scope="scope">
              <el-button
                class="blueText"
                type="text"
                size="mini"
                @click="$router.push(`/ODS/DeliveryList/DeliveryDetail/${scope.rowData.row.dispatchNo}`)">查看</el-button>
              <el-button
                v-preventReClick
                :disabled="scope.rowData.row.dispatchStatue !== '已生成'"
                class="blueText"
                type="text"
                size="mini"
                @click="dispatchApprove(scope.rowData.row.dispatchNo)">{{ scope.rowData.row.markStatus === 1 ? '已确认' : '确认' }}</el-button>
              <el-button
                v-preventReClick
                :disabled="scope.rowData.row.dispatchStatue !== '已生成'"
                class="redText"
                type="text"
                size="mini"
                @click="dispatchRefuse(scope.rowData.row.dispatchNo)">{{ scope.rowData.row.markStatus === 2 ? '已拒绝' : '拒绝' }}</el-button>
              <el-button
                v-preventReClick
                v-if="(scope.rowData.row.dispatchStatue !== '已完成' || scope.rowData.row.dispatchStatue !== '已发货')"
                :disabled="scope.rowData.row.dispatchStatue !== '待下发' && scope.rowData.row.dispatchStatue !== '配货中' && scope.rowData.row.dispatchStatue !== '已生成' && scope.rowData.row.dispatchStatue !== '下发中'"
                class="redText"
                type="text"
                size="mini"
                @click="dispatchCancel(scope.rowData.row.dispatchNo)">{{ scope.rowData.row.markStatus === 3 ? '已取消' : '取消' }}</el-button>
                <!-- 可以用循环自定义设置按键名称及个数 -->
            </template>
          </table-common>
          <!--          分液器-->
        </el-tab-pane>
        <el-tab-pane v-if="false" label="退货信息" name="third">
          <el-col :span="24" class="tabel-detail">
            <el-col :span="8">
              <span>订单号</span><span >{{ resDetail.orderNo }}</span>
            </el-col>
            <el-col :span="8">
              <span>客户编码</span><span >{{ resDetail.customerCode }}</span>
            </el-col>
            <el-col :span="8">
              <span>客户简称</span><span>{{ resDetail.customerShortName }}</span>
            </el-col>
          </el-col>
          <el-col :span="24" class="tabel-detail">
            <el-col :span="8">
              <span>业务员</span><span >{{ resDetail.businessMan }}</span>
            </el-col>
          </el-col>
          <!-- <p class="mr"><span class="blue-line">|</span>退货单列表</p> -->
          <table-common v-loading="loading" :height="190" :table-header="returntableHeader1" :table-data="tableData" table-button remark>
            <template slot="btn" slot-scope="scope">
              <el-button @click="$router.push(`/TradingPlatform/returnList/creditDetail/${scope.rowData.row.retOrderNo}`)">查看退货单</el-button>
            </template>
          </table-common>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <page-common
      ref="page"
      :page-size-list="[50, 100]"
      :default-parameters="params"
      :api= "API"
      :method="methods"
      @query="query"
      @loading="load"
    />
    <el-dialog :visible.sync="daoruzhekou" :title="currenView === 0 ? '导入折扣' : '上传审批单据'">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-upload
          ref="uploadx"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :limit="5"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :name="currenView === 0 ? 'file' : 'fileAnnexes'"
          class="upload-demo"
          list-type="text"
          accept=".xls,.xlsx,.xlsm"
          action="aa"
          multiple>
          <el-button size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">点击上传excel文件，仅限格式xlsx、xls、xlsm，单个文件不超过10MB</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="daoruzhekou = false">取消</el-button>
        <el-button v-preventReClick type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="quxiaodingdan"
      title="温馨提示"
      width="20%">
      <span>您确定要取消订单么?</span>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="DelOrder">确 定</el-button>
        <el-button type="primary" @click="quxiaodingdan = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="jujuedingdan"
      title="拒绝订单理由"
      width="20%">
      <el-input
        v-model="remark"
        type="textarea"
        autosize
        placeholder="请输入拒绝理由内容"/>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="serviceRefuse">确 定</el-button>
        <el-button type="primary" @click="jujuedingdan = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="jujuefahuo"
      title="拒绝发货理由"
      width="20%">
      <el-input
        v-model="remark1"
        type="textarea"
        autosize
        placeholder="请输入拒绝理由内容"/>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="dispatchRefuse1">确 定</el-button>
        <el-button type="primary" @click="jujuefahuo = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="caiwuleixing"
      title="账务类别"
      width="40%">
      <el-select v-model="CWvalue" placeholder="请选择" label="账务类别">
        <el-option
          v-for="item in selectOptions.accountingCategory"
          :key="item.value"
          :label="`${item.value}- ${item.name}`"
          :value="item.value"/>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="sumbitOrder">确 定</el-button>
        <el-button type="primary" @click="caiwuleixing = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="tijiaofahuodan"
      title="发货单方式"
      width="40%">
      <el-form>
        <el-form-item label="金额计算方式">
          <el-select v-model="amtcalcMode" placeholder="请选择" label="金额计算方式">
            <el-option
              v-for="item in selectOptions.amtcalcMode"
              :key="item.value"
              :label="`${item.name}`"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发运方式">
          <el-select v-model="transportMethodCode" placeholder="请选择" label="发运方式">
            <el-option
              v-for="item in selectOptions.transportMethodCode"
              :key="item.value"
              :label="`${item.value}: ${item.name}`"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="送货方式">
          <el-select v-model="deliveryMode" placeholder="请选择" label="送货方式">
            <el-option
              v-for="item in selectOptions.deliveryMode"
              :key="item.value"
              :label="`${item.value}: ${item.name}`"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="tijiaofahuo">确 定</el-button>
        <el-button type="primary" @click="tijiaofahuodan = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="submitApprovalVa"
      title="提交审核"
      width="50%">
      <div style="backgroundColor:white;overflow: auto; text-align:center">
        <submit-approval :key="menuKey" :current-infomation="currentInfomation" @changeVa="changeVa2"/>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="占库结果"
      width="30%"
      center>
      <div>
        <h3 style="text-align:center">发起库存占用总商品明细数: {{ orderOccupyStatus.expectTotalOccupyQty }} </h3>
        <p style="text-align:center">全部占用商品明细数: {{ orderOccupyStatus.allOccupiedQty }} </p>
        <p style="text-align:center">部分占用商品明细数: {{ orderOccupyStatus.partiallyOccupiedQty }} </p>
        <p style="text-align:center">占用失败商品明细数: {{ orderOccupyStatus.occupationFailureQty }} </p>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="viewApprovalDialog"
      title="审批信息"
      width="50%">
      <div>
        <table-common :table-header="Header11" :table-data="viewTableData"/>
        <h3 style="margin: 20px 0">文件信息</h3>
        <p v-for="(item, index) in URLList" :key="index" style="margin: 20px 0">
          <el-button type="text" @click="OpenView(item.attachmentUrl)">{{ item.attachmentName }}</el-button>
        </p>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="centerDialogVisible1"
      title="确认发货单"
      width="70%"
      center>
      <div style="overflow:hidden">
        <el-col :span="5" style="text-align:right">需确认金额：</el-col>
        <el-col :span="17" style="height:200px;border:1px solid #ccc">
          <el-scrollbar style="height: 100%; font-size:12px">
            <ul>
              <li v-for="(item, index) in dispatchApprovalObject.dispatchingOrderItems" :key="index" style="text-align:left; margin-bottom:10px;font-size:16px">
                发货单号 : {{ item.orderNo }}  <span style="margin-left:20px">发货金额 : {{ item.dispatchingAmount.toFixed(2) }}</span>
              </li>
            </ul>
          </el-scrollbar>
        </el-col>
        <el-col :span="24">
          <p style="text-align:center;line-height:30px; font-size:19px; margin-top:10px">共计确认金额 {{ dispatchApprovalObject.allAmount.toFixed(2) }}</p>
        </el-col>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="dispatchApprove1(fahuoId)">确 定</el-button>
        <el-button @click="centerDialogVisible1 = false">取 消</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import PageCommon from '@/components/PageCommon'
// import moment from 'moment'
import SubmitApproval from './submitApproval'
import TableCommon from '../components/TableCommon'
import TableText from '@/textResources/tableText'
import detailText from '@/textResources/detail'
import detailView from '@/components/detailView'
import preventReClick from '@/directive/preventReClick'

export default {
  name: 'Detail',
  components: {
    PageCommon, // 分页组件
    SubmitApproval, // 审核弹窗
    TableCommon, // 表格组件
    detailView // 详情组件
  },
  directives: { preventReClick },
  data() {
    return {
      // 标注: 不必要参数太多, 主体内容太过繁琐重复, 简化暂留到整改计划中
      isHide: true, // 控制显示隐藏操作按钮变量
      ready: false, // 控制显示隐藏操作按钮变量
      viewTableData: [], // 审核材料table数据
      currenView: 0, // 控制不同订单类型显示按钮变量
      Header11: [ // 审核材料table表头数据
        { label: '审批单号', prop: 'approvalNo' },
        { label: '单据类型', prop: 'billType' },
        { label: '单据状态', prop: 'approvalResults' }
      ],
      menuKey: 1, // 控制审批弹窗加载变量
      returnDetailOptions: detailText.returnDetailOptions, // 退回详情
      orderDetailOptions: detailText.orderDetailOptions, // 订单详情
      OrdertableHeader: TableText.OrdertableHeader, // 订单表格头
      dispatchtableHeader: TableText.dispatchtableHeader, // 发货单表格头
      returntableHeader1: TableText.returntableHeader1, // 退货单表格头
      submitApprovalVa: false, // 控制审核弹窗显示变量
      fullscreenLoading: false, // 刷新当前数据内容变量
      viewApprovalDialog: false, // 查看审批信息变量
      orderStatusList: [], // 订单状态数据
      yulanfukuan1: false, // 无用变量
      getFlag: false, // 控制表格无结果时,显示提示文字
      temp: { // 储存用户操作审核数据
        id: undefined,
        orderNo: this.$route.params.id,
        file: undefined
      },
      centerDialogVisible: false, // 控制显示占库结果弹窗
      centerDialogVisible1: false, // 控制确认发货弹窗
      credit: false, // 无用变量
      tijiaofahuodan: false, // 控制显示发货单发货方式弹窗
      jujuedingdan: false, // 控制显示拒绝订单弹窗
      jujuefahuo: false, // 控制显示拒绝发货弹窗
      paymoney: false, // 无用变量
      sendOrder: 1, // 无用变量
      quxiaodingdan: false, // 控制取消订单弹窗
      caiwuleixing: false, // 控制财务类型弹窗
      textShow: '导出占库结果', // 按钮显示文字
      showPic: false, // 无用变量
      daoruzhekou: false, // 控制显示导入折扣
      activeName: 'first', // 控制进入页面加载tab项
      currentPage4: 4, // 无用变量
      form: { // form数据
        type: [],
        code: ''
      },
      payType: { // 付款方式
        ADVANCE_PAYMENT: '预付款',
        CREDIT: '信贷',
        ADVANCE_PAYMENT_AND_CREDIT: '预付款+信贷'
      },
      checkOptions: [{ // 查看占用类型
        name: '只看全部占用',
        trueName: 'TOTAL_OCCUPY'
      }, {
        name: '只看部分占用',
        trueName: 'PART_OCCUPY'
      }, {
        name: '只看占用失败',
        trueName: 'OCCUPY_FAILURE'
      }],
      resDetail: [], // 存储详情信息
      API: `/bff/b2b/api/v1/orderDetail`, // 表格数据接口地址
      params: { // 参数
        orderNo: this.$route.params.id
      },
      loading: false, // 加载动画
      tableData: [], // 表格数据
      dispathInfo: [], // 发货单信息
      returnOrder: [], // 退货单信息
      fileList: [], // 文件数据
      picUrl: '', // 无用变量
      CWvalue: '', // 财务类型变量
      transportMethodCode: '', // 发运发式变量
      deliveryMode: '', // 送货方式变量
      amtcalcMode: '000000000013', // 金额计算方式代码
      remark: '', // 备注
      remark1: '', // 拒绝备注
      index: '', // 下标标记
      selectOptions: '', // 字典数据源
      tabCode: 1, // tab代码
      methods: 'post', // 方法
      rootList: [], // 权限列表
      curOrderStatus: '', // 当前订单状态
      fahuoId: '', // 发货ID
      dispatchApprovalObject: { // 发货单信息
        allAmount: 0,
        dispatchingOrderItems: []
      },
      orderOccupyStatus: { // 占库结果数据
        allOccupiedQty: '',
        expectTotalOccupyQty: '',
        occupationFailureQty: '',
        partiallyOccupiedQty: ''
      },
      count: 0, // 控制请求数据次数
      currentInfomation: {}, // 传递审核组件当前信息
      URLList: [] // 审核材料URL数据
    }
  },
  async created() {
    // 发送统计请求,
    // 标注: 可提取到公共函数, 减少代码行, 此修改暂留到整改计划中
    // 请求数据
    this.onRush()
  },
  methods: {
    // 下载审批材料函数
    OpenView(url) {
      window.open(url)
    },
    // 查看审批材料函数
    async viewAproo() {
      // 打开审批材料弹窗
      this.viewApprovalDialog = true
      // 请求审批材料数据
      const res = await this.$api.getApprovaView(this.$route.params.id)
      this.viewTableData = res.data.data.approvalInformation
      // 获取URL数据
      const res1 = await this.$api.getApproCailiao('APPROVAL_ANNEX,APPROVAL_IMAGE', this.$route.params.id)
      console.log(res1)
      this.URLList = res1.data.data
    },
    // 查看占库结果函数
    async open2() {
      this.centerDialogVisible = true
      // 方法调用,展示占库结果.
      try {
        // 发送请求, 获取占库结果数据
        const res = await this.$api.getorderOccupyStatus(this.$route.params.id)
        this.orderOccupyStatus = res.data.data
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '获取占库结果失败,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 提交审核触发函数
    changeVa2(va, index) {
      // 刷新提交审核弹窗,达到隐藏并清除数据作用
      // 标注: 此处可做优化, 此修改暂留到整改计划中
      this.submitApprovalVa = va
      if (this.menuKey === 1) {
        this.menuKey = 2
      } else {
        this.menuKey = 1
      }
      if (index === 1) return
      this.resetFuction()
    },
    async onRush() {
      // 标注: 此处可替换定时器, 此修改暂留到整改计划中
      this.isHide = false
      const that = this
      setTimeout(() => {
        that.isHide = true
      }, 200)
      this.rootList = this.$store.getters.resourceCode
      const params = this.$route.params.id
      // 获取发货单对话框基本信息
      const data = await this.$api.getDispatchSelectInfo()
      // 发货单弹窗各项信息
      this.selectOptions = data.data.data
      const arr2 = []
      // 标注: 此处可简化, 此修改暂留到整改计划中
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
      // 获取字典数据源
      this.selectOptions = {}
      for (let i = 0; i < arr2.length; i++) {
        this.selectOptions[arr2[i].name] = arr2[i][arr2[i].name]
      }
      // 获取订单状态列表
      const status = await this.$api.orderStatus(this.$route.params.id)
      this.orderStatusList = status.data.data.orderStatus
      // 临时前端修复订单状态异常转换处理, 等待后端后续修复
      if (status.data.data.curOrderStatus === 'COLLECTION_CONFIRMATION') {
        this.curOrderStatus = 'AGREE_APPROVAL'
      } else {
        this.curOrderStatus = status.data.data.curOrderStatus
      }
      // 通过订单号查信息
      const res = await this.$api.orderDetail(params)
      // 临时前端修复订单状态异常转换处理, 等待后端后续修复
      if (res.data.data.orderStatus === 'COLLECTION_CONFIRMATION') {
        res.data.data.orderStatus = 'AGREE_APPROVAL'
      }
      this.resDetail = res.data.data
      this.currentInfomation = res.data.data
      this.resDetail.createDate = this.resDetail.createDate.substring(0, 11)
      this.resDetail.orderAmount = this.resDetail.orderAmount ? this.resDetail.orderAmount.toFixed(2) : this.resDetail.orderAmount
      this.resDetail.cutAmountTotal = this.resDetail.cutAmountTotal ? this.resDetail.cutAmountTotal.toFixed(2) : this.resDetail.cutAmountTotal
      this.resDetail.dispatchAmountTotal = this.resDetail.dispatchAmountTotal ? this.resDetail.dispatchAmountTotal.toFixed(2) : this.resDetail.dispatchAmountTotal
      this.resDetail.occupyAmountTotal = this.resDetail.occupyAmountTotal ? this.resDetail.occupyAmountTotal.toFixed(2) : this.resDetail.occupyAmountTotal
      this.CWvalue = this.selectOptions.accountingCategory.filter(item => item.name === this.resDetail.accountingCategoryValue)[0] || 'C8001'
      this.amtcalcMode = this.resDetail.priceCalculateModeKey
      // 获取分页信息
      this.count++
      console.log(this.count)
      if (this.count > 1) {
        console.log('列表刷新')
        this.$refs.page.getList(this.params)
      }
    },
    getIndex() {
      this.orderStatus.findIndex(item => item)
    },
    // tab点击切换
    async handleClick(tab) {
      const str = tab.label
      this.params = {
        orderNo: this.$route.params.id
      }
      // 判断条件当前tab的所属文字
      if (str === '订单信息') {
        this.API = `/bff/b2b/api/v1/orderDetail`
        this.methods = 'post'
        const res = await this.$api.orderDetail(this.$route.params.id)
        this.resDetail = res.data.data // 详情信息存储
      } else if (str === '发货信息') {
        this.API = `/bff/b2b/api/v1/dispatchList`
        this.methods = 'get'
        const res = await this.$api.dispathInfo(this.params)
        this.dispathInfo = res.data.data
      } else {
        this.API = `/bff/b2b/api/v1/ret_order/_list`
        this.methods = 'post'
      }
      // 刷新表格数据
      this.$nextTick(() => {
        this.$refs.page.getList(this.params)
      })
    },
    // 搜索函数
    searchProduct() {
      const arr = []
      for (let i = 0; i < this.form.type.length; i++) {
        arr.push(this.checkOptions.filter(item => item.name === this.form.type[i])[0].trueName)
      }
      const params = {
        orderNo: this.$route.params.id,
        productCode: this.form.code,
        occupyResult: arr
      }
      // 标注: 此处可修改, 此修改暂留到整改计划中
      if (params.productCode === '') {
        delete params.productCode
      }
      this.getFlag = true
      this.$nextTick(() => {
        this.$refs.page.getList(params)
      })
    },
    // 表格数据源函数
    query(data) {
      // 对table数据源处理
      data.map((item) => {
        // 标注: 此处应可简化, 此修改暂留到整改计划中
        for (var k in item) {
          if ((k.indexOf('Date') !== -1 || k.indexOf('Time') !== -1) && k !== 'updateTime') {
            item[k] = item[k].substring(0, 11)
          }
          if (k === 'retailPrice' || k === 'discount' || k === 'balanceAmount') {
            if (item[k] < 0) {
              item[k] = ''
            } else {
              item[k] = item[k].toFixed(4)
            }
          }
          if (k === 'payAmount' || k === 'cutTotalAmount' || k === 'occupyTotalAmount' || k === 'dispatchTotalAmount') {
            item[k] = item[k].toFixed(2)
          }
        }
      })
      this.tableData = data
    },
    // 加载动画函数
    load(status) {
      this.loading = status
    },
    // 导出函数
    async open1() {
      this.$axios({
        method: 'post',
        url: `/b2b_order/api/v1/${this.$route.params.id}/occupyInventory`,
        responseType: 'blob'
      }).then(res => {
        // 如果不是返回数据流, 则提示信息
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
      // 标注: 此处定时器可替换, 此修改暂留到整改计划中
      this.textShow = '正在导出'
      const that = this
      setTimeout(() => {
        that.textShow = '导出占库结果'
      }, 1000)
    },
    // 取消订单函数
    async DelOrder() {
      try {
        const res = await this.$api.cancelOrder(this.$route.params.id)
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
          message: '取消成功',
          type: 'success',
          duration: 2000
        })
        this.showPic = true // 无用代码行
        this.quxiaodingdan = false
        // this.onRush()
        this.$router.push('/TradingPlatform/orderList')
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '取消失败,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 确认订单函数
    async serviceApprove() {
      const params = {
        orderNo: this.$route.params.id
      }
      try {
        // 标注: 此处定时器可替换, 此修改暂留到整改计划中,
        this.ready = true
        const that = this
        setTimeout(() => {
          that.ready = false
        }, 2000)
        const res = await this.$api.serviceApprove(params)
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
    // 拒绝订单函数
    async serviceRefuse() {
      const params = {
        orderNo: this.$route.params.id,
        remark: this.remark
      }
      // 拒绝理由不能为空
      if (params.remark === '') {
        this.$notify({
          title: '提示',
          message: '请填写拒绝理由',
          duration: 2000
        })
        return
      }
      try {
        // 标注: 此处定时器可替换, 此修改暂留到整改计划中
        this.ready = true
        const that = this
        setTimeout(() => {
          that.ready = false
        }, 2000)
        const res = await this.$api.serviceRefuse(params)
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
        this.jujuedingdan = false
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
    // 关闭弹窗
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 提交订单函数
    handleOrder() {
      this.caiwuleixing = true
    },
    // 移除文件函数
    // 标注: 以下两个函数可移除
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    // 限制文件上传函数
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 移除文件触发函数
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传前函数
    beforeUpload(file) {
      this.formData.append('file', file)
      this.formData.append('fileAnnexes', file)
      return false
    },
    // 提交审核函数
    async getApproval() {
      let flag = false
      this.menuKey = 2
      const arr = this.tableData.filter(item => item.discount !== 1 && item.discount !== 0 && item.discount !== '')
      if (arr.length > 0) {
        flag = true
      }
      if (flag) {
        const params = {
          orderNo: this.$route.params.id
        }
        try {
          const res = await this.$api.submitApproval(params)
          if (res.data.code !== '0') {
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
            return
          }
          if (this.resDetail.billType === 'SPECIAL') {
            this.submitApprovalVa = true
          } else {
            this.currenView = 1
            this.daoruzhekou = true
          }
        } catch (e) {
          this.$notify({
            title: '错误',
            message: '网络连接失败,请稍后重试',
            type: 'error',
            duration: 2000
          })
        }
      } else {
        this.$notify({
          title: '提示',
          message: '所有商品折扣都必须填写或订单无商品',
          duration: 2000
        })
      }
    },
    // 点击确认审核函数
    createData() {
      const that = this
      that.formData = new FormData()
      that.$refs['uploadx'].submit()
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          that.formData.append('orderNo', this.temp.orderNo)
          if (!that.formData.get('file')) {
            this.$notify({
              title: '提示',
              message: '文件不能为空',
              duration: 2000
            })
            return
          }
          if (that.formData.get('file').size / 1024 / 1024 >= 10) {
            this.$notify({
              title: '提示',
              message: '上传文件大小不能超过 10MB!',
              duration: 2000
            })
            return
          }
          try {
            if (this.currenView === 0) {
              const res = await this.$api.productDiscount(this.$route.params.id, that.formData)
              if (res.data.code !== '0') {
                this.$notify({
                  title: '提示',
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000
                })
                return
              }
              this.$notify({
                title: '成功',
                message: '导入成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.formData.append('submitter', this.currentInfomation.creatorCode)
              this.formData.delete('file')
              const res = await this.$api.submitApprovalDetail(this.formData)
              if (res.data.code !== '0') {
                if (res.data.code === '3000029') {
                  this.$notify({
                    title: '提示',
                    message: res.data.msg,
                    duration: 2000
                  })
                } else {
                  this.$notify({
                    title: '错误',
                    message: res.data.msg,
                    type: 'error',
                    duration: 2000
                  })
                  return
                }
              } else {
                this.$notify({
                  title: '成功',
                  message: '提交审批成功',
                  type: 'success',
                  duration: 2000
                })
              }
            }
            this.daoruzhekou = false
            this.$refs.page.getList(this.params)
            that.$refs['uploadx'].clearFiles()
            this.onRush()
          } catch (e) {
            this.$notify({
              title: '错误',
              message: '上传文件失败',
              type: 'error',
              duration: 2000
            })
          }
        }
      })
    },
    // 提交订单函数
    async sumbitOrder() {
      try {
        const params = {
          orderNo: this.$route.params.id,
          accountingCategory: this.CWvalue
        }
        if (!this.CWvalue) {
          this.$notify({
            title: '提示',
            message: '请选择财务类型',
            duration: 2000
          })
          return
        }
        const res = await this.$api.submitOrder(params)
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
        this.caiwuleixing = false
        this.onRush()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '提交订单失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 提交发货单函数
    async tijiaofahuo() {
      if (this.deliveryMode === '' || this.transportMethodCode === '' || this.amtcalcMode === '') {
        this.$notify({
          title: '提示',
          message: '所有方式都选择之后才能确认提交',
          duration: 2000
        })
        return
      }
      try {
        const params = {
          orderNo: this.$route.params.id,
          amtcalcMode: this.amtcalcMode,
          transportMethodCode: this.transportMethodCode,
          deliveryMode: this.deliveryMode
        }
        const res = await this.$api.createDispatch(params)
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
        this.tijiaofahuodan = false
        this.onRush()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '网络异常,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 取消发货单函数
    async dispatchCancel(id) {
      const params = {
        dispatchNo: id
      }
      try {
        const res = await this.$api.dispatchCancel(params)
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
          message: '取消成功',
          type: 'success',
          duration: 2000
        })
        this.onRush()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '取消失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 确认发货单函数
    async dispatchApprove(id) {
      this.fahuoId = id
      this.centerDialogVisible1 = true
      try {
        const res = await this.$api.getDispatchApprovalList(id)
        this.dispatchApprovalObject = res.data.data
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '获取发货单金额列表失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 确认发货单函数
    async dispatchApprove1(id) {
      try {
        const params = {
          dispatchNo: id
        }
        const res = await this.$api.dispatchApprove(params)
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
          message: '同意成功',
          type: 'success',
          duration: 2000
        })
        this.centerDialogVisible1 = false
        this.onRush()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '同意失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 拒绝发货单函数
    dispatchRefuse(id) {
      this.jujuefahuo = true
      this.index = id
    },
    // 重置函数
    resetFuction() {
      this.fullscreenLoading = true
      this.onRush()
      this.$refs.page.getList(this.params)
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 1000)
    },
    // 拒绝发货单函数(发货信息)
    async dispatchRefuse1() {
      const params = {
        dispatchNo: this.index,
        remark: this.remark1
      }
      if (params.remark === '') {
        this.$notify({
          title: '提示',
          message: '请填写拒绝理由',
          duration: 2000
        })
        return
      }
      try {
        const res = await this.$api.dispatchRefuse(params)
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
          message: '拒绝成功',
          type: 'success',
          duration: 2000
        })
        this.jujuefahuo = false
        this.onRush()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '拒绝失败',
          type: 'error',
          duration: 2000
        })
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
  font-size: 12px;
  /* font-weight: 200; */

}
.mr{
  margin-bottom: 5px
}
.tabel-detail span:first-child{
  width:100px ;
  display: inline-block;
  font-size: 12px;
  color: black;
  /* font-weight: 800; */
}
  .tabel-detail{
    overflow: hidden;
    margin-bottom: 5px;
    padding-left:5px;
  }
  .button-box{
    margin: 20px 0;
  }
  ul {
    list-style: none;
  }
  .blueText {
    color: blue;
  }
  .redText {
    color: red;
  }
  .full-box {
     position:absolute;
      right:20px;
      z-index:999
  }
</style>
