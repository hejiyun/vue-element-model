<template>
  <!-- 采购列表分页器 -->
  <div>
    <div>
      <span class="total">汇总：</span>
      <span class="total">结算金额：{{ totalExceptIncomingPrice }}</span>
      <span class="total num">预计到货数量：{{ totalExceptIncomingQty }}</span>
      <span class="total num">吊牌额：{{ totalExceptRetailPrice }}</span>
    </div>
    <el-pagination
      :page-sizes="[50, 100, 200]"
      :page-size="pageSize"
      :current-page="pageNum"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      class="list-page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
export default {
  props: {
    getSearchMethod: {
      type: Function,
      default: null
    },
    totalExpand: {
      type: Object,
      default: () => {}
    },
    totalNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      total: this.totalNum, // 分页器总条数， 默认为0
      pageNum: 1, // 分页器当前页数 默认第一页
      pageSize: 50, // 分页器每页条数 默认每页50条
      totalExpandInfo: this.totalExpand, // 扩展信息
      totalExceptIncomingPrice: 0, // 结算金额
      totalExceptIncomingQty: 0, // 预计到货数量
      totalExceptRetailPrice: 0 // 吊牌额
    }
  },
  watch: {
    totalNum(val) {
      this.total = val
    },
    totalExpand(val) {
      if (val) {
        this.totalExpandInfo = val
        this.totalExceptIncomingPrice = this.totalExpandInfo.totalExceptIncomingPrice
        this.totalExceptIncomingQty = this.totalExpandInfo.totalExceptIncomingQty
        this.totalExceptRetailPrice = this.totalExpandInfo.totalExceptRetailPrice
      } else {
        this.totalExpandInfo = {}
        this.totalExceptIncomingPrice = ''
        this.totalExceptIncomingQty = ''
        this.totalExceptRetailPrice = ''
      }
    }
  },
  methods: {
    // 修改每页条数
    async handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageNum = 1
      this.$emit('getPageSize', this.pageSize)
      this.getSearchMethod()
    },
    // 修改当前页数
    async handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.$emit('getPageNum', this.pageNum)
      this.getSearchMethod()
    }
  }
}
</script>
