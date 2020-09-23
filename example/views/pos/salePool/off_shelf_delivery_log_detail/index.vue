<template>
  <div class="store-search">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:search-btn="form">
        <el-button type="primary" @click="exportExcel(form.params)">导出</el-button>
      </template>
      <template v-slot:table-billNo>
        <span>{{ $route.params.id }}</span>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config } from '@base/module_pos/sale_pool_manage/off_shelf_delivery_log_detail'
import { ExportExcel } from '@/axios/module_pos/sale_pool_manage/off_shelf_delivery_log_detail'
export default {
  name: 'SalePoolOffShelfDeliveryLogDetail',
  components: {
    HtmlPage
  },
  data() {
    return {
      config: config
    }
  },
  created() {
    this.config.pageConfig.defaultParamter.billNo = this.$route.params.id
  },
  methods: {
    exportExcel(form) {
      const params = JSON.parse(JSON.stringify(form))
      for (const k in params) {
        if (!params[k] || params[k].length === 0 || JSON.stringify(params[k]) === '{}') {
          delete params[k]
        }
      }
      params['billNo'] = this.$route.params.id
      ExportExcel(params)
    }
  }
}
</script>
