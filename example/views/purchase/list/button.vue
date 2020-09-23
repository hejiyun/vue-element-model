<template>
  <!-- 列表页按钮 -->
  <div>
    <el-col :xs="24" :sm="12" :md="8" :lg="14" :xl="14">
      <el-form-item>
        <div class="btn">
          <el-button v-preventReClick type="primary" icon="el-icon-search" size="mini" @click="searchPurchaseArrivalBill">查询</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="$router.push('/Purchase/AddPurchase')">新增采购到货单</el-button>
          <el-button type="primary" icon="el-icon-upload2" size="mini" @click="batchUpload">批量导入采购到货单</el-button>
          <!-- <el-button v-preventReClick type="primary" icon="el-icon-download" size="mini" @click="exportDetail">下载明细</el-button> -->
          <!-- 批量导入弹窗 -->
          <Upload :batch-upload-visible.sync="batchUploadVisible" @refreshTable="searchPurchaseArrivalBill"/>
        </div>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item>
        <el-checkbox v-model="searchForm.hasDiff" @change="hasDiffer">是否有到货差异</el-checkbox>
        <el-checkbox v-model="searchForm.hasOverdue" @change="hasOver">是否超期未入库</el-checkbox>
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
import Upload from './batchUpload'
export default {
  components: {
    Upload
  },
  props: {
    searchForm: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    pageSize: {
      type: Number,
      default: 50
    },
    pageNum: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      batchUploadVisible: false, // 批量导入弹窗显隐 默认不显示
      totalExpand: {},
      purchaseData: [], // 列表页信息
      total: 0 // 总条数
    }
  },
  async created() {
    this.searchPurchaseArrivalBill()
  },
  methods: {
    batchUpload() {
      this.batchUploadVisible = true
    },
    // 用户选择有到货差异
    hasDiffer() {
      this.hasDiff = true
    },
    // 用户选择超期未入库
    hasOver() {
      this.hasOverdue = true
    },
    // request封装
    getRequest() {
      this.searchForm['fromCreateTime'] = this.searchForm.openingDate[0]
      this.searchForm['toCreateTime'] = this.searchForm.openingDate[1]

      if (this.searchForm.expectedArrivalDate && this.searchForm.expectedArrivalDate.length) {
        this.searchForm['fromExpectIncomingTime'] = this.searchForm.expectedArrivalDate[0]
        this.searchForm['toExpectIncomingTime'] = this.searchForm.expectedArrivalDate[1]
      }

      const request = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        fromCreateTime: this.searchForm.fromCreateTime,
        toCreateTime: this.searchForm.toCreateTime,
        orderByList: [{
          columnName: 'openingDate',
          order: 'descending'
        }]
      }
      // 采购到货单号
      if (this.searchForm.purchaseIncomingNo) {
        request.purchaseIncomingNo = this.searchForm.purchaseIncomingNo
      }

      // 入库仓库
      if (this.searchForm.inWarehouseCodeList && this.searchForm.inWarehouseCodeList.length) {
        const arr = []
        this.searchForm.inWarehouseCodeList.forEach(item => {
          arr.push(item.value)
        })
        request.inWarehouseCodeList = arr
      }

      // 供应商
      if (this.searchForm.supplierCodeList && this.searchForm.supplierCodeList.length) {
        const arr = []
        this.searchForm.supplierCodeList.forEach(item => {
          arr.push(item.value)
        })
        request.supplierCodeList = arr
      }

      // 采购到货单状态
      if (this.searchForm.billStatusList && this.searchForm.billStatusList.length) {
        request.billStatusList = this.searchForm.billStatusList
      }

      // 手工单号
      if (this.searchForm.manualBillNo) {
        request.manualBillNo = this.searchForm.manualBillNo
      }

      // 来源单号
      if (this.searchForm.sourceBillNo) {
        request.sourceBillNo = this.searchForm.sourceBillNo
      }

      // 分货状态
      if (this.searchForm.allocationStatusList && this.searchForm.allocationStatusList.length) {
        request.allocationStatusList = this.searchForm.allocationStatusList
      }

      // 提出人
      if (this.searchForm.operatorCode) {
        request.operatorCode = this.searchForm.operatorCode
      }

      // 预计到货日期
      if (this.searchForm.expectedArrivalDate) {
        if (this.searchForm.fromExpectIncomingTime) {
          request.fromExpectIncomingTime = this.searchForm.fromExpectIncomingTime
        }
        if (this.searchForm.toExpectIncomingTime) {
          request.toExpectIncomingTime = this.searchForm.toExpectIncomingTime
        }
      }

      // 是否有到货差异
      if (this.searchForm.hasDiff) {
        request.hasDiff = this.searchForm.hasDiff
      }

      // 是否超期未入库
      if (this.searchForm.hasOverdue) {
        request.hasOverdue = this.searchForm.hasOverdue
      }
      return request
    },
    // 查询采购到货单据
    searchPurchaseArrivalBill() {
      this.$nextTick(async() => {
        const request = this.getRequest()
        const createDate = new Date(request.fromCreateTime)
        const createTime = createDate.getTime()
        const createDate2 = new Date(request.toCreateTime)
        const createTime2 = createDate2.getTime()
        if (createTime2 - createTime > 365 * 24 * 60 * 60 * 1000) {
          this.$message({
            showClose: true,
            message: '请选择时间跨度为一年的开单日期',
            type: 'warning'
          })
          return
        }
        request['pageNum'] = this.pageNum
        request['pageSize'] = this.pageSize
        const res = await this.$axios.post('/bff/api/v1/purchase/arrive/_page', request)
        this.purchaseData = res.data.data.list
        this.total = res.data.data.total
        this.$emit('getPurchase', this.purchaseData, this.total)
        const res2 = await this.$axios.post('/bff/api/v1/purchase/arrive/extend/_query', request)
        if (res2) {
          this.totalExpand = res2.data.data
        }
        this.$emit('getButton', this.totalExpand)
      })
    },
    // 下载明细
    async exportDetail() {
      const request = this.getRequest()
      const createDate = new Date(request.fromCreateTime)
      const createTime = createDate.getTime()
      const createDate2 = new Date(request.toCreateTime)
      const createTime2 = createDate2.getTime()
      if (createTime2 - createTime > 7 * 24 * 60 * 60 * 1000) {
        this.$message({
          showClose: true,
          message: '请选择时间跨度为一周的开单日期',
          type: 'warning'
        })
        return
      }
      this.$axios({
        method: 'post',
        url: '/bff/api/v1/purchase/arrive/_export',
        data: request,
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
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '采购单据明细表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  }
}
</script>
