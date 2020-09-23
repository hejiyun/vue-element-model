<template>
  <div class="store-search">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:search-btn="form">
        <el-button type="primary" @click="exportExcel(form.params)">导出</el-button>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config } from '@base/module_pos/store_pool_manage/search'
import { ExportExcel } from '@/axios/module_pos/store_pool_manage/search'
import requestMixin from '@/axios/module_pos/store_pool_manage/mixin'
export default {
  name: 'StorePoolSearch',
  components: {
    HtmlPage
  },
  mixins: [requestMixin],
  data() {
    return {
      config: config
    }
  },
  methods: {
    exportExcel(form) {
      const params = JSON.parse(JSON.stringify(form))
      for (const k in params) {
        if (k === 'productNos' || k === 'productCodes') {
          const arr = []
          params[k].split(',').map(e => {
            e = e.replace(/[\r\n]/g, '').trim()
            if (e) {
              arr.push(e)
            }
          })
          params[k] = arr
        }
        if (!params[k] || params[k].length === 0 || JSON.stringify(params[k]) === '{}') {
          delete params[k]
        }
      }
      ExportExcel(params)
    }
  }
}
</script>
