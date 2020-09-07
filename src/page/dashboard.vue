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
import { getMenu, getWarehouse } from '@/axios/common';
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
          optionHeader: ['仓库代码/externalWarehouseCode', '仓库名称/warehouseName', '仓库类型/warehouseTypeName', '账套/warehouseAccount'], // 数据列表头部信息
          AllList: [], // 列表数据所有信息
          cmp: LazySelect // 对应引用组件
        }
      ]
    }
  },
  async created() {
    const res = await getWarehouse()
    this.row[0].AllList = res.data.data.warehouseList
    console.log(this.row)
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
