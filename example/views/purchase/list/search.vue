<template>
  <el-form ref="searchForm" :model="searchForm" :rules="rules">
    <el-row>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="采购到货单" label-width="80px">
          <el-input v-model="searchForm.purchaseIncomingNo" placeholder="请输入" clearable/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="入库仓库" label-width="90px">
          <el-select
            v-model="searchForm.inWarehouseCodeList"
            class="optionWidth"
            filterable
            reserve-keyword
            multiple
            collapse-tags
            placeholder="全部">
            <div>
              <template>
                <span class="option-code">仓库代码</span>
                <span class="option-name">仓库名称</span>
              </template>
            </div>
            <el-option
              v-for="item in inWarehouseList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span class="option-show-code">{{ item.value2 }}</span>
              <span class="option-show-name">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="供应商" label-width="80px">
          <el-select v-model="searchForm.supplierCodeList" class="optionWidth" filterable reserve-keyword multiple collapse-tags placeholder="全部">
            <el-option
              v-for="item in supplierList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span class="option-show-code">{{ item.value }}</span>
              <span class="option-show-name">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="采购到货单状态" label-width="110px">
          <el-select v-model="searchForm.billStatusList" class="optionWidth" filterable reserve-keyword multiple collapse-tags placeholder="全部">
            <el-option
              v-for="item in purchaseArrivalStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="手工单号" label-width="80px">
          <el-input v-model="searchForm.manualBillNo" placeholder="请输入" clearable/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="来源单号" label-width="90px">
          <el-input v-model="searchForm.sourceBillNo" placeholder="请输入" clearable/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="分货状态" label-width="80px">
          <el-select v-model="searchForm.allocationStatusList" class="optionWidth" filterable reserve-keyword multiple collapse-tags placeholder="全部">
            <el-option
              v-for="item in deliveryStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="提出人" label-width="110px">
          <el-select
            v-model="searchForm.operatorCode"
            clearable
            style="width: 100%;"
            placeholder="请选择">
            <el-option
              v-for="item in operatorList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="开单日期" label-width="80px" prop="openingDate">
          <el-date-picker
            v-model="searchForm.openingDate"
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
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item label="预计到货日期" label-width="90px">
          <el-date-picker
            v-model="searchForm.expectedArrivalDate"
            type="daterange"
            range-separator="~"
            format="yyyy-MM-dd"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      searchForm: {
        purchaseIncomingNo: '', // 采购到货单
        inWarehouseCodeList: [], // 入库仓库
        supplierCodeList: [], // 供应商
        billStatusList: [], // 采购到货单状态
        manualBillNo: '', // 手工单号
        sourceBillNo: '', // 来源单号
        allocationStatusList: [], // 分货状态
        operatorCode: '', // 提出人
        openingDate: [], // 开单日期
        expectedArrivalDate: [], // 预计到货日期
        hasDiff: false, // 是否有到货差异 默认为否
        hasOverdue: false // 是否超期未入库 默认为否
      },
      supplierList: [], // 供应商List
      inWarehouseList: [], // 入库仓库List
      purchaseArrivalStatusList: [], // 采购到货单状态List
      deliveryStatusList: [], // 分货状态List
      operatorList: [], // 提出人List
      defaultDate: [], // 开单日期默认值
      rules: {
        openingDate: [
          { required: true, message: '请选择开单日期', trigger: 'change' }
        ]
      }
    }
  },
  async created() {
    this.getDefaultDate() // 获取开单日期 近一周
    // this.searchPurchaseArrivalBill() // 默认展示近一周数据
    this.getInwarehouse() // 获取入库仓库
    this.getSupplier() // 获取客商信息
    this.getOperator() // 获取提出人
    this.getPurchaseArrivalStatus() // 获取采购到货单状态
    this.getDeliveryStatus() // 获取分货状态
  },
  methods: {
    // 获取默认的开单日期
    getDefaultDate() {
      var now = new Date()
      var time = now.getTime() - 1000 * 60 * 60 * 24 * 7
      const beg = moment(new Date(time)).format('YYYY-MM-DD')
      const end = moment(new Date()).format('YYYY-MM-DD')
      this.defaultDate = [beg, end]
      const from = beg + ' 00:00:00'
      const to = end + ' 23:59:59'
      this.searchForm.openingDate = [from, to]
    },
    // 获取入库仓库List
    async getInwarehouse() {
      const res = await this.$axios.get('/bff/api/v1/warehouses')
      console.log(res, '入库仓库')
      this.inWarehouseList = res.data.data.warehouseList.map(item => {
        return {
          value: item.warehouseCode,
          label: item.warehouseName,
          value2: item.externalWarehouseCode
        }
      })
    },
    // 获取供应商List
    async getSupplier() {
      const res = await this.$axios.get('/bff/api/v1/vend-cust?vendCusts=supplier')
      console.log(res, '客商信息')
      this.supplierList = res.data.data.map(item => {
        return {
          value: item.vendCustCode,
          label: item.vendCustName
        }
      })
    },
    // 获取采购到货单状态List
    async getPurchaseArrivalStatus() {
      const res = await this.$axios.get('/bff/api/v1/dict/type?typeCode=purchase_arrive_bill_status_type')
      console.log(res, '采购到货单状态')
      this.purchaseArrivalStatusList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },
    // 获取分货状态List
    async getDeliveryStatus() {
      const res = await this.$axios.get('/bff/api/v1/dict/type?typeCode=inventory_auto_allocation_status_type')
      console.log(res, '分货状态')
      this.deliveryStatusList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },
    // 获取提出人List
    async getOperator() {
      const res = await this.$axios.get('/bff/api/v1/log/operators?resourceCode=purchaseArriveCreate')
      console.log(res, '提出人')
      this.operatorList = res.data.data.map(item => {
        return {
          value: item.operatorCode,
          label: item.operatorName
        }
      })
    }
  }
}
</script>
