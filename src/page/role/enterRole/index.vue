<template>
  <div class="enter-role">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:searchBar>
        <SearchBar @search="search"/>
      </template>
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="hadlerClick(scope.row)">编辑</el-button>
      </template>
      <template v-slot:table-roleNames="scope">
        <span>{{ scope.row.roleNames.join(',') || scope.row.roleNames[0] }}</span>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import SearchBar from './searchBar'
import HtmlPage from '@component/pageCommon/listCommon'
import { config } from './bd'
export default {
  name: 'EnterRole',
  components: {
    HtmlPage,
    SearchBar
  },
  data() {
    return {
      config: config
    }
  },
  methods: {
    search(params) {
      this.$refs.targetPage.getList(params)
    },
    hadlerClick(row) {
      console.log(row)
    }
  }
}
</script>
<style lang="scss">
.enter-role {
   .el-col  .el-input  .el-input__inner {
   height:30px
 }
 .margin-10 {
   margin: 0 10px
 }
   .el-col  .el-button {
   height:30px;
   line-height: 0px;
 }
}
</style>
