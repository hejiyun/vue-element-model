<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item v-for="(item, index) in header" :key="index" :label="item.label">
        <el-input v-model="form[item.prop]" :disabled="item.disabled"/>
      </el-form-item>
    </el-form>
    <Table :getParams="getParams"/>
  </div>
</template>
<script>
import Table from './Table'
import { header } from '@base/module_pos/sale_pool_manage/product_distribute_edit'
import { getSaleInfo } from '@/axios/module_pos/sale_pool_manage/product_distribute_edit'
export default {
  name: 'SalePoolProductDistributeEdit',
  components: {
    Table
  },
  data() {
    return {
      header: header,
      form: {}
    }
  },
  async created() {
    const No = this.$route.params.id
    const res = await getSaleInfo(No)
    this.form = res.data.data
    sessionStorage.setItem('saleInfo', JSON.stringify(this.form))
  },
  methods: {
    getParams() {
      const res = this.$refs.he.getParams()
      return res
    }
  }
}
</script>
