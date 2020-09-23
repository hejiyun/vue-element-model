<template>
  <el-container class="order-box">
    <el-col :span="24" class="mt">
      <el-form ref="form" :model="form" label-width="80px" label-position="left">
        <el-form-item label="货号" style="width: 25%;">
          <el-input v-model="form.code" placeholder="请输入货号" />
        </el-form-item>
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="只看全部占用" name="type"/>
          <el-checkbox label="只看部分占用" name="type"/>
          <el-checkbox label="只看占用失败" name="type"/>
          <el-button type="primary" icon="el-icon-search" style="margin-left:20px" @click="searchProduct">查询</el-button>
        </el-checkbox-group>
      </el-form>
    </el-col>
    <el-table
      v-loading="loading"
      :data="tableData"
      :height="`calc(100vh - 270px)`"
      :header-cell-style="{background: '#204060', color: 'white'}"
      align="center"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        :selectable="selectable"
        type="selection"
        width="55"/>
      <el-table-column
        prop="warehouseName"
        label="仓库名称"
        width="180"/>
      <el-table-column
        prop="productCode"
        label="货号"
        width="100"/>
      <el-table-column
        prop="brandValue"
        label="品牌"
        width="180"/>
      <el-table-column
        prop="productYear"
        label="年份"
        width="100"/>
      <el-table-column
        prop="productSeasonValue"
        label="季节"
        width="80"/>
      <el-table-column
        prop="productTypeValue"
        label="类别"
        width="90"/>
      <el-table-column
        prop="sexValue"
        label="性别"
        width="100"/>
      <el-table-column
        prop="colorValue"
        label="颜色名称"
        width="100"/>
      <el-table-column
        prop="planListingDate"
        label="上市日期"
        width="150"/>
      <el-table-column
        prop="productSeriesValue"
        label="系列"
        width="100"/>
      <el-table-column
        prop="productProjectValue"
        label="项目"
        width="100"/>
      <el-table-column
        prop="productShortName"
        label="货品简称"
        width="100"/>
      <el-table-column
        prop="retailPrice"
        label="零售价"
        width="100"/>
      <el-table-column
        prop="sizeCode"
        label="尺码"
        width="100"/>
      <el-table-column
        prop="cutAmount"
        label="切货数量"
        width="140"/>
      <el-table-column
        prop="occupyQty"
        label="占用库存数量"
        width="180"/>
      <el-table-column
        label="可发货数量(双击修改)"
        width="140">
        <template slot-scope="scope">
          <div
            v-if="index !== scope.$index"
            style="width: 100%;height: 100%"
            @dblclick="editNumber(scope.$index, scope.row)" >
            {{ scope.row.deliverableQty }}
          </div>
          <el-input
            v-if="index === scope.$index && scope.row.logicDelete === 0"
            v-model="scope.row.deliverableQty"
            @keyup.enter.native="hiddenInput(scope.row)"
            @blur="hiddenInput(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.logicDelete === 0"
            size="mini"
            type="danger"
            @click="openDel(scope.row)">删除</el-button>
          <el-button
            v-if="scope.row.logicDelete === 1"
            size="mini"
            type="primary"
            @click="toggleDel(scope.row)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="page-box">
      <el-col :span="12" :offset="12">
        <page-common
          ref="page"
          :page-size-list="[50, 100]"
          :default-parameters="params"
          api= "/bff/b2b/api/v1/occupyInventory"
          method="post"
          @query="query"
          @loading="load"
        />
      </el-col>
    </el-col>
    <el-dialog
      :visible.sync="dialogVisible"
      title="温馨提示"
      width="30%">
      <span>您确认需要删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Del(deleteId)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible1"
      title="温馨提示"
      width="30%">
      <span>您确认需要选中项删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="AllDel(multipleSelection)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="确认订单修改内容"
      width="60%"
      center>
      <el-table
        :data="changeList"
        :row-style="tableRowClassName"
        :cell-style="tableCellStyle"
        align="center"
        height="300"
        border
        style="width: 100%">
        <el-table-column
          prop="productCode"
          label="货号"
          width="100"/>
        <el-table-column
          prop="brandValue"
          label="品牌"/>
        <el-table-column
          prop="productYear"
          label="年份"
          width="100"/>
        <el-table-column
          prop="productSeasonValue"
          label="季节"
          width="80"/>
        <el-table-column
          prop="productTypeValue"
          label="类别"
          width="90"/>
        <el-table-column
          prop="productShortName"
          label="货品简称"
          width="100"/>
        <el-table-column
          prop="retailPrice"
          label="零售价"
          width="100"/>
        <el-table-column
          prop="sizeCode"
          label="尺码"
          width="100"/>
        <el-table-column
          prop="occupyQty"
          label="占用库存数量"
          width="120"/>
        <el-table-column
          prop="deliverableQty"
          label="可发货数量"
          width="100"/>
        <el-table-column
          prop="highlight"
          label="修改内容"
          width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.logicDelete !== 1 && scope.row.changeNum">修改数量</span>
            <span v-else>删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="2" style="margin-top:20px;font-size:18px">汇总:</el-col>
      <el-col :span="22" style="margin-top:10px;font-size:18px">
        <el-col :span="12">
          <p><span>总删除条数 </span><span> {{ DelAmount }}</span></p>
        </el-col>
        <el-col :span="12">
          <p><span>总修改条数 </span><span> {{ EditAmount }}</span></p>
        </el-col>
        <el-col :span="12">
          <p><span>修改后订单占库总金额 </span><span>{{ EditAmountTotal.toFixed(2) }}</span></p>
        </el-col>
        <el-col :span="12">
          <p><span>修改后订单占库总数量 </span><span> {{ EditOccupyAmount }}</span></p>
        </el-col>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="trueUpdata">确 定</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-col :span="24" class="mt">
      <el-button v-preventReClick type="danger" @click="opendDek(multipleSelection)">删除选中项</el-button>
      <el-button type="primary" @click="sumMoney">提交修改</el-button>
      <el-button type="primary" @click="rebackUpdata">撤销修改</el-button>
    </el-col>
  </el-container>
</template>

<script>

import PageCommon from '@/components/PageCommon'
export default {
  name: 'EditOrder',
  components: {
    PageCommon
  },
  data() {
    return {
      loading: false,
      DelAmount: '',
      EditAmount: '',
      EditAmountTotal: 0,
      EditOccupyAmount: '',
      index: '',
      dialogVisible: false,
      dialogVisible1: false,
      centerDialogVisible: false,
      deleteId: '',
      getFlag: false,
      params: {
        orderNo: this.$route.params.id
      },
      form: {
        type: [],
        code: ''
      },
      checkOptions: [{
        name: '只看全部占用',
        trueName: 'TOTAL_OCCUPY'
      }, {
        name: '只看部分占用',
        trueName: 'PART_OCCUPY'
      }, {
        name: '只看占用失败',
        trueName: 'OCCUPY_FAILURE'
      }],
      tableData: [],
      multipleSelection: [],
      changeList: [],
      occupyQtyTotal: '',
      occupyAmountTotal: ''
    }
  },
  async created() {
    const res = await this.$api.orderDetail(this.$route.params.id)
    this.occupyQtyTotal = res.data.data.occupyQtyTotal
    this.occupyAmountTotal = res.data.data.occupyAmountTotal
  },
  methods: {
    sumMoney() {
      this.changeList.map(item => {
        if (item.changeNum && item.logicDelete === 0) {
          // 当changeList数组中包含不删除,但反复修改后依然为原数值的元素时, 此时将它从changeList数组中删除
          if (item.occupyQty === parseInt(item.deliverableQty)) {
            this.changeList = this.changeList.filter(e => e.id !== item.id)
          }
        }
        if (!item.changeNum && item.logicDelete === 0) {
          // 当changeList数组中包含反复删除并恢复,最终表现为0状态,但不修改的元素时,此时将它从changeList数组中删除
          this.changeList = this.changeList.filter(e => e.id !== item.id)
        }
      })
      if (this.changeList.length === 0) {
        this.$notify({
          title: '提示',
          message: '没有修改条目',
          duration: 2000
        })
        return
      }
      this.centerDialogVisible = true
      // 获取删除和修改条数
      const arr = [] // 删除数组
      const arr1 = [] // 修改数组
      this.changeList.map(item => {
        if (item.logicDelete === 1) {
          // 删除数组 (包含即删除又修改)
          arr.push(item)
        } else {
          // 修改数组
          arr1.push(item)
        }
      })
      this.DelAmount = arr.length
      this.EditAmount = arr1.length
      // 获取修改后订单占库总数量 = 占库总数 - (删除数组中的占库总数 + 修改数组中的差值总数)
      let AmountDel = 0
      let AmountEdit = 0
      let AmountDelTotal = 0
      let AmountEditTotal = 0
      arr.map(item => {
        // 删除数组占库总和
        AmountDel += item.occupyQty
        // 删除数组的总金额
        AmountDelTotal += (item.discount * item.retailPrice) * (item.occupyQty)
      })
      arr1.map(item => {
        AmountEdit += (item.occupyQty - item.deliverableQty)
        // 修改数组的差值总额
        AmountEditTotal += (item.discount * item.retailPrice) * (item.occupyQty - item.deliverableQty)
      })
      // 修改后占库总数量
      this.EditOccupyAmount = this.occupyQtyTotal - (AmountEdit + AmountDel)
      // 修改后占库总金额 = 占库总金额 - 修改金额
      this.EditAmountTotal = this.occupyAmountTotal - (AmountEditTotal + AmountDelTotal)
    },
    tableCellStyle(data) {
      if (data.columnIndex === 9 && data.row.changeNum === 1) {
        return 'color:red'
      } else {
        return ''
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.changeNum === 1) {
        return 'background:oldlace'
      } else {
        return 'background:#f0f9eb'
      }
    },
    opendDek(arr) {
      if (arr.length === 0) {
        this.$notify({
          title: '错误',
          message: '请选择删除项',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.dialogVisible1 = true
    },
    selectable(row) {
      return row.logicDelete === 0
    },
    query(data) {
      data.map((item) => { item.planListingDate = item.planListingDate.substring(0, 11) })
      this.tableData = data
    },
    load(status) {
      this.loading = status
    },
    openDel(row) {
      this.dialogVisible = true
      this.deleteId = row
    },
    toggleDel(row) {
      row.logicDelete = 0
      this.addItem(row)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async AllDel(arr) {
      arr.map(item => {
        item.logicDelete = 1
        this.addItem(item)
      })
      this.dialogVisible1 = false
    },
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
      if (params.productCode === '') {
        delete params.productCode
      }
      this.getFlag = true
      this.$nextTick(() => {
        this.$refs.page.getList(params)
      })
    },
    async trueUpdata() {
      const id = this.$route.params.id
      const updataList = []
      for (var i = 0; i < this.changeList.length; i++) {
        const arr = {}
        arr['orderDetailId'] = this.changeList[i].id
        arr['deliverableQty'] = parseInt(this.changeList[i].deliverableQty)
        arr['isDelete'] = this.changeList[i].logicDelete === 1 ? 'DELETE_Y' : 'DELETE_N'
        updataList.push(arr)
      }
      const params = {
        orderNo: id,
        modificationList: updataList
      }
      if (this.changeList.length === 0) {
        this.$router.push(`/TradingPlatform/List/ListDetail/${this.$route.params.id}`)
        return
      }
      try {
        await this.$api.trueUpdata(params)
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.$router.push(`/TradingPlatform/List/ListDetail/${this.$route.params.id}`)
        // this.$refs.page.getList()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '修改失败,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    Del(row) {
      row.logicDelete = 1
      this.addItem(row)
      this.dialogVisible = false
    },
    rebackUpdata() {
      this.$router.push(`/TradingPlatform/List/ListDetail/${this.$route.params.id}`)
    },
    editNumber(index, row) {
      if (row.logicDelete === 1) {
        return
      }
      this.index = index
    },
    hiddenInput(row) {
      if (!RegExp(/^[0-9]*$/).test(row.deliverableQty)) {
        this.$notify({
          title: '错误',
          message: '可发货数量必须为数值',
          type: 'error',
          duration: 2000
        })
        row.deliverableQty = row.occupyQty
        return
      }
      if ((row.deliverableQty - row.occupyQty) > 0 || row.deliverableQty === '' || row.deliverableQty < 0) {
        row.deliverableQty = row.occupyQty
        this.$notify({
          title: '错误',
          message: '可发货数量必须小于等于占用库存数量',
          type: 'error',
          duration: 2000
        })
      } else if (row.deliverableQty === 0) {
        this.index = ''
      } else {
        row['changeNum'] = 1
        this.addItem(row)
        this.index = ''
      }
    },
    addItem(row) {
      const arr = this.changeList.filter(item => item.id === row.id)
      if (arr.length > 0) {
        for (let i = 0; i < this.changeList.length; i++) {
          if (this.changeList[i].id === arr[0].id) {
            this.changeList.splice(i, 1)
          }
        }
      }
      this.changeList.push(row)
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
.mt{
  margin-top: 30px;
}
  .page-box{
    margin-top: 8px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
  }
</style>
