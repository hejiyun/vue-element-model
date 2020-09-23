<template>
  <div class="set-role">
    <HtmlPage ref="targetPage" :page-config="config" @getCount="getCount">
      <template v-slot:searchBar>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item v-for="(item, index) in header" :key="index" :label="item.label">
            <el-input v-model="form[item.prop]" :disabled="item.disabled"/>
          </el-form-item>
        </el-form>
        <p>数量:{{ count }}</p>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config, header } from '@base/module_pos/sale_pool_manage/product_distribute_detail'
import { getSaleInfo } from '@/axios/module_pos/sale_pool_manage/product_distribute_detail'
export default {
  name: 'SalePoolProductDistributeDetail',
  components: {
    HtmlPage
  },
  data() {
    return {
      config: config, // 页面配置
      header: header,
      form: {},
      count: 0
    }
  },
  async created() {
    this.config.pageConfig.defaultParamter.billNo = this.$route.params.id
    const No = this.$route.params.id
    const res = await getSaleInfo(No)
    this.form = res.data.data
    sessionStorage.setItem('saleInfo', JSON.stringify(this.form))
  },
  methods: {
    getCount(count) {
      this.count = count
    }
  }
}
</script>
