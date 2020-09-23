<template>
  <!-- 列表页table -->
  <div>
    <el-table
      :data="purchaseData"
      :header-cell-style="{background: '#204060', color: 'white'}"
      style="width: 100%"
      height="calc(100vh - 270px)"
      border>
      <el-table-column
        prop="actionName"
        label="操作"
        align="center"
        width="130">
        <template slot-scope="scope">
          <el-button v-if="hasActionCode(scope.row.actionList, 'CANCEL')" type="text" class="action" @click="operate('CANCEL', scope.row.purchaseIncomingNo)">作废</el-button>
          <el-button v-if="hasActionCode(scope.row.actionList, 'LOG_QUERY')" type="text" class="action" @click="operate('LOG_QUERY', scope.row.purchaseIncomingNo)">日志查看</el-button>
        </template>
      </el-table-column>
      <af-table-column
        prop="purchaseIncomingNo"
        label="采购到货单"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" class="action" @click="$router.push(`/Purchase/PurchaseDetail/${scope.row.purchaseIncomingNo}`)">{{ scope.row.purchaseIncomingNo }}</el-button>
        </template>
      </af-table-column>
      <af-table-column
        prop="createTime"
        label="开单时间"
        align="center"/>
      <!-- <af-table-column
        prop="brandName"
        label="品牌"
        align="center"/> -->
      <el-table-column
        :show-overflow-tooltip="true"
        prop="manualBillNo"
        label="手工单号"
        align="center"
        width="200px"/>
      <af-table-column
        prop="sourceBillNo"
        label="来源单号"
        align="center"/>
      <af-table-column
        prop="inWarehouseName"
        label="入库仓库"
        align="center"/>
      <af-table-column
        prop="supplierName"
        label="供应商"
        align="center"/>
      <af-table-column
        prop="totalExceptIncomingPrice"
        label="结算金额"
        align="center"/>
      <af-table-column
        prop="totalExceptIncomingQty"
        label="预计到货数量"
        align="center"/>
      <af-table-column
        prop="totalExceptRetailPrice"
        label="吊牌额"
        align="center"/>
      <af-table-column
        prop="expectIncomingTime"
        label="预计到货时间"
        align="center"/>
      <af-table-column
        prop="totalActualIncomingPrice"
        label="入库金额"
        align="center"/>
      <af-table-column
        prop="totalActualIncomingQty"
        label="实际到货数量"
        align="center"/>
      <af-table-column
        prop="actualIncomingTime"
        label="实际到货日期"
        align="center"/>
      <af-table-column
        prop="totalIncomingDiffQty"
        label="到货差异数量"
        align="center"/>
      <!-- <af-table-column
        prop="overdueDay"
        label="超期未到天数"
        align="center"/> -->
      <af-table-column
        prop="billStatusName"
        label="采购到货单状态"
        align="center"/>
      <af-table-column
        prop="allocateStatusName"
        label="分货状态"
        align="center"/>
      <af-table-column
        prop="operatorName"
        label="提交人"
        align="center"/>
      <af-table-column
        prop="remark"
        label="备注"
        align="center"/>
    </el-table>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="40%" title="操作日志查看" center border>
      <el-table :data="logData" border>
        <el-table-column property="updateTime" label="操作时间" align="center"/>
        <el-table-column property="operatorName" label="操作人" align="center"/>
        <el-table-column property="operatorTypeName" label="操作事项" align="center"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    getSearchMethod: {
      type: Function,
      default: null
    },
    purchaseList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      purchaseData: this.purchaseList, // 采购单table列表
      logData: [], // 采购单日志data
      dialogTableVisible: false // 采购单日志弹框 默认不显示
    }
  },
  watch: {
    purchaseList(val) {
      this.purchaseData = val
    }
  },
  created() {
  },
  methods: {
    // 判断此采购到货单是否有操作信息
    hasActionCode(actionList, actionCode) {
      if (actionList && actionList.length) {
        return actionList.filter(item => item.actionCode === actionCode).length
      }
      return false
    },
    // 操作  作废/日志查看
    async operate(actionCode, purchaseNo) {
      const that = this
      if (!actionCode) {
        return
      }
      // 作废
      if (actionCode === 'CANCEL') {
        that.$confirm('确定作废吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(async() => {
          try {
            const res = await that.$axios.post('/bff/api/v1/purchase/manage', {
              billNo: purchaseNo,
              action: actionCode
            })
            if (res.data.code === '0') {
              that.$alert('作废成功', '', {
                confirmButtonText: '关闭页面',
                type: 'success',
                center: true,
                showClose: false
              })
              that.getSearchMethod()
            } else {
              that.$alert(res.data.msg, {
                confirmButtonText: '关闭页面',
                type: 'error',
                center: true,
                showClose: false
              })
            }
          } catch (error) {
            that.$alert(error.response.data.msg, {
              confirmButtonText: '关闭页面',
              type: 'error',
              center: true,
              showClose: false
            })
          }
        })
      }
      // 日志查看
      if (actionCode === 'LOG_QUERY') {
        that.dialogTableVisible = true
        try {
          const res = await that.$axios.get(`/bff/api/v1/scm/bill_log/_list?billNo=${purchaseNo}`)
          if (res.data.code === '0') {
            that.logData = res.data.data
          } else {
            that.$alert(res.data.msg, {
              confirmButtonText: '关闭页面',
              type: 'error',
              center: true,
              showClose: false
            })
          }
        } catch (error) {
          that.$alert(error.response.data.msg, {
            confirmButtonText: '关闭页面',
            type: 'error',
            center: true,
            showClose: false
          })
        }
      }
    }
  }
}
</script>
