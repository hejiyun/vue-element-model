<template>
  <div class="dashboard-style">
    <el-row>欢迎您 {{ sysUserName }}</el-row>
    <SearchForm :options="row"/>
    <el-row class="footer-div">copyright @ 昆山宝唯信息科技有限公司上海分公司</el-row>
  </div>
</template>
<script>
import SearchForm from '@component/Form'
import { InputC, SelectC } from '@component/Form/ExportItem.js'
export default {
  components: {
    SearchForm
  },
  data() {
    return {
      sysUserName: '',
      row: [
        {
          label: '输入框',
          prop: 'password',
          setDefaultValue: '12312313',
          cmp: InputC
        },
        {
          label: '下拉框',
          prop: 'username',
          setDefaultValue: '选项2',
          cmp: SelectC
        },
        {
          label: '输入框2',
          prop: 'password2',
          cmp: InputC
        },
        {
          label: '下拉框2',
          prop: 'username1',
          setDefaultValue: '选项2',
          cmp: SelectC
        },
        {
          label: '输入框3',
          prop: 'password3',
          cmp: InputC
        }
      ]
    }
  },
  mounted() {
    var user = sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.userName || '';
    }
  }
}
</script>
