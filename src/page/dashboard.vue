<template>
  <div class="dashboard-style">
    <el-row>欢迎您 {{ sysUserName }}</el-row>
    <SearchForm :options="row"/>
    <el-button @click="getMenus">点我</el-button>
    <el-row class="footer-div">copyright @ 昆山宝唯信息科技有限公司上海分公司</el-row>
  </div>
</template>
<script>
import SearchForm from '@component/Form'
import { LazySelect } from '@component/Form/ExportItem.js'
import { getMenu } from '@/axios/common';
export default {
  components: {
    SearchForm
  },
  data() {
    return {
      sysUserName: '',
      row: [
        {
          label: '下拉框',
          prop: 'username',
          multiple: true,
          setDefaultValue: '选项2',
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          cmp: LazySelect
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
  },
  methods: {
    async getMenus() {
      const res = await getMenu()
      console.log(res);
    }
  }
}
</script>
