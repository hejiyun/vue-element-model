<template>
  <div class="add-role">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:searchBar>
        <el-button type="primary" @click="addDialog = true">新增资源</el-button>
        <SelectC :item="searchOptions" @updateValue="updateValue($event, searchOptions.prop)"/>
        <el-button type="primary" @click="search">查询</el-button>
      </template>
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="showDialog = true">编辑</el-button>
        <el-button type="text" @click="del(scope.row)">删除</el-button>
      </template>
    </HtmlPage>
    <DialogBox 
    :DialogConfig="addRoleConfig" 
    :showDialog.sync="addDialog"
    @DialogConfirm="add"/>
    <DialogBox 
    :DialogConfig="DialogConfig" 
    :showDialog.sync="showDialog"
    @DialogConfirm="editRole"/>
  </div>
</template>
<script>
import HtmlPage from '@component/pageCommon/listCommon'
import { config, DialogConfig, addRoleConfig, searchOptions } from './bd'
import { getRoleList } from '@/axios/setRole';
import { SelectC } from '@component/Form/ExportItem.js'
import DialogBox from 'common/DialogBox'
export default {
  name: 'AddRole',
   components: {
    HtmlPage,
    DialogBox,
    SelectC
  },
  data() {
    return {
      addDialog: false,
      config: config, // 页面配置
      DialogConfig: DialogConfig, // 设置角色弹窗
      addRoleConfig: addRoleConfig, // 新建角色弹窗
      showDialog: false,
      form: {},
      searchOptions: searchOptions
    }
  },
  beforeDestroy() {
  },
  methods: {
    updateValue(event, name) {
      this.$set(this.form, name, event)
    },
    search() {
      console.log(this.form)
      this.$refs.targetPage.getList(this.form)
      // data, this.config.tableConfig.tableData = []
    },
    del(row) {
      console.log(row)
    },
    add(event) {
      console.log(event)
    },
    editRole(event) {
      console.log(event)
    }
  }
}
</script>
