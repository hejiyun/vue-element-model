<template>
  <div>
    <!-- 采购单新增页提交组件 -->
    <el-row>
      <el-col :xs="24" :sm="12" :md="8" :lg="24" :xl="24">
        <div class="sub-btn">
          <el-button v-preventReClick type="primary" size="mini" @click="submit('addForm')">提交</el-button>
          <el-button type="primary" size="mini" @click="$router.push('/Purchase/PurchaseList')">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AddPurchase',
  props: {
    addForm: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    autoDeliveryInfo: {
      type: Array,
      default: () => []
    },
    testForm: {
      type: Function,
      default: null
    },
    objData: {
      type: Object,
      default: () => {}
    },
    resetForm: {
      type: Function,
      default: null
    },
    getPurchaseCode: {
      type: Function,
      default: null
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: this.fileList
    }
  },
  watch: {
    fileList: {
      handler(val) {
        this.list = val
      }
    },
    deep: true
  },
  methods: {
    // 提交
    async submit() {
      if (this.testForm) {
        this.testForm()
      }
    },
    async submitForm() {
      this.autoDeliveryInfo.map(item => {
        if (item.theWarehouseCode !== this.addForm.inWarehouseCode) {
          this.$message({
            message: '您所提交的自动分货的仓库与您选择的采购入库仓库不一致，请确认后再次填写。谢谢！',
            type: 'warning'
          })
        }
        return
      })
      if (!this.list.length) {
        this.$message({
          showClose: true,
          message: '您未选择文件，请选择后再提交，谢谢！',
          type: 'warning'
        })
        return
      }
      const arr = this.autoDeliveryInfo.map(item => {
        return {
          allowShortAllocate: true,
          channelCode: item.theChannelCode,
          percentage: item.thePercentage
        }
      })
      const request = {
        purchaseType: this.addForm.purchaseType,
        purchaseYear: this.addForm.purchaseYear,
        purchaseSeasonCode: this.addForm.purchaseSeasonCode,
        brandCode: this.addForm.brandCode,
        purchaseIncomingNo: this.addForm.purchaseIncomingNo,
        expectIncomingTime: this.addForm.expectIncomingTime,
        supplierCode: this.addForm.supplierCode,
        inWarehouseCode: this.addForm.inWarehouseCode,
        transportMethodCode: this.addForm.transportMethodCode,
        amountCalculationModeCode: this.addForm.amountCalculationModeCode,
        allocationList: arr.filter(item => item.percentage > 0),
        fileId: this.objData.fileId
      }

      if (this.addForm.sourceBillNo) {
        request.sourceBillNo = this.addForm.sourceBillNo
      }

      if (this.addForm.manualBillNo) {
        request.manualBillNo = this.addForm.manualBillNo
      }

      if (this.addForm.remark) {
        request.remark = this.addForm.remark
      }

      if (this.addForm.relationCompanyCode) {
        request.relationCompanyCode = this.addForm.relationCompanyCode
      }
      const res = await this.$axios.post('/bff/api/v1/purchase/arrive', request)
      if (res.data.code === '0') {
        this.$alert(`采购到货单：${this.addForm.purchaseIncomingNo}，已提交成功！系统校验结果会以钉钉消息通知给您，请您留意查收。谢谢！`, '', {
          confirmButtonText: '关闭',
          type: 'success',
          center: true,
          showClose: false,
          closeOnClickModal: false
        }).then(() => {
          this.$emit('sumbitFn', '')
          this.resetForm()
          // this.getPurchaseCode()
          this.$router.push('/Purchase/PurchaseList')
        })
      }
    }
  }
}
</script>
