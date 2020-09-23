<template>
  <div class="store-shelves-result">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="$router.push(`/pos/storepool/batchdetail/${scope.row.billNo}`)">查看</el-button>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config } from '@base/module_pos/store_pool_manage/shelves_result'
import { getTypeCode } from '@/axios/module_pos/store_pool_manage/shelves_result'
export default {
  name: 'StorePoolShelvesResult',
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
    const params = { dictCodes: ['ONFFLINE_TYPE'] }
    const res = await getTypeCode(params)
    this.$set(this.config.searchBar[2], 'options', res.data.data.ONFFLINE_TYPE.dictItems)
  }
}
</script>
