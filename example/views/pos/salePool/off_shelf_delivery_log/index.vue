<template>
  <div class="store-shelves-result">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="$router.push(`/pos/salepool/pulldetail/${scope.row.billNo}`)">查看</el-button>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config } from '@base/module_pos/sale_pool_manage/off_shelf_delivery_log'
import { getPoolList } from '@/axios/module_pos/sale_pool_manage/off_shelf_delivery_log'
export default {
  name: 'SalePoolOffShelfDeliveryLog',
  components: {
    HtmlPage
  },
  data() {
    return {
      config: config // 页面配置
    }
  },
  async created() {
    const resPool = await getPoolList()
    this.$set(this.config.searchBar[0], 'options', resPool.data.data)
    // 为店铺赋值
  }
}
</script>
