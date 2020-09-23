<template>
  <div class="ChannelAllocation">
    <el-container class="stock-box">
      <el-col class="searchBox searchbg">
        <el-form ref="form" :model="form">
          <el-col>
            <el-form-item class="switchStock">
              <el-radio-group v-model="form.type" size="mini" @change="changeTips">
                <el-radio-button v-model="materialCodeList" label="materialCodeList">货号</el-radio-button>
                <el-radio-button v-model="barCodeList" label="barCodeList" style="margin-left:-2px;">条码</el-radio-button>
              </el-radio-group>
              <span style="color: red; font-size: 16px; padding-left: 4px;">*</span>
              <el-input ref="gdt" :autosize="{ minRows: 2, maxRows: 3 }" v-model="form.chooseMatOrBar" placeholder="可批量输入 以英文逗号隔开" type="textarea" @keyup.native="numLimit" @scroll="showScrollBar"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="业务类型">
              <el-select v-model="form.bizTypeList" multiple style="width:100%" placeholder="全部" @change="getTypeToChannel">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="渠道名称">
              <Select ref="sle" :channelType="channelType" :isRset="isReset" @getValue="getvalue"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="渠道可用数≥">
              <!-- 输入框事件改为input事件，监听用户输入的数字 -->
              <el-input v-model="form.minAvailableQty" class="qdInput" placeholder="请输入整数" type="number" @input="getInteger(form.minAvailableQty)"/>
            </el-form-item>
          </el-col>
          <el-col>
            <div class="grid-content bg-purple bt">
              <el-button type="primary" @click="search(form)">查询</el-button>
              <el-button :disabled="undisable" type="primary" @click="Export(form)">导出</el-button>
              <el-button type="primary" @click="reset(form)">重置</el-button>
            </div>
          </el-col>
        </el-form>

        <div class="showbox" style="color:#00ace6;cursor:pointer;margin-top:6px;text-align:right;">
          <span v-if="!show" style="text-decoration: underline" @click="showMore">展开查看商品详情
            <i class="el-icon-right"/>
          </span>
          <span v-if="show" style="text-decoration: underline" @click="closeMore">
            <i class="el-icon-back"/>
            收起
          </span>
        </div>

      </el-col>
      <el-dialog :visible.sync="dialogTableVisible2" :close-on-click-modal="false" class="neibu" title="处理完成" style="text-align:center" @close="closeinDialog">
        <p style="margin:0 0 0 -68%;color:red;">以下sku条码分配失败，请重新分配！</p>
        <el-table :data="failList" style="margin:15px 0 10px 0;" border>
          <el-table-column property="barCode" label="sku条码" width="" align="center"/>
          <el-table-column property="channelName" label="分配渠道" width="" align="center"/>
          <el-table-column property="allocatedQty" label="最终分配结果" align="center"/>
        </el-table>
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[50,100]"
          :page-size="pageSize"
          :total="gridData.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </el-dialog>
      <div class="showbox">
        <el-table
          :data="tableData"
          :header-cell-style="{background: '#204060', color: 'white'}"
          style="width: 100%"
          height="calc(100vh - 210px)"
          border
          @sort-change="getSortList">
          <af-table-column
            prop="barCode"
            label="sku条码"
            align="center"/>
          <af-table-column
            prop="materialCode"
            label="货号"
            align="center"/>
          <af-table-column
            prop="sizeTypeValue"
            label="尺码类别"
            align="center"/>
          <af-table-column
            prop="sizeName"
            label="尺码"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="brand"
            label="品牌"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="productShortName"
            label="货品简称"
            align="center"/>
          <af-table-column
            prop="bizTypeName"
            label="业务类型"
            align="center"/>
          <af-table-column
            prop="channelCode"
            label="渠道代码"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="channelName"
            label="渠道名称"
            align="center"/>
          <af-table-column
            prop="warehouseCode"
            label="仓库代码"
            align="center"/>
          <af-table-column
            prop="warehouseName"
            label="仓库名称"
            align="center"/>
          <el-table-column
            prop="availableQty"
            label="渠道可用数"
            sortable="custom"
            align="center"
            min-width="120"/>
          <el-table-column
            prop="occupiedQty"
            label="渠道占用数"
            align="center"
            min-width="100"/>
          <!-- 隐藏操作列 -->
          <!-- <el-table-column
            prop="operation"
            align="center"
            min-width="170">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row" style="padding-bottom:20px" >操作</span>
            </template>
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.input"
                :disabled="scope.row.availableQty === 0 || scope.row.isForbidden === true"
                size="mini"
                placeholder=""
                style="width:50%"/>
              <el-button :disabled="scope.row.availableQty === 0 || scope.row.isForbidden === true " type="primary" size="mini" @click="open(scope.row, form)">
                提交</el-button>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="pipeline"
            label="流水"
            align="center"
            min-width="90">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="seePipeline(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <af-table-column
            v-if="show"
            prop="colorValue"
            label="颜色"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="retailPrice"
            label="零售价"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="year"
            label="年份"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="developSeasonValue"
            label="季节"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="listingDate"
            label="上市时间"
            align="center"/>
          <af-table-column
            v-if="show"
            :show-overflow-tooltip="true"
            prop="productSeriesValue"
            label="系列"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="sexValue"
            label="性别"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="productTypeValue"
            label="类别"
            align="center"/>
          <el-table-column
            v-if="show"
            :show-overflow-tooltip="true"
            prop="productPatternValue"
            label="款型"
            align="center"
            min-width="80"/>
          <af-table-column
            v-if="show"
            prop="productProjectValue"
            label="项目"
            align="center"/>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" class="dialog_a" width="65%" top="10vh" title="库存流水日志" @close="closePipeline">
        <el-form :model="form2">
          <el-row>
            <el-col :span="10" style="margin-left:-3%">
              <el-form-item :label-width="formLabelWidth" label="流水类型:">
                <el-select v-model="value" placeholder="全部" clearable style="">
                  <el-option
                    v-for="item in streamTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="70px" label="更新时间">
                <el-date-picker
                  v-model="valueTime"
                  :default-value="defaultDate"
                  :default-time="['00:00:00', '23:59:59']"
                  type="daterange"
                  range-separator="~"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="margin-left:3%">
              <el-form-item>
                <el-button type="primary" size="mini" style="margin-left:10px" @click="handleCurrentChange(1)">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="pipelineData"
          border
          height="350">
          <af-table-column
            prop="id"
            label="流水号"
            width=""
            align="center"/>
          <af-table-column
            prop="businessTypeName"
            label="流水类型"
            width=""
            align="center"/>
          <af-table-column
            prop="businessNo"
            label="业务单据号"
            width=""
            align="center"/>
          <af-table-column
            prop="adjustQty"
            label="实际调整数"
            width="90"
            align="center"/>
          <af-table-column
            prop="toOccupiedQty"
            label="渠道占用数"
            width="90"
            align="center"/>
          <af-table-column
            prop="toAvailableQty"
            label="渠道可用数"
            width="90"
            align="center"/>
          <af-table-column
            prop="createTime"
            label="时间"
            align="center"/>
          <af-table-column
            prop="remark"
            label="备注"
            align="center"
            width=""/>
        </el-table>
        <el-pagination
          :current-page="currentList.pageNum"
          :page-sizes="[10, 20, 35, 50]"
          :page-size="currentList.pageSize"
          :total="innerTotal"
          layout="total, sizes, prev, pager, next, jumper"
          style="text-align:center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </el-dialog>
      <div class="pageBar">
        <page-common
          ref="page"
          api="/bff/api/v1/channel_inventory/_page"
          method="post"
          @query="query"
          @loading="load"
        />
        <div class="mr2">
          <div v-if="showMatInfo" style="float:left;font-size:20px;" class="mcode">
            <span>输入货号共: <span style="color:red">{{ totalmCode }}</span>个。</span>
            <!-- 迭代：去除当前页面货号数显示 本次不迭代 -->
            <span>当前页面共<span style="color:red"> {{ inputCurrent }}</span>个货号,</span>
            <span>共<span style="color:red">{{ totalbCode }}</span>个数据。</span>
          </div>
          <div v-if="showBarInfo" style="float:left;font-size:20px;" class="bcode">
            <span>输入条码共: <span style="color:red">{{ totalmCode }}</span>个。</span>
            <!-- 迭代：去除当前页面条码数显示 本次不迭代 -->
            <span>当前页面共<span style="color:red">{{ inputCurrent }}</span>个条码,</span>
            <span>共<span style="color:red">{{ totalbCode }}</span>个数据。</span>
          </div>
        </div>

      </div>
    </el-container>
  </div>
</template>

<script>
import PageCommon from './PageCommon'
import Select from './searchBar/text2'
import moment from 'moment'
export default{
  name: 'ChannelAllocation',
  components: {
    PageCommon,
    Select
  },
  data() {
    return {
      isReset: false, // 渠道模糊查询重置
      currentPage: 1, // 分页器默认页数
      failList: [], // 批量下库存 分配失败条码信息table
      innerTotal: 0, // 流水查询分页器总条数
      gridData: [], // 批量下库存 分配失败信息
      dialogTableVisible: false, // 库存流水弹框显示 默认不显示
      dialogTableVisible2: false, // 批量下库存 分配失败信息弹框显示 默认不显示
      tableData: [], // 输入货号/条码查询结果table
      currentList: [],
      pipelineData: [], // 流水查询table
      undisable: false, // 导出按钮禁用状态 默认不禁用
      form: {
        chooseMatOrBar: '', // 货号/条码输入框
        type: 'materialCodeList', // 选中货号/条码查询 默认选中货号
        bizTypeList: [], // 业务类型
        channelCodeList: [], // 渠道代码
        minAvailableQty: '' // 渠道可用数
        // 这两个属性不需要初始化 会覆盖分页器显示条数
        // pageNum: 1, // 分页器默认页数
        // pageSize: 10 // 分页器每页默认条数
      },
      form2: {
        barCode: '', // 查询到的当前行的条码
        businessTypeList: [], // 业务类型
        inventoryId: '', // 库存id
        inventoryLogType: '', // 流水类型
        orderByList: [
          {
            columnName: '',
            order: 'ascending / descending'
          }
        ],
        pageNum: 0,
        pageSize: 10
      },
      pageSize: 50, // 分页器默认每页条数
      options: [], // 查询项 业务类型
      streamTypeList: [], // 流水查询的流水类型
      value: 'PHYSICAL_INVENTORY_ALLOCATION', // 流水查询默认查询实物库存分配流水
      loading: false, // 加载状态 默认false
      oldList: [], // 选中货号/条码
      show: false, // 展开/收起 默认展开
      input: '',
      showMatInfo: false, // 查询后 货号信息展示 默认不展示
      showBarInfo: false, // 查询后 条码信息展示 默认不展示
      formLabelWidth: '120px', // 表单标签宽度 默认120px
      totalbCode: '', // 点击查询按钮 查询到的总条数
      totalmCode: '', // 输入货号/条码总条数
      dangqian: {}, // 当前条码所在行的信息
      inputCurrent: '', // 当前共货号/条码多少条
      materialCodeList: [], // 货号list
      barCodeList: [], // 条码list
      xjProp: '', // 批量下库存下架比例
      dialog: false, // 批量下库存弹窗 默认不显示
      drawerChannelList: [], // 批量下库存 渠道list
      drawerChannelFilterList: [], // 过滤出的渠道数组
      channelLoading: false, // 渠道加载状态
      xjChannel: [], // 批量下库存 渠道
      defaultDate: [], // 库存流水的默认时间 默认展示近一周
      valueTime: [], // 库存流水更新时间
      showTips: false, // 批量下架超限提醒 默认不显示
      dangqian2: [], // 当前行信息
      channelType: [], // 业务类型
      distributeRole: '', // 批量分配下架方式--value
      drawerLoading: false, // 批量抽屉请求中提供加载动画
      distributeRoleList: [ // 批量分配下架方式--所有
        {
          value: 'QUANTITY',
          label: '按数量下架'
        },
        {
          value: 'PERCENTAGE',
          label: '按比例下架'
        }
      ],
      takeOffNum: '', // 下架数量
      showTipsNum: false // 下架提示文字显示状态
    }
  },
  watch: {
    tableData: function(newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  },
  async created() {
    this.getBusinessType()
    this.getPipeType()
    this.getUpDateTime()
    // 增加分配方法
    this.$axios({
      method: 'get',
      url: '/bff/api/v1/dict/type?typeCode=channel_batch_allocation_type'
    }).then(res => {
      const data = res.data.data
      data.map(item => {
        item['value'] = item.dictCode
        item['label'] = item.dictValue
      })
      console.log(data)
      this.distributeRoleList = res.data.data
    })
  },
  methods: {
    // 切换下架方式时,重置输入数值
    resetValue() {
      this.takeOffNum = ''
      this.xjProp = ''
    },
    // 重置渠道数组
    setVal() {
      if (this.xjChannel.length === 0) {
        this.drawerChannelFilterList = this.drawerChannelList
      }
    }, // 修改结束
    // 过滤渠道数组的方法
    remoteMethod(query) {
      if (query.trim() !== '') {
        this.channelLoading = true
        setTimeout(() => {
          this.channelLoading = false
          this.drawerChannelFilterList = this.drawerChannelList.filter(item => {
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item
            } else if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            } else if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.value.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            }
          })
        }, 200)
      } else {
        this.drawerChannelFilterList = this.drawerChannelList
      }
    }, // 修改结束
    async closeinDialog() {
      this.xjChannel = ''
      this.xjProp = ''
      // 增加清空分配方式与分配数量
      this.takeOffNum = ''
      this.distributeRole = '' // 修改到此结束
      this.dialogTableVisible2 = false
      this.dialog = false
      this.search(this.form)
    },
    xjTips() {
      // 增加数量判断
      var re = /^[0-9]+$/
      if (this.distributeRole === 'QUANTITY') {
        // 删除并合并多余提示
        if (parseInt(this.takeOffNum) <= 0 || !re.test(this.takeOffNum)) {
          this.showTipsNum = true
          const that = this
          setTimeout(() => {
            that.showTipsNum = false
          }, 2000)
          this.takeOffNum = ''
        } else {
          this.showTipsNum = false
        }
      } else {
        // 删除并合并多余提示
        if (parseInt(this.xjProp) > 100 || parseInt(this.xjProp) <= 0 || !re.test(this.xjProp)) {
          this.showTips = true
          const that = this
          setTimeout(() => {
            that.showTips = false
          }, 2000)
          this.xjProp = ''
        } else {
          this.showTips = false
        }
      } // 修改到此结束
    },
    async handleClose() {
      const arr = []
      this.xjChannel.map(item => {
        this.drawerChannelList.map(e => {
          if (e.channelCode === item) {
            // 此处作数量或比例修改
            if (this.distributeRole === 'QUANTITY') {
              e['qty'] = this.takeOffNum
            } else {
              e['percentage'] = this.xjProp
            } // 修改到此结束
            e['barCodes'] = e.barCodeList
            arr.push(e)
          }
        })
      })
      // 增加接口超时时间并且提供加载动画
      this.drawerLoading = true
      const res = await this.$axios.post('/bff/api/v1/channel_inventory/batch_allocation', {
        // 增加传参下架分配类型
        allocationType: this.distributeRole, // 修改到此结束
        allocationList: arr
      }, { timeout: 20000 })
      this.drawerLoading = false
      const list = res.data.data
      const returnFAILlist = list.filter(item => item.resultCode === '1')
      if (returnFAILlist.length) {
        // 处理失败
        this.dialogTableVisible2 = true
        returnFAILlist.map(item => {
          item['channelName'] = (this.drawerChannelList.filter(e => e.channelCode === item.channelCode)[0]).channelName
        })
        this.gridData = returnFAILlist
        this.failList = this.gridData
      } else {
        this.$alert('处理完成', {
          confirmButtonText: '关闭页面',
          center: true
        }).then(async() => {
          this.dialog = false
          this.xjChannel = ''
          // 增加清空分配方式与分配数量
          this.takeOffNum = ''
          this.distributeRole = '' // 修改到此结束
          this.xjProp = ''
          this.search(this.form)
        })
      }
    },
    handleCurrentChange2(val) {
      this.currentPage = val
      this.failList = []
      const st = (val - 1) * this.pageSize
      const st1 = val * this.pageSize
      this.gridData.map((item, index) => {
        if (index >= st && index < st1) {
          item.channelName = (this.drawerChannelList.filter(e => e.channelCode === item.channelCode)[0]).channelName
          this.failList.push(item)
        }
      })
    },
    async confirm(done) {
      if (this.distributeRole === 'QUANTITY') {
        const flag = this.takeOffNum && this.xjChannel.length
        if (!flag) {
          this.$message({
            showClose: true,
            message: '下架渠道和下架数量都不能为空或0！',
            type: 'error',
            duration: 1000
          })
          return
        }
      } else {
        const flag = this.xjProp && this.xjChannel.length
        if (!flag) {
          this.$message({
            showClose: true,
            message: '下架渠道和下架比例都不能为空或0！',
            type: 'error',
            duration: 1000
          })
          return
        }
      }
      this.$confirm('请再次确认是否提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.handleClose()
      })
    },
    getBusinessType() {
      var data = []
      this.$axios.get('/bff/api/v1/dict/type?typeCode=channel_biz_type').then(res => {
        data = res.data.data
        for (var i = 0; i < data.length; i++) {
          var arr = {
            value: data[i].dictCode,
            label: data[i].dictValue
          }
          this.options.push(arr)
        }
      })
    },
    async getPipeType() {
      const res1 = await this.$api.getTypeCode11()
      const data = res1.data.data
      for (var i = 0; i < data.length; i++) {
        var arr2 = {
          value: data[i].dictCode,
          label: data[i].dictValue
        }
        this.streamTypeList.push(arr2)
      }
    },
    QUXIAO() {
      this.xjChannel = ''
      this.xjProp = ''
      // 增加清空分配方式与分配数量
      this.takeOffNum = ''
      this.distributeRole = '' // 修改到此结束
      this.dialog = false
    },
    handleClose1(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.xjChannel = ''
          this.xjProp = ''
          // 增加清空分配方式与分配数量
          this.takeOffNum = ''
          this.distributeRole = '' // 修改到此结束
          done()
        })
        .catch(_ => {})
    },
    getUpDateTime() {
      var now = new Date()
      var time = now.getTime() - 1000 * 60 * 60 * 24 * 7
      const beg = moment(new Date(time)).format('YYYY-MM-DD')
      const end = moment(new Date()).format('YYYY-MM-DD')
      this.defaultDate = [beg, end]
      const from = beg + ' 00:00:00'
      const to = end + ' 23:59:59'
      this.toTime = [from, to]
      this.valueTime = this.toTime
    },
    // 查流水
    async seePipeline(ck) {
      this.dangqian2 = ck
      this.dialogTableVisible = true
      this.getUpDateTime()
      this.searchInventoryLog()
    },
    async searchInventoryLog() {
      const request = {
        inventoryLogType: 'CHANNEL',
        barCode: this.dangqian2.barCode,
        inventoryId: this.dangqian2.inventoryId,
        pageNum: this.currentList.pageNum,
        pageSize: this.currentList.pageSize
      }

      if (this.valueTime) {
        if (this.valueTime[0]) {
          request.start = this.valueTime[0]
        }
        if (this.valueTime[1]) {
          request.end = this.valueTime[1]
        }
      }

      if (this.value) {
        request.businessTypeList = [this.value]
      }
      this.$axios.post('/bff/api/v1/inventory_log/_page', request).then(res => {
        this.pipelineData = res.data.data.list
        this.innerTotal = res.data.data.total
      })
    },
    closePipeline() {
      this.value = 'PHYSICAL_INVENTORY_ALLOCATION'
      this.getUpDateTime()
      // this.pipelineData = []
      this.innerTotal = 0
    },
    async open(row, form) {
      // 深拷贝对象
      const str = JSON.stringify(form)
      const params2 = JSON.parse(str)
      const arr = []
      this.form.chooseMatOrBar.split(',').map(item => {
        item = item.replace(/[\r\n]/g, '').trim()
        if (item) {
          arr.push(item)
        }
      })
      params2[this.form.type] = arr
      delete params2['type']
      delete params2['chooseMatOrBar']
      this.dangqian = row
      const params = {
        allowShortAllocate: true,
        barCode: this.dangqian.barCode,
        channelCode: this.dangqian.channelCode,
        qty: row.input,
        sequence: row.barCode,
        warehouseCode: row.warehouseCode || ''
      }

      // if (Math.abs(params.qty) > row.availableQty) {
      //   this.$alert('', `下架库存大于当前渠道可用数，请重新填写`, {
      //     confirmButtonText: '关闭',
      //     type: 'error',
      //     center: true,
      //     showClose: false
      //   }).then(() => {
      //     this.dangqian.input = ''
      //   })
      //   return
      // }
      // 修改判断逻辑, 将负数判断逻辑改为正数
      var re = /^[0-9]+$/
      if (!re.test(params.qty) || parseInt(params.qty) <= 0) {
        this.$alert('', `输入数值异常，调整数量必须是大于0的整数`, { // 修改结束
          confirmButtonText: '关闭',
          type: 'error',
          center: true,
          showClose: false
        }).then(() => {
          this.dangqian.input = ''
        })
        return
      }

      var res
      try {
        res = await this.$api.getCaozuo(params)
      } catch (e) {
        this.$alert('', `分配失败，${e.response.data.msg}`, {
          confirmButtonText: '关闭',
          type: 'error',
          center: true,
          showClose: false
        })
        return
      }

      if (res.data.data.resultCode === '0') {
        this.$alert(`实际减少渠道库存：${Math.abs(res.data.data.allocatedQty)}`, '完成', {
          confirmButtonText: '关闭',
          type: 'success',
          center: true,
          showClose: false
        }).then(() => {
          this.dangqian.input = ''
          // 修改调用查询按钮方法
          this.search(this.form)
        })
      } else {
        this.$alert('', '分配失败', {
          confirmButtonText: '关闭',
          type: 'error',
          message: res.data.data.failReason,
          center: true,
          showClose: false
        }).then(() => {
          this.dangqian.input = ''
        })
      }
    },
    showMore() {
      this.show = true
    },
    closeMore() {
      this.show = false
    },
    getSortList(column) {
      if (column.order) {
        const data = {
          orderByList: [{
            columnName: column.prop,
            order: column.order
          }],
          channelCodeList: this.form.channelCodeList, // 渠道代码
          minAvailableQty: this.form.minAvailableQty // 渠道可用数
        }
        data[this.form.type ] = this.oldList
        this.$refs.page.getList(data)
      }
    },
    changeTips(form) {
      this.showMatInfo = false
      this.showBarInfo = false
    },
    numLimit(form) {
      this.form.chooseMatOrBar = this.form.chooseMatOrBar.replace(/，/g, ',')
    },
    showScrollBar() {
    },
    getvalue(val) {
      if (val !== '') {
        const arr = []
        val.map(item => {
          arr.push(item.value)
        })
        this.form.channelCodeList = arr
      } else {
        this.form.channelCodeList = []
      }
    },
    // 根据选中的业务类型显示相应的渠道
    async getTypeToChannel(bizTypeCode) {
      console.log(bizTypeCode)
      // 置空选择的渠道CODE
      this.form.channelCodeList = []
      // 清空选中渠道
      this.$refs.sle.clearSelection()
      // 以当前选中的渠道类型, JIT BBC B2C
      this.$refs.sle.getList('', bizTypeCode)
      this.channelType = bizTypeCode
    },
    // 批量下库存
    async reduceGoods(form) {
      const params = {
        bizTypeList: this.form.bizTypeList,
        channelCodeList: this.form.channelCodeList,
        pageNum: 1,
        pageSize: 10
      }
      if (this.form.chooseMatOrBar) {
        // 如果为一项, 会直接返回
        const arr = this.form.chooseMatOrBar.split(',')
        const arr2 = []
        arr.map(item => {
          item = item.replace(/[\r\n]/g, '').trim()
          if (item) {
            arr2.push(item)
          }
        })
        params[this.form.type] = arr2
      }
      // 每一个值判断为空
      for (const k in params) {
        if (!params[k]) {
          delete params[k]
        }
      }
      // 请求500异常统一处理
      const res = await this.$axios.post('/bff/api/v1/channel_inventory/down_info', params)
      if (res.data.data.length === 0) {
        this.$notify({
          title: '提示',
          message: '该类条码或货号暂时不支持批量分货,请重新搜索',
          duration: 2000
        })
      } else {
        const data = res.data.data
        data.map(item => {
          item['value'] = item.channelCode
          item['label'] = item.channelName
        })
        this.drawerChannelList = data
        // 同步渠道过滤数组
        this.drawerChannelFilterList = this.drawerChannelList // 修改结束
        this.dialog = true
      }
    },
    getInteger(searchInfo) {
      // 渠道可用数校验，非正整数弹出提示
      // 检验用户输入小数点的情景
      const iscontrol = new RegExp('^[1-9]([0-9])*$').test(searchInfo)
      if (searchInfo) {
        if (searchInfo < 0 || !iscontrol) {
          this.$message({
            showClose: true,
            message: '请输入正整数',
            type: 'error'
          })
        }
      }
    },
    search(form) {
      const params = { ... form }
      params[this.form.type] = this.form.chooseMatOrBar
      delete params['type']
      delete params['chooseMatOrBar']
      if (this.form.chooseMatOrBar === '') {
        this.$alert('查询时SKU条码和货号必输入一项', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      for (const k in params) {
        if (k === 'materialCodeList') {
          this.showMatInfo = true
        } else if (k === 'barCodeList') {
          this.showBarInfo = true
        }
        if (k === 'materialCodeList' || k === 'barCodeList') {
          if (params[k] === '') {
            delete params[k]
          } else {
            if (params[k]) {
              const arr = params[k].split(',') || params[k].split('，')
              const arr2 = []
              arr.map(item => {
                item = item.replace(/[\r\n]/g, '').trim()
                if (item) {
                  arr2.push(item)
                }
              })
              params[k] = arr2
            }
          }
        }
      }
      for (var k in params) {
        if (k === 'materialCodeList' || k === 'barCodeList') {
          this.oldList = params[k]
        }
      }
      this.$refs.page.getList(params)
    },
    query(data, total, input, count) {
      data.map(item => {
        item['input'] = ''
      })
      this.tableData = data
      this.totalmCode = total
      this.inputCurrent = input
      this.totalbCode = count
    },
    load(status) {
      this.loading = status
    },
    Export(params) {
      const form = { ...params }
      // form[this.form.type] = params.chooseMatOrBar
      // 处理用户输入的货号/条码的格式，去除空格、回车符等
      const arr = []
      form.chooseMatOrBar.split(',').map(item => {
        item = item.replace(/[\r\n]/g, '').trim()
        if (item) {
          arr.push(item)
        }
      })
      // 处理完毕，将处理后的数据赋给相应属性
      form[this.form.type] = arr
      delete form['type']
      delete form['chooseMatOrBar']
      for (const k in form) {
        if (k === 'materialCodeList' || k === 'barCodeList') {
          if (form[k] !== '') {
            if (form[k].indexOf(',') !== -1) {
              form[k] = form[k].split(',')
            } else {
              // 去掉嵌套的数组
              form[k] = form[k]
            }
            // if (form[k].length > 50 && k !== 'warehouseCodeList') {
            //   this.$notify({
            //     title: '提示',
            //     message: 'sku或货号最多只能支持50条导出',
            //     duration: 2000
            //   })
            //   return
            // }
          }
        }
        if (k === 'warehouseCodeList') {
          if (form[k] === '') {
            form[k] = []
          }
        }
      }
      const that = this
      this.undisable = true
      this.$axios({
        method: 'post',
        url: `/bff/api/v1/channel_inventory/_export`,
        data: form
        // responseType: 'blob'
      }).then(res => {
        that.undisable = false
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
    reset(form) {
      for (const k in form) {
        form[k] = ''
      }
      this.isReset = !this.isReset
      this.form.type = 'materialCodeList'
      this.showMatInfo = false
      this.showBarInfo = false
    },
    handleSizeChange(pageSize) {
      this.currentList.pageSize = pageSize
      this.searchInventoryLog()
    },
    // 翻页
    handleCurrentChange(pageNum) {
      this.currentList.pageNum = pageNum
      this.searchInventoryLog()
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
<style lang='scss' scoped>
  * {
    font-size: 11px;
    font-family: tahoma, arial, 宋体, sans-serif;
  }
  // 去除空隙
  .stock-box {
    display: block;
    width:100%;
    /* padding: 15px 40px; */
  }
  // 搜索框背景色为白色 增加上边框
  .searchbg {
    display: block;
    border-top: 1px solid #cdcdcd;
    background: white;
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
  // 将数据显示统计、展开收起移到右下角
  .pageBar {
    position: relative;
    background: white;
    overflow: hidden;
  }
  .mr{
    margin: 10px 0;
    position: absolute;
    right: 10px;
    top: 0px;
  }
  .mr2{
    position: absolute;
    left:10px;
    top: 10px;
  }
  .text-right{
    text-align: center;
  }
  .text-right button:last-child {
    margin-right: 5%;
  }
  .dejts{
    margin-bottom: -10px
  }
</style>
