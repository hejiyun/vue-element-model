<template>
  <div class="set-role">
      <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:searchBar>
        <el-button type="primary" @click="addDialog = true">新建角色</el-button>
      </template>
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="view(scope.row)">查询</el-button>
        <el-button type="text" @click="showDialog = true">设置权限</el-button>
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
import { config, DialogConfig, addRoleConfig } from './bd'
import { getRoleList } from '@/axios/setRole';
import DialogBox from 'common/DialogBox'
export default {
  name: 'SetRole',
  components: {
    HtmlPage,
    DialogBox
  },
  data() {
    return {
      addDialog: false,
      config: config, // 页面配置
      DialogConfig: DialogConfig, // 设置角色弹窗
      addRoleConfig: addRoleConfig, // 新建角色弹窗
      showDialog: false
      
    }
  },
  beforeDestroy() {
  },
  methods: {
    view(row) {
      console.log(row)
    },
    del(row) {
      console.log(row)
    },
    // 发送新建角色请求
    add(event) {
      console.log(event)
    },
    editRole(event) {
      console.log(event)
    }
  }
}
</script>
