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
    <DialogBox 
    :DialogConfig="DialogConfig" 
    :showDialog.sync="showDialog"
    @DialogConfirm="edit"/>
  </div>
</template>
<script>
import SearchBar from './searchBar'
import HtmlPage from '@component/pageCommon/listCommon'
import { config, DialogConfig } from './bd'
import { getRoleList } from '@/axios/enterRole';
import DialogBox from 'common/DialogBox'
export default {
  name: 'EnterRole',
  components: {
    HtmlPage,
    SearchBar,
    DialogBox
  },
  data() {
    return {
      config: config,
      DialogConfig: DialogConfig,
      showDialog: false
    }
  },
  async mounted() {
    const res = await getRoleList()
    console.log(res.data.list)
    this.DialogConfig.options[2].options = res.data.list
  },
  methods: {
    search(params) {
      this.$refs.targetPage.getList(params)
    },
    hadlerClick(row) {
      this.DialogConfig.options.forEach(e => {
        if (row.hasOwnProperty(e.prop)) {
          this.$set(e, 'setDefaultValue', row[e.prop])
        }
      })
      this.showDialog = true
    },
    edit(event) {
      console.log(event)
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
