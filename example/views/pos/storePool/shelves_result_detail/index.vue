<template>
  <div>
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:searchBar>
        <el-button type="primary" @click="exprotExcel">导出</el-button>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config } from '@base/module_pos/store_pool_manage/shelves_result_detail'
import { ExportExcel } from '@/axios/module_pos/store_pool_manage/shelves_result_detail'
export default {
  name: 'StorePoolShelvesResultDetail',
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
    exprotExcel() {
      const params = {
        billNo: this.$route.params.id
      }
      ExportExcel(params)
    }
  }
}
</script>
