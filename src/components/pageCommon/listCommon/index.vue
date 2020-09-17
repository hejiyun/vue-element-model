<template>
  <div>
    <SearchForm v-if="!Config.editSearchBar" :options="Config.searchBar" @submit="submit">
      <template v-for="item in Config.searchBar" slot-scope="scope" :slot="item.operate ? item.prop : null">
        <slot v-if="item.operate" :params="scope.params" :name="`search-${item.prop}`"/>
      </template>
      <template v-slot:btn="params">
        <slot :params="params" name="search-btn"/>
      </template>
    </SearchForm>
    <slot v-else name="searchBar"/>
    <TableCommon v-loading="loading" :table-cofig="Config.tableCofig" class="margin-top-15">
      <template v-for="item in Config.tableCofig.tableHeader" slot-scope="scope" :slot="item.operate ? item.prop : null">
        <slot v-if="item.operate" :row="scope.row" :name="`table-${item.prop}`"/>
      </template>
    </TableCommon>
    <Pagination ref="listCommonPage" :page-config="Config.pageConfig" @query="query" @loading="load"/>
  </div>
</template>
<script>
import SearchForm from '@component/Form'
import TableCommon from 'common/Table'
import Pagination from 'common/pagination'
export default {
  name: 'ListPageCommon',
  components: {
    SearchForm,
    TableCommon,
    Pagination
  },
  props: {
    pageConfig: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    Config() {
      return Object.assign({
        editSearchBar: false, // 控制是否自定义编辑搜素模块, 自定义则searchBar不会渲染
        searchBar: [], // 搜素模块
        tableCofig: {}, // 表格模块
        pageConfig: {} // 分页器模块
      }, this.pageConfig)
    }
  },
  methods: {
    submit(params) {
      this.getList(params)
    },
    getList(params) {
      this.$refs.listCommonPage.getList(params)
    },
    query(data) {
      this.Config.tableCofig.tableData = data
    },
    load(B) {
      this.loading = B
    }
  }
}
</script>
<style lang="scss" scoped>
.margin-top-15 {
  margin-top: 15px;
}
</style>
