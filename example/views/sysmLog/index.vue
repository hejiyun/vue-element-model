<template>
  <el-container class="order-box">
    <el-col :span="24">
      <search-bar
        ref="searchtop"
        :all-oreder-params="true"
        :options="sysmLogOptions"
        :width-number="6"
        @search="searchList"
      />
    </el-col>
    <table-common v-loading="loading" :height="130" :table-header="sysmLogHeader" :table-data="tableData"/>
    <page-common
      ref="page"
      api="/bff/bd/api/v1/ops/get"
      method="get"
      @query="query"
      @loading="load"
    />
  </el-container>
</template>
<script>
import SearchBar from './SearchBar'
import PageCommon from '@/components/PageCommon'
import TableCommon from '@/components/TableCommon'
import TableText from '@/textResources/tableText'
import searchBarOptions from '@/textResources/searchBarOptions'
import moment from 'moment'

export default {
  name: 'SysmLog',
  components: {
    SearchBar,
    PageCommon,
    TableCommon
  },
  data() {
    return {
      moment: moment,
      sysmLogOptions: searchBarOptions.sysmLogOptions,
      sysmLogHeader: TableText.sysmLogHeader,
      tableData: [],
      loading: false,
      getFlag: false
    }
  },
  async created() {
    const res = await this.$api.getLogSearch()
    const lest = res.data.data
    for (var k in lest) {
      lest[k].map(item => {
        item['value'] = item.dic_value
        item['label'] = item.dic_value
      })
      lest[k].unshift({
        value: 'all',
        label: '全部'
      })
    }
    this.sysmLogOptions[2].options = lest.optType
  },
  methods: {
    searchList(params) {
      console.log(this.moment)
      console.log(params)
      if (params.startTime && params.endTime) {
        params.startTime = this.moment(params.startTime).format('YYYY-MM-DD HH:mm:ss')
        params.endTime = this.moment(params.endTime).format('YYYY-MM-DD HH:mm:ss')
        if (new Date(params.startTime) - new Date(params.endTime) > 0) {
          this.$notify({
            title: '错误',
            message: '开始时间必须小于结束时间',
            type: 'error',
            duration: 2000
          })
          return
        }
        this.$refs.page.getList(params)
      } else if (!params.startTime && !params.endTime) {
        this.$refs.page.getList(params)
      } else {
        this.$notify({
          title: '错误',
          message: '请选择时间段',
          type: 'error',
          duration: 2000
        })
      }
    },
    query(data) {
      this.tableData = data
    },
    load(status) {
      this.loading = status
    }
  }
}
</script>
<style scoped>
 .blue-line{
    width: 15px;
    font-weight: 900;
    color: blue;
    display: inline-block;
  }
    .order-box {
    display: block;
    width:100%;
    padding: 15px 40px;
  }
 .mr{
    margin: 10px 0;
  }
.el-divider{
   margin: 15px 0
 }
</style>
