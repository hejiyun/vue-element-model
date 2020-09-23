<template>
  <div>
    <el-table
      :data="purchaseDetailData"
      :header-cell-style="{background: '#204060', color: 'white'}"
      style="width: 100%;"
      height="calc(100vh - 200px)"
      border>
      <af-table-column
        prop="materialCode"
        label="货号"
        align="center"/>
      <af-table-column
        prop="sizeName"
        label="尺码"
        align="center"/>
      <af-table-column
        prop="productNo"
        label="条码"
        align="center"/>
      <af-table-column
        prop="exceptIncomingQty"
        label="预计到货数量"
        align="center"/>
      <af-table-column
        prop="discountRate"
        label="折扣"
        align="center"/>
      <af-table-column
        prop="price"
        label="采购单价"
        align="center"/>
      <af-table-column
        prop="totalExceptIncomingPrice"
        label="结算金额"
        align="center"/>
      <af-table-column
        prop="totalRetailPrice"
        label="吊牌额"
        align="center"/>
      <af-table-column
        prop="actualIncomingQty"
        label="实际到货数量"
        align="center"/>
      <af-table-column
        prop="totalActualIncomingPrice"
        label="入库金额"
        align="center"/>
      <af-table-column
        prop="incomingDiffQty"
        label="到货差异数量"
        align="center"
        class-name="ex-reason"/>
      <el-table-column
        v-if="purchaseDetailInfo['exceptionQty'] && purchaseDetailInfo['exceptionQty'] > 0"
        :show-overflow-tooltip="true"
        prop="exceptionalDetail"
        label="异常原因"
        align="center"
        class-name="ex-reason"
        width="200px"/>
      <af-table-column
        prop="productShortName"
        label="货品简称"
        align="center"/>
      <af-table-column
        prop="listingDate"
        label="上市日期"
        align="center"/>
      <af-table-column
        prop="retailPrice"
        label="吊牌价"
        align="center"/>
      <af-table-column
        prop="brand"
        label="品牌"
        align="center"/>
      <af-table-column
        prop="colorValue"
        label="颜色"
        align="center"/>
      <af-table-column
        prop="productTypeValue"
        label="类别"
        align="center"/>
      <af-table-column
        prop="year"
        label="年份"
        align="center"/>
      <af-table-column
        prop="developSeasonValue"
        label="季节"
        align="center"/>
      <af-table-column
        prop="productSeriesValue"
        label="系列"
        align="center"/>
      <af-table-column
        prop="jit"
        label="JIT"
        align="center"/>
      <af-table-column
        prop="bbc"
        label="BBC"
        align="center"/>
      <af-table-column
        prop="b2c"
        label="B2C"
        align="center"/>
    </el-table>
    <div>
      <el-pagination
        :page-sizes="[50, 100, 200]"
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        style="text-align: right;"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseDetail',
  props: {
    purchaseDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      purchaseDetailData: [], // 采购到货单明细列表信息
      total: 0, // 分页器总条数， 默认为0
      pageNum: 1, // // 当前页数 默认第一页
      pageSize: 50, // 分页器每页条数 默认每页50条
      purchaseDetailInfo: this.purchaseDetail
    }
  },
  watch: {
    purchaseDetail(val) {
      this.purchaseDetailInfo = val
    },
    deep: true
  },
  async mounted() {
    this.getDetailTable()
  },
  methods: {
    async getDetailTable() {
      // 分页查询采购单据明细
      const request = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        purchaseIncomingNo: this.$route.params.id
      }
      const res = await this.$axios.post('/bff/api/v1/purchase/arrive/detail/_page', request)
      this.purchaseDetailData = res.data.data.list
      this.total = res.data.data.total
      if (this.total > 2000) {
        this.$emit('tableFn', true)
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageNum = 1
      this.getDetailTable()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.getDetailTable()
    }
  }
}
</script>
