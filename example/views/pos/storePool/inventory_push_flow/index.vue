<template>
  <div class="store-inventory-push-flow">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:search-btn="form">
        <el-button type="primary" @click="exportExcel(form.params)">导出</el-button>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config } from '@base/module_pos/store_pool_manage/inventory_push_flow'
import { getPoolList, ExportExcel } from '@/axios/module_pos/store_pool_manage/inventory_push_flow'
export default {
  name: 'StorePoolInventoryPushFlow',
  components: {
    HtmlPage
  },
  data() {
    return {
      config: config // 页面配置
    }
  },
  async created() {
    // 请求业务类型和店铺状态字典数据接口
    const res = await getPoolList()
    this.$set(this.config.searchBar[1], 'options', res.data.data)
  },
  methods: {
    exportExcel(form) {
      const params = JSON.parse(JSON.stringify(form))
      ExportExcel(params)
    }
  }
}
</script>
