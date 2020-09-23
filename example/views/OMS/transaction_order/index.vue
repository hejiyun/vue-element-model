<template>
  <div class="order-box OMSOrderBox">
    <el-row>
      <SearBar @search="search"/>
    </el-row>
    <el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{background: '#204060', color: 'white'}"
        :height="`calc(100vh - ${220}px)`"
        border
        class="tbStyle">
        <el-table-column
          prop="orderNo"
          label="单号"
          width="240">
          <template slot-scope="scope">
            <p><span>交易单号:</span><span :class="scope.row.inadequate === true ? 'red' : ''">{{ scope.row.orderNo }}</span></p>
            <p><span>平台单号:</span><span>{{ scope.row.platformNo }}</span></p>
            <p><span>外部单号:</span><span>{{ scope.row.externalOrderNo }}</span></p>
            <p><span>单据类型:</span><span>{{ scope.row.orderTypeName }}</span></p>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="收件人信息"
          width="180">
          <template slot-scope="scope">
            <p>{{ scope.row.receiverName }}</p>
            <p>{{ scope.row.receiverMobile }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          label="单据状态">
          <template slot-scope="scope">
            <p><span>单据状态:</span><span>{{ scope.row.orderStatusName }}</span></p>
            <p><span>支付状态:</span><span>{{ scope.row.payStatusName }}</span></p>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopname"
          label="客店名称">
          <template slot-scope="scope">
            <span>{{ scope.row.shopCodeName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderTime"
          label="订单时间">
          <template slot-scope="scope">
            <p><span>平台订单生成时间:</span><span>{{ scope.row.orderCreateTime }}</span></p>
            <p><span>交易订单创建时间:</span><span>{{ scope.row.orderTransactTime }}</span></p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push(`/OMS/OrderDetail/${scope.row.orderNo}/${scope.row.uid}`)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <Pagination ref="page" :page-config="pageConfig" @query="query" @loading="load"/>
    </el-row>
    <!-- 分页器组件 -->
  </div>
</template>

<script>
import SearBar from './search'
import { pageConfig } from '@base/module_oms/transaction_order'
import Pagination from '@common/pagination'
export default {
  name: 'OMSTransactionOrder',
  components: { SearBar, Pagination },
  data() {
    return {
      tableData: [], // 表格数据源
      pageConfig: pageConfig,
      loading: false
    }
  },
  beforeDestroy() {
    // 页面的变量后期可整理，组件销毁时，可以将变量释放掉。
  },
  methods: {
    // 查询
    search(params) {
      this.$refs.page.getList(params)
    },
    query(data) {
      this.tableData = data
    },
    load(B) {
      this.loading = B
    }
  }
}
</script>
