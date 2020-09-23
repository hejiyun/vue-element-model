<template>
  <div class="store-shelves-result">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:searchBar>
        <SearBar @search="search"/>
      </template>
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="$router.push(`/ODS/JITCombinedOrderDetail/${scope.row.mergeDispatchNo}`)">查看</el-button>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import SearBar from './search'
import { config } from '@base/module_ods/combined_order'
export default {
  name: 'ODSCombinedOrder',
  components: {
    HtmlPage,
    SearBar
  },
  data() {
    return {
      config: config, // 页面配置
      MessageArr: []
    }
  },
  methods: {
    search(params) {
      this.$refs.targetPage.getList(params)
    }
  }
}
</script>
