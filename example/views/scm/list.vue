<template>
  <div class="order-box">
    <el-container class="list-box">
      <el-col :span="24">
        <!-- <p class="mr"><span class="blue-line">|</span>查询条件</p> -->
        <el-form ref="form" :model="form" class="searchBox">
          <el-row>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="8">
              <el-form-item label="单号" label-width="70px">
                <el-input
                  v-model="form.transferNoList"
                  maxlength="30"
                  style="width: 100%;"
                  clearable
                  placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="8">
              <el-form-item label="手工单号" label-width="70px">
                <el-input
                  v-model="form.manualBillNo"
                  maxlength="30"
                  style="width: 100%;"
                  clearable
                  placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="8">
              <el-form-item label="调出仓库" label-width="70px">
                <el-select
                  :loading="loading"
                  :remote-method="remoteSearchOutWarehouse"
                  v-model="form.outWarehouseCodeList"
                  filterable
                  remote
                  clearable
                  placeholder="请选择"
                  style="width: 100%;"
                  @clear="clearOutWarehouse">
                  <div style="overflow-y:auto;padding-top:5px;">
                    <template>
                      <span style="margin-left:6%;color: #8492a6;">仓库外码</span>
                      <span style="margin-left:20%;color: #8492a6;">仓库名称</span>
                    </template>
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <span style="float: left;font-size: 13px;">{{ item.value2 }}</span>
                      <span style="float: left;padding-left:20px;font-size: 13px;">{{ item.label }}</span>
                    </el-option>
                  </div>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="8">
              <el-form-item label="调入仓库" label-width="70px">
                <el-select
                  :loading="loading"
                  :remote-method="remoteSearchInWarehouse"
                  v-model="form.inWarehouseCodeList"
                  remote
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width: 100%;"
                  @clear="clearInWarehouse">
                  <div style="overflow-y:auto;padding-top:5px;">
                    <template>
                      <span style="margin-left:6%;color: #8492a6;">仓库外码</span>
                      <span style="margin-left:20%;color: #8492a6;">仓库名称</span>
                    </template>
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <span style="float: left;font-size: 13px;">{{ item.value2 }}</span>
                      <span style="float: left;padding-left:20px;font-size: 13px;">{{ item.label }}</span>
                    </el-option>
                  </div>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="调拨类型" label-width="70px">
                <el-select
                  v-model="form.transferTypeCodeList"
                  clearable
                  style="width: 100%;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="单据状态" label-width="70px">
                <el-select
                  v-model="form.billStatusList"
                  clearable
                  style="width: 100%;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="分货状态" label-width="70px">
                <el-select
                  v-model="form.allocateStatus"
                  clearable
                  style="width: 100%;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in allocateStatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="调拨方式" label-width="70px">
                <el-select
                  v-model="form.transferModeCodeList"
                  clearable
                  style="width: 100%;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="货号" label-width="70px">
                <el-input
                  v-model="form.materialCodeList"
                  maxlength="30"
                  clearable
                  style="width: 100%;"
                  placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="开单日期" label-width="70px">
                <el-date-picker
                  v-model="form.time"
                  :default-value="defaultDate"
                  :default-time="['00:00:00', '23:59:59']"
                  type="daterange"
                  range-separator="~"
                  format="yyyy-MM-dd"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="操作员" label-width="70px">
                <el-select
                  v-model="form.operatorCodeList"
                  clearable
                  filterable
                  style="width: 100%;"
                  placeholder="请选择">
                  <el-option
                    v-for="(item,index) in options6"
                    :key="index"
                    :label="item.userName + item.userCode"
                    :value="item.userCode"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span>总数量：</span>
              <span> {{ totalApplyQty }}</span>
            </el-col>
            <el-col :span="6">
              <span>总金额：</span>
              <span> {{ totalApplyPrice }}</span>
            </el-col>
            <el-col :lg="4" :xl="4" :md="4" :xs="24" :sm="12" style="text-align:center">
              <el-checkbox v-model="seeDraftOnly" style="width: 100%;">只看草稿</el-checkbox>
            </el-col>
            <el-col :lg="7" :xl="7" :md="7" :xs="24" :sm="12">
              <el-form-item>
                <div class="grid-content bg-purple">
                  <el-button v-preventReClick type="primary" icon="el-icon-search" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                  <el-button type="primary" size="mini" @click="toAdd">新增</el-button>
                  <el-button v-preventReClick :disabled="disableExport" type="primary" size="mini" @click="Export(form)">导出列表</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <div class="mr">
        <!-- <div><span class="blue-line">|</span><span>查询结果</span></div> -->
      </div>
      <div class="showbox" style="float:right;color:#00ace6;cursor:pointer;">
        <span v-if="!show" style="text-decoration: underline" @click="showMore">展开查看全部字段
          <i class="el-icon-right"/>
        </span>
        <span v-if="show" style="text-decoration: underline" @click="closeMore">
          <i class="el-icon-back"/>
          收起
        </span>
      </div>
      <div v-if="!show" class="showbox">
        <el-table
          :data="tableData"
          :header-cell-style="{background: '#204060', color: 'white'}"
          style="width: 100%"
          height="400"
          border
          @selection-change="selsChange">
          <el-table-column
            type="selection"
            prop="choose"
            label="选择"
            align="center"
            width=""/>
          <el-table-column
            prop="actionName"
            label="操作"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button v-if="hasActionCode(scope.row.actionList, 'CONTINUE_EDITING_DRAFT')" type="text" style="color:red;font-size:12px" @click="operate('CONTINUE_EDITING_DRAFT', scope.row.transferNo)">继续编辑</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'CONTINUE_EDITING')" type="text" style="color:red;font-size:12px" @click="operate('CONTINUE_EDITING', scope.row.transferNo)">继续编辑</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'DELETE')" type="text" style="color:red;font-size:12px" @click="operate('DELETE', scope.row.transferNo)">删除草稿</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'CANCEL')" type="text" style="color:red;font-size:12px" @click="operate('CANCEL', scope.row.transferNo)">取消</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'CONFIRM_OCCUPY')" type="text" style="color:red;font-size:12px" @click="operate('CONFIRM_OCCUPY', scope.row.transferNo)">确认占库结果</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'RE_OCCUPY')" type="text" style="color:red;font-size:12px" @click="operate('RE_OCCUPY', scope.row.transferNo)">重新占库</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="transferNo"
            label="单号"
            align="center"
            width="100"/>
          <el-table-column
            prop="manualBillNo"
            label="手工单号"
            align="center"
            width="100"/>
          <el-table-column
            prop="outWarehouseName"
            label="调出仓库"
            align="center"
            width="120"/>
          <el-table-column
            prop="inWarehouseName"
            label="调入仓库"
            align="center"
            width="140"/>
          <el-table-column
            prop="totalApplyQty"
            label="申请数量"
            align="center"
            width="70"/>
          <el-table-column
            prop="totalApplyPrice"
            label="申请金额"
            align="center"
            width="70"/>
          <el-table-column
            prop="createTime"
            label="开单日期"
            align="center"
            width=""/>
          <el-table-column
            prop="billStatusName"
            label="单据状态"
            align="center"
            width="70"/>
          <el-table-column
            prop="allocateStatusName"
            label="分货状态"
            align="center"
            width="70"/>
          <el-table-column
            prop="totalOccupyQty"
            label="占库量"
            align="center"
            width="60"/>
          <el-table-column
            prop="occupyStatusName"
            label="占库记录"
            align="center"
            width=""/>
          <el-table-column
            prop="totalDispatchQty"
            label="调出数量"
            align="center"
            width=""/>
          <el-table-column
            prop="totalReceiveQty"
            label="调入数量"
            align="center"
            width=""/>
          <el-table-column
            prop="transferDiff"
            label="调拨差异"
            align="center"
            width=""/>
          <el-table-column
            prop="detailed_information"
            label="明细信息"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.billStatusName !== '草稿'"
                type="primary"
                size="mini"
                @click="toDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="delivery_invoice"
            label="发货单"
            align="center"
            width="">
            <template v-if="scope.row.dispatchBillNo" slot-scope="scope">
              <p>已生效</p>
              <el-button
                type="primary"
                size="mini"
                @click="$router.push(`/ODS/DeliveryList/DeliveryDetail/${scope.row.dispatchBillNo}`)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="receiving_invoice"
            label="收货单"
            align="center"
            width="">
            <template v-if="scope.row.receiveBillNo" slot-scope="scope">
              <p>已生效</p>
              <el-button
                type="primary"
                size="mini"
                @click="$router.push(`/ODS/ReceiveList/ReceiveDetail/${scope.row.receiveBillNo }`)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="show" class="hiddenbox">
        <el-table
          :data="tableData"
          :header-cell-style="{background: '#204060', color: 'white'}"
          style="width: 100%"
          height="401"
          border
          @selection-change="selsChange">
          <el-table-column
            type="selection"
            prop="choose"
            label="选择"
            align="center"
            width=""/>
          <el-table-column
            prop="actionName"
            label="操作"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button v-if="hasActionCode(scope.row.actionList, 'CONTINUE_EDITING_DRAFT')" type="text" style="color:red;font-size:12px" @click="operate('CONTINUE_EDITING_DRAFT', scope.row.transferNo)">继续编辑</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'CONTINUE_EDITING')" type="text" style="color:red;font-size:12px" @click="operate('CONTINUE_EDITING', scope.row.transferNo)">继续编辑</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'DELETE')" type="text" style="color:red;font-size:12px" @click="operate('DELETE', scope.row.transferNo)">删除草稿</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'CANCEL')" type="text" style="color:red;font-size:12px" @click="operate('CANCEL', scope.row.transferNo)">取消</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'CONFIRM_OCCUPY')" type="text" style="color:red;font-size:12px" @click="operate('CONFIRM_OCCUPY', scope.row.transferNo)">确认占库结果</el-button>
              <el-button v-if="hasActionCode(scope.row.actionList, 'RE_OCCUPY')" type="text" style="color:red;font-size:12px" @click="operate('RE_OCCUPY', scope.row.transferNo)">重新占库</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="transferNo"
            label="单号"
            align="center"
            width="100"/>
          <el-table-column
            prop="manualBillNo"
            label="手工单号"
            align="center"
            width="100"/>
          <el-table-column
            prop="outWarehouseName"
            label="调出仓库"
            align="center"
            width="120"/>
          <el-table-column
            prop="inWarehouseName"
            label="调入仓库"
            align="center"
            width="140"/>
          <el-table-column
            prop="totalApplyQty"
            label="申请数量"
            align="center"
            width="70"/>
          <el-table-column
            prop="totalApplyPrice"
            label="申请金额"
            align="center"
            width="70"/>
          <el-table-column
            prop="createTime"
            label="开单日期"
            align="center"
            width=""/>
          <el-table-column
            prop="billStatusName"
            label="单据状态"
            align="center"
            width="70"/>
          <el-table-column
            prop="allocateStatusName"
            label="分货状态"
            align="center"
            width="70"/>
          <el-table-column
            prop="totalOccupyQty"
            label="占库量"
            align="center"
            width="60"/>
          <el-table-column
            prop="occupyStatusName"
            label="占库记录"
            align="center"
            width=""/>
          <el-table-column
            prop="totalDispatchQty"
            label="调出数量"
            align="center"
            width=""/>
          <el-table-column
            prop="totalReceiveQty"
            label="调入数量"
            align="center"
            width=""/>
          <el-table-column
            prop="transferDiff"
            label="调拨差异"
            align="center"
            width=""/>
          <el-table-column
            prop="detailed_information"
            label="明细信息"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.billStatusName !== '草稿'"
                type="primary"
                size="mini"
                @click="toDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="delivery_invoice"
            label="发货单"
            align="center"
            width="">
            <template v-if="scope.row.dispatchBillNo" slot-scope="scope">
              <p>已生效</p>
              <el-button
                type="primary"
                size="mini"
                @click="$router.push(`/ODS/DeliveryList/DeliveryDetail/${scope.row.dispatchBillNo}`)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="receiving_invoice"
            label="收货单"
            align="center"
            width="">
            <template v-if="scope.row.receiveBillNo" slot-scope="scope">
              <p>已生效</p>
              <el-button
                type="primary"
                size="mini"
                @click="$router.push(`/ODS/ReceiveList/ReceiveDetail/${scope.row.receiveBillNo }`)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="departureTime"
            label="调出日期"
            align="center"
            width=""/>
          <af-table-column
            prop="dispatchTime"
            label="调出生效日期"
            align="center"
            width=""/>
          <el-table-column
            prop="receiveTime"
            label="调入日期"
            align="center"
            width=""/>
          <af-table-column
            prop="accomplishTime"
            label="调入生效日期"
            align="center"
            width=""/>
          <el-table-column
            prop="operatorName"
            label="提交人"
            align="center"
            width=""/>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            width=""/>
        </el-table>
      </div>
      <div class="list-pages">
        <el-pagination
          :page-sizes="[25]"
          :page-size="pageSize"
          :current-page="pageNum"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </el-container>
  </div>
</template>

<script>
import PageCommon from './components/PageCommon/index'
import moment from 'moment'
export default {
  name: 'ScmList',
  components: {
    PageCommon
  },
  data() {
    return {
      total: 0, // 分页器总条数初始值
      value: '', // 输入框初始值
      options1: [], // 调出仓库
      value1: '',
      options2: [], // 调入仓库
      value2: '',
      options3: [], // 调拨类型
      value3: '',
      options4: [], // 单据状态
      value5: '',
      options5: [], // 调拨方式
      options6: [], // 操作员
      allocateStatusList: [], // 分货状态
      value6: '',
      input: '',
      value7: '',
      show: false, // 表格展开/收起控制开关 默认不展开
      tableData: [], // 货品信息初始值
      state: '', // 单号
      state2: '', // 货号
      radio: '', // 控制当前页全选/所有页全选按钮 现已弃用
      totalApplyQty: '', // 货品总数量
      totalApplyPrice: '', // 货品总金额
      dangqian: {}, // 当前货品信息，已弃用
      form: {
        transferNoList: '', // 单号
        outWarehouseCodeList: '', // 调出仓库
        inWarehouseCodeList: '', // 调入仓库
        transferTypeCodeList: '', // 调拨类型
        billStatusList: '', // 单据状态
        transferModeCodeList: '', // 调拨方式
        operatorCodeList: '', // 操作员
        materialCodeList: '', // 货号
        notEmpty: false,
        isDraft: false, // 是否为草稿
        productNoList: [], // 该字段已弃用
        time: [],
        manualBillNo: '', // 手工单号
        allocateStatus: '' // 分货状态
        // orderByList: {
        //   columnName: 'total',
        //   order: ''
        // }
      },
      pageNum: 1, // 分页器页数 默认第一页
      pageSize: 25, // 分页器每页条数 默认每页25条

      checkCurrent: false, // 控制当前页全选 已弃用
      checkAll: false, // 控制所有页全选 已弃用
      checkedTransferNo: [], // 选中的单号
      multipleTable: [],
      timeOptionRange: '',
      pickerOptions: {},
      loading: false, // 加载 默认不加载
      disableExport: false, // 控制导出按钮禁用 默认不禁用
      defaultDate: [], // 开单日期
      toTime: [], // 存储处理后的开单日期
      showOper: false,
      seeDraftOnly: false, // 控制只看草稿的按钮
      // showFh: false,
      // showSh: false,
      actionList: [], // 单据操作集合
      action: '',
      action2: '',
      inWarehouseList: [], // 存储调入仓库
      allWarehouseList: [], // 接口请求到的所有仓库数据
      transferNo: '' // 接收新增页传递的调拨单号
    }
  },
  async created() {
    if (sessionStorage.getItem('urlName') !== '调拨管理-调拨申请单列表页面') {
      window._paq.push(['setDocumentTitle', '调拨管理-调拨申请单列表页面'])
      window._paq.push(['trackPageView'])
      sessionStorage.setItem('urlName', '调拨管理-调拨申请单列表页面')
    }
    this.getOutWarehouse()
    this.getInWarehouse()
    this.getAllWarehouse()
    this.getdbType()
    this.getdjStatus()
    this.getdbWays()
    this.getOperator()
    this.getDefaultDate()
    this.getAllStatus()
    // 接收新增页传递的调拨单号并赋值
    const transferNo = this.$route.query.transferNo
    const isDraft = this.$route.query.isDraft
    this.searchFunc(isDraft, transferNo)
  },
  methods: {
    // 判断此件货品是否有操作信息
    hasActionCode(actionList, actionCode) {
      if (actionList && actionList.length) {
        return actionList.filter(item => item.actionCode === actionCode).length
      }
      return false
    },
    // 根据单号查询调拨单(保存草稿/确认单据跳转)
    async getTransferNoToSearch(transferNo, isDraft) {
      const res = await this.$axios.post('/bff/api/v1/transfer/_page', {
        isDraft: !!isDraft,
        transferNoList: transferNo ? [transferNo] : []
      })
      return res.data.data
    },
    // request封装
    getRequest() {
      if (this.form.time) {
        this.form['fromCreateTime'] = this.form.time[0]
        this.form['toCreateTime'] = this.form.time[1]
      }
      const request = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        isDraft: this.seeDraftOnly
      }

      if (this.form.billStatusList && this.form.billStatusList.length) {
        request.billStatusList = [this.form.billStatusList]
      }

      // 先校验用户有没有选择开单日期
      if (this.form.time) {
        if (this.form.fromCreateTime) {
          request.fromCreateTime = this.form.fromCreateTime
        }
        if (this.form.toCreateTime) {
          request.toCreateTime = this.form.toCreateTime
        }
      }

      if (this.form.inWarehouseCodeList && this.form.inWarehouseCodeList.length) {
        request.inWarehouseCodeList = [this.form.inWarehouseCodeList]
      }

      if (this.form.materialCodeList && this.form.materialCodeList.length) {
        request.materialCodeList = [this.form.materialCodeList]
      }

      if (this.form.operatorCodeList && this.form.operatorCodeList.length) {
        request.operatorCodeList = [this.form.operatorCodeList]
      }

      if (this.form.outWarehouseCodeList && this.form.outWarehouseCodeList.length) {
        request.outWarehouseCodeList = [this.form.outWarehouseCodeList]
      }

      if (this.form.productNoList && this.form.productNoList.length) {
        request.productNoList = [this.form.productNoList]
      }

      if (this.form.transferModeCodeList && this.form.transferModeCodeList.length) {
        request.transferModeCodeList = [this.form.transferModeCodeList]
      }

      if (this.form.transferNoList && this.form.transferNoList.length) {
        request.transferNoList = [this.form.transferNoList]
      }

      if (this.form.transferTypeCodeList && this.form.transferTypeCodeList.length) {
        request.transferTypeCodeList = [this.form.transferTypeCodeList]
      }
      // 增加的form项 手工单号/分货状态
      if (this.form.manualBillNo) {
        request.manualBillNo = this.form.manualBillNo
      }

      if (this.form.allocateStatus && this.form.allocateStatus.length) {
        request.allocateStatus = [this.form.allocateStatus]
      }
      return request
    },
    // 根据条件查询调拨单
    async searchTransferBill() {
      const request = this.getRequest()
      const res = await this.$axios.post('/bff/api/v1/transfer/_page', request)
      return res.data.data
    },
    // 请求总数量、总金额
    async getTotalInfo(transferNo) {
      let request
      if (transferNo) {
        request = {
          isDraft: false,
          transferNoList: transferNo ? [transferNo] : []
        }
      } else {
        request = this.getRequest()
      }
      const res = await this.$axios.post('/bff/api/v1/transfer/_agg', request)
      return res.data.data
    },
    // 查询方法
    async searchFunc(isDraft, transferNo) {
      let searchInfo
      if (transferNo) {
        searchInfo = await this.getTransferNoToSearch(transferNo, isDraft)
      } else {
        searchInfo = await this.searchTransferBill()
      }

      if (!isDraft) {
        const data = await this.getTotalInfo(transferNo)
        searchInfo.totalApplyQty = data.totalApplyQty
        searchInfo.totalApplyPrice = data.totalApplyPrice.toFixed(2)
      } else {
        this.seeDraftOnly = true
      }
      this.showTransferNoInfo(searchInfo)
    },
    // 调拨单数据展示
    async showTransferNoInfo(searchInfo) {
      this.tableData = searchInfo.list
      this.total = searchInfo.total
      this.totalApplyQty = searchInfo.totalApplyQty
      this.totalApplyPrice = searchInfo.totalApplyPrice
    },
    // 开单日期默认显示前推一周
    getDefaultDate() {
      var now = new Date()
      var time = now.getTime() - 1000 * 60 * 60 * 24 * 7
      const beg = moment(new Date(time)).format('YYYY-MM-DD')
      const end = moment(new Date()).format('YYYY-MM-DD')
      this.defaultDate = [beg, end]
      const from = beg + ' 00:00:00'
      const to = end + ' 23:59:59'
      this.toTime = [from, to]
      this.form.time = this.toTime
    },
    // 翻页
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageNum = 1
      // this.searchTransferBill()
      // 调用封装的查询方法
      this.searchFunc(this.seeDraftOnly)
    },
    // 根据每页多少条数据进行数据请求
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      // this.searchTransferBill()
      // 调用封装的查询方法
      this.searchFunc(this.seeDraftOnly)
    },
    // 操作
    async operate(actionCode, transferNo) {
      if (!actionCode) {
        return
      }
      // 取消
      if (actionCode === 'CANCEL') {
        this.$confirm('确定取消调拨申请单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer/manage', {
            transferNo: transferNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$message({
              message: '取消成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.handleCurrentChange(this.pageNum)
        })
      }
      // 确认占库结果
      if (actionCode === 'CONFIRM_OCCUPY') {
        this.$confirm('确定进行占库确认吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer/manage', {
            transferNo: transferNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$message({
              message: '占库确认成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.handleCurrentChange(this.pageNum)
        })
      }
      // 删除草稿
      if (actionCode === 'DELETE') {
        this.$confirm('确定删除该草稿吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer/manage', {
            transferNo: transferNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.handleCurrentChange(this.pageNum)
        })
      }
      // 继续编辑草稿
      if (actionCode === 'CONTINUE_EDITING_DRAFT') {
        this.$router.push({
          path: '/scm/add/',
          query: {
            info: transferNo
          }
        })
      }
      // 继续编辑单据
      if (actionCode === 'CONTINUE_EDITING') {
        this.$router.push({
          path: '/scm/add/',
          query: {
            info2: transferNo
          }
        })
      }
      // 重新占库
      if (actionCode === 'RE_OCCUPY') {
        this.$confirm('确定重新占库吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer/manage', {
            transferNo: transferNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$message({
              message: '请求成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.handleCurrentChange(this.pageNum)
        })
      }
    },
    // 跳转至调拨明细
    toDetail(row) {
      this.$router.push(`/scm/detail/${row.transferNo}`)
    },
    // 请求所有仓库数据
    async getAllWarehouse() {
      const res = await this.$axios.get('/bff/api/v1/transfer/wh')
      const data = res.data.data
      this.allWarehouseList = data
    },
    // 调出仓库
    async getOutWarehouse() {
      const res = await this.$axios.get('/bff/api/v1/transfer/wh')
      const outWarehouseList = res.data.data
      outWarehouseList.map(item => {
        item['value'] = item.warehouseCode
        item['value2'] = item.externalWarehouseCode
        item['label'] = item.warehouseName
      })
      for (var i = 0; i < outWarehouseList.length; i++) {
        this.options1.push({
          value: outWarehouseList[i].value,
          value2: outWarehouseList[i].value2,
          label: outWarehouseList[i].label
        })
      }
    },
    // 调入仓库
    async getInWarehouse() {
      const res = await this.$axios.get('/bff/api/v1/transfer/wh')
      const inWarehouseList = res.data.data
      inWarehouseList.map(item => {
        item['value'] = item.warehouseCode
        item['value2'] = item.externalWarehouseCode
        item['label'] = item.warehouseName
      })
      for (var i = 0; i < inWarehouseList.length; i++) {
        this.options2.push({
          value: inWarehouseList[i].value,
          value2: inWarehouseList[i].value2,
          label: inWarehouseList[i].label
        })
      }
    },
    // 远程搜索调出仓库
    async remoteSearchOutWarehouse(query) {
      const allWarehouse = this.allWarehouseList
      const remoteWarehouse = allWarehouse.map(item => {
        return {
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode
        }
      })
      if (query.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options1 = remoteWarehouse.filter(item => {
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
      return this.options1
    },
    // 清除选中的调出仓库
    clearOutWarehouse() {
      const allWarehouse = this.allWarehouseList
      const remoteWarehouse = allWarehouse.map(item => {
        return {
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode
        }
      })
      this.options1 = remoteWarehouse
    },
    // 远程搜索调入仓库
    remoteSearchInWarehouse(query) {
      const allWarehouse = this.allWarehouseList
      const remoteWarehouse = allWarehouse.map(item => {
        return {
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode
        }
      })
      if (query.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options2 = remoteWarehouse.filter(item => {
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
      return this.options2
    },
    // 清除选中的调入仓库
    clearInWarehouse() {
      const allWarehouse = this.allWarehouseList
      const remoteWarehouse = allWarehouse.map(item => {
        return {
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode
        }
      })
      this.options2 = remoteWarehouse
    },
    // 调拨类型
    async getdbType() {
      const res = await this.$axios.get('/bff/api/v1/dict/type?typeCode=inventory_transfer_type')
      const transferType = res.data.data
      transferType.map(item => {
        item['value'] = item.dictCode
        item['label'] = item.dictValue
      })
      for (var i = 0; i < transferType.length; i++) {
        this.options3.push({
          value: transferType[i].value,
          label: transferType[i].label
        })
      }
    },
    // 单据状态
    async getdjStatus() {
      const res = await this.$axios.get('/bff/api/v1/dict/type?typeCode=transfer_bill_status')
      const djStatus = res.data.data
      djStatus.map(item => {
        item['value'] = item.dictCode
        item['label'] = item.dictValue
      })
      for (var i = 0; i < djStatus.length; i++) {
        this.options4.push({
          value: djStatus[i].value,
          label: djStatus[i].label
        })
      }
    },
    // 分货状态
    async getAllStatus() {
      const res = await this.$axios.get('/bff/api/v1/dict/type?typeCode=inventory_auto_allocation_status_type')
      this.allocateStatusList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },
    // 调拨方式
    async getdbWays() {
      const res = await this.$axios.get('/bff/api/v1/transfer/modes')
      const dbWays = res.data.data
      dbWays.map(item => {
        item['value'] = item.transferModeCode
        item['label'] = item.transferModeName
      })
      for (var i = 0; i < dbWays.length; i++) {
        this.options5.push({
          value: dbWays[i].value,
          label: dbWays[i].label
        })
      }
    },
    // 操作员
    async getOperator() {
      try {
        const res = await this.$api.userFetchList({ page: 1, limit: 1000 })
        this.options6 = res.data.list
      } catch (error) {
        console.log(error, 222)
      }
    },
    // 展开查看所有字段
    showMore() {
      this.show = true
    },
    // 收起
    closeMore() {
      this.show = false
    },
    // 跳转至调拨新增
    toAdd() {
      this.$router.push({ name: 'ScmAdd', params: {}})
      // const params = {
      //   bill_no: '',
      //   allocateModeCode: '',
      //   allocateTypeCode: '',
      //   allocatePriority: '',
      //   fromWarehouseCode: '',
      //   toWarehouseCode: '',
      //   operatorCode: '',
      //   operatorType: '',
      //   remark: '',
      //   allocateDetailList: {
      //     barCode: '',
      //     retailPrice: '',
      //     applyQty: ''
      //   }
      // }
      // this.$axios.post('/bff/api/v1/allocate', params).then(res => {
      //   const data2 = res.data.data
      //   console.log(data2, '222222')
      // })
    },
    // 获取用户勾选的数据
    selsChange(sels) {
      this.sels = sels
    },
    selectCurrentPage(val) {
      this.checkedTransferNo = val ? this.tableData : []
    },
    // 导出
    Export(form) {
      this.form['fromCreateTime'] = this.form.time[0]
      this.form['toCreateTime'] = this.form.time[1]
      const request = {
        billStatusList: form.billStatusList ? [form.billStatusList] : [],
        outWarehouseCodeList: form.outWarehouseCodeList ? [form.outWarehouseCodeList] : [],
        operatorCodeList: form.operatorCodeList ? [form.operatorCodeList] : [],
        transferModeCodeList: form.transferModeCodeList ? [form.transferModeCodeList] : [],
        transferNoList: form.transferNoList ? [form.transferNoList] : [],
        transferTypeCodeList: form.transferTypeCodeList ? [form.transferTypeCodeList] : [],
        fromCreateTime: form.fromCreateTime ? form.fromCreateTime : '',
        toCreateTime: form.toCreateTime ? form.toCreateTime : '',
        // 增加的表单项
        allocateStatus: form.allocateStatus ? [form.allocateStatus] : [],
        manualBillNo: form.manualBillNo ? form.manualBillNo : ''
      }
      const that = this
      this.disableExport = true
      this.$axios({
        method: 'post',
        url: `/bff/api/v1/transfer/_export`,
        data: request
        // responseType: 'blob'
      }).then(res => {
        that.disableExport = false
        if (res.data.code) {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        const blob = new Blob(['\ufeff' + res.data], { type: 'text/csv;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '库存查询导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // toDetail(row) {
    //   this.$router.push({ name: 'ScmDetail', params: {}})
    //   this.dangqian = row
    //   console.log(this.dangqian, 'dddddddddddd')
    // },
    applyCancel() {
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
.list-box {
  display: block;
  width:100%;
  padding: 15px 40px;
}
/* .mr{
  margin: 10px 0;
} */
.blue-line{
  width: 15px;
  font-weight: 900;
  color: blue;
  display: inline-block;
}
.searchBox {
  margin-top: 10px;
  /* margin-bottom: 10px; */
  padding: 15px 15px 0px 10px;
  border: 1px solid #efefef;
  border-radius: 4px;
}
.showbox {
  margin-top: 10px;
}
.list-pages {
  overflow: hidden;
  text-align: right;
}
</style>

