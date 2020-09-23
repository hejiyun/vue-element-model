<template>
  <div>
    <!-- 采购单明细页 -->
    <el-container class="purchase-detail">
      <el-col :span="24">
        <el-col :span="24" class="detail-box">
          <el-col :span="6">
            <span>采购到货单号:</span><span class="to-left">{{ purchaseDetail.purchaseIncomingNo }}</span>
          </el-col>
          <el-col :span="6">
            <span>手工单号:</span><span class="major to-left">{{ purchaseDetail.manualBillNo }}</span>
          </el-col>
          <el-col :span="6">
            <span>单据生成时间:</span><span class="to-left">{{ purchaseDetail.createTime }}</span>
          </el-col>
          <el-col :span="6">
            <span>供应商名称:</span><span class="to-left">{{ purchaseDetail.supplierName }}</span>
          </el-col>
          <!-- <el-col :span="6">
            <span>分货状态:</span><span class="to-left">{{ purchaseDetail.allocateStatusName }}</span>
          </el-col> -->
        </el-col>
        <el-col :span="24" class="detail-box">
          <el-col :span="6">
            <span>入库仓库:</span><span class="to-left">{{ purchaseDetail.inWarehouseName }}</span>
          </el-col>
          <el-col :span="6">
            <span>预计到货时间:</span><span class="to-left">{{ purchaseDetail.expectIncomingTime }}</span>
          </el-col>
          <el-col :span="6">
            <span>实际到货时间:</span><span class="to-left">{{ purchaseDetail.actualIncomingTime }}</span>
          </el-col>
          <el-col :span="6">
            <span>采购到货单状态:</span><span :class="purchaseDetail.hasExceptional ? '' : 'major to-left'">{{ purchaseDetail.billStatusName }}</span>
          </el-col>
        </el-col>
        <el-col :span="24" class="detail-box">
          <el-col :span="18">
            <span>分货状态:</span><span class="to-left">{{ purchaseDetail.allocateStatusName }}</span>
          </el-col>
          <el-col :span="5" class="detail-btn">
            <el-button v-if="purchaseDetail.actionList && purchaseDetail.actionList.length > 1" type="primary" icon="el-icon-document-delete" size="mini" @click="operate('CANCEL', purchaseDetail.purchaseIncomingNo)">作废</el-button>
            <el-button v-preventReClick :disabled="disabled" type="primary" icon="el-icon-download" size="mini" @click="exportDetail">下载</el-button>
          </el-col>
        </el-col>
        <el-col :span="24" class="info">
          <el-col :span="3">
            <span>结算金额:</span><span>{{ purchaseDetail.totalExceptIncomingPrice }}</span>
          </el-col>
          <el-col :span="4">
            <span>预计到货数量:</span><span>{{ purchaseDetail.totalExceptIncomingQty }}</span>
          </el-col>
          <el-col :span="3">
            <span>吊牌额:</span><span>{{ purchaseDetail.totalExceptRetailPrice }}</span>
          </el-col>
          <el-col :span="3">
            <span>入库金额:</span><span>{{ purchaseDetail.totalActualIncomingPrice }}</span>
          </el-col>
          <el-col :span="4">
            <span>实际到货总数量:</span><span>{{ purchaseDetail.totalActualIncomingQty }}</span>
          </el-col>
          <el-col :span="3">
            <span>到货差异总数:</span><span>{{ purchaseDetail.totalIncomingDiffQty }}</span>
          </el-col>
          <el-col v-if="purchaseDetail.exceptionQty && purchaseDetail.exceptionQty > 0" :span="4" class="major">
            <span>数据异常条数:</span><span>{{ purchaseDetail.exceptionQty }}</span>
          </el-col>
        </el-col>
      </el-col>
      <div class="detail-list">
        <Table ref="table" :purchase-detail="purchaseDetail" @tableFn="tableFn"/>
      </div>
    </el-container>
  </div>
</template>
<script>
import Table from './table'
export default {
  name: 'PurchaseDetail',
  components: {
    Table
  },
  data() {
    return {
      purchaseDetail: {}, // 存储采购单据明细信息
      disabled: false // 下载按钮的禁用状态
    }
  },
  async created() {
    this.getPurchaseDetail()
  },
  methods: {
    tableFn(data) {
      this.disabled = data
    },
    async getPurchaseDetail() {
      // 采购单据明细
      const res = await this.$axios.get(`/bff/api/v1/purchase/arrive/${this.$route.params.id}`)
      this.purchaseDetail = res.data.data
    },
    // 判断此采购到货单是否有操作信息
    // hasActionCode(actionList, actionCode) {
    //   console.log(actionList, actionCode, 1111)
    //   if (actionList && actionList.length) {
    //     console.log(123333)
    //     return actionList.filter(item => item.actionCode === actionCode).length
    //   }
    //   return false
    // },
    // 操作  作废
    async operate(actionCode, purchaseNo) {
      if (!actionCode) {
        return
      }
      // 作废
      if (actionCode === 'CANCEL') {
        this.$confirm('确定作废吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/purchase/manage', {
            billNo: purchaseNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$alert('作废成功', '', {
              confirmButtonText: '关闭页面',
              type: 'success',
              center: true,
              showClose: false
            }).then(() => {
              sessionStorage.setItem('resetList', true)
              // this.$router.push('/Purchase/PurchaseList')
              this.getPurchaseDetail()
              this.$refs.table.getDetailTable()
            })
          } else {
            this.$alert('作废失败', '此单据无法作废，知悉。谢谢！', {
              confirmButtonText: '关闭页面',
              type: 'error',
              center: true,
              showClose: false
            })
          }
        })
      }
    },
    // 下载明细
    async exportDetail() {
      const that = this
      const downUrl = '/bff/api/v1/purchase/arrive/detail/_export'
      this.$axios({
        method: 'get',
        url: downUrl,
        params: {
          billNo: this.purchaseDetail.purchaseIncomingNo
        },
        responseType: 'blob',
        timeout: 300000
      }).then((res) => {
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
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '采购到货单明细.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.log(res)
      })
    }
  }
}
</script>
