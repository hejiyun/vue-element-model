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
          label: '下拉框', // 左侧label标题
          prop: 'username', // 传出字段属性名
          width: 400, // drap显示框的宽度 ,单位px
          optionHeader: ['仓库代码/code', '仓库名称/name', '仓库类型/type', '账套/accountSet'], // 数据列表头部信息
          AllList: [ // 列表数据所有信息
            {
              name: '京东',
              code: 'WH0129923',
              type: 'B2B',
              accountSet: '35'
            },
            {
              name: '京东1',
              code: 'WH01341',
              type: 'B2B',
              accountSet: '42'
            },
            {
              name: '京东2',
              code: 'WH03423',
              type: 'B2B',
              accountSet: '354'
            }
          ],
          cmp: LazySelect // 对应引用组件
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
