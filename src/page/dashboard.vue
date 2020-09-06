<template>
  <div class="dashboard-style">
    <el-row>欢迎您 {{ sysUserName }}</el-row>
    <SearchForm :options="row"/>
    <el-button @click="getMenus">点我</el-button>
    <TabelCommon :table-cofig="tableCofig"/>
    <el-row class="footer-div">copyright @ 昆山宝唯信息科技有限公司上海分公司</el-row>
  </div>
</template>
<script>
import SearchForm from '@component/Form'
import TabelCommon from 'common/Tabel'
import { SelectC } from '@component/Form/ExportItem.js'
import { getMenu } from '@/axios/common';
export default {
  components: {
    SearchForm,
    TabelCommon
  },
  data() {
    return {
      tableCofig: {
        changeCell: [16],
        tableData: [
          {
            balanceAmount: 500.0111,
            brandValue: 'ADIDAS(阿迪)',
            colorValue: '黑色',
            cutAmount: 1,
            cutTotalAmount: 500.01,
            discount: 0.6031,
            dispatchDiffQty: 0,
            dispatchQty: 1,
            dispatchTotalAmount: 500.01,
            occupyQty: 1,
            occupyTotalAmount: 500.01,
            payAmount: 500.01,
            planListingDate: '2017-01-01 00:00:00',
            productCode: 'BW0620',
            productProjectValue: '套装',
            productSeasonValue: '春',
            productSeriesValue: '跑步系列',
            productShortName: 'marathon 10 tr CNY',
            productTypeValue: '鞋子',
            productYear: '2019',
            remark: '',
            retailPrice: 829,
            sexValue: '男',
            sizeCode: '3-',
            warehouseName: '宝唯上海-宝唯唯品会大宗销售仓'
          }
        ],
        height: 400,
        tableHeader: [{ label: '仓库名称', prop: 'warehouseName', width: '240' },
          {
            label: '货号',
            prop: 'productCode',
            width: '180'
          }, { label: '品牌', prop: 'brandValue', width: '180' }, { label: '年份', prop: 'productYear', width: '100' }, {
            label: '季节',
            prop: 'productSeasonValue',
            width: '80'
          }, { label: '类别', prop: 'productTypeValue', width: '90' },
          { label: '性别', prop: 'sexValue', width: '100' }, { label: '颜色名称', prop: 'colorValue', width: '100' }, {
            label: '上市日期',
            prop: 'planListingDate',
            width: '150'
          },
          { label: '系列', prop: 'productSeriesValue', width: '100' }, {
            label: '项目',
            prop: 'productProjectValue',
            width: '100'
          }, { label: '货品简称', prop: 'productShortName', width: '180' },
          { label: '零售价', prop: 'retailPrice', width: '100' }, { label: '尺码', prop: 'sizeCode', width: '100' }, {
            label: '折扣',
            prop: 'discount',
            width: '140'
          },
          { label: '含税结算价', prop: 'balanceAmount', width: '140' }, { label: '下单数量', prop: 'cutAmount', width: '100' },
          { label: '下单金额', prop: 'cutTotalAmount', width: '100' },
          { label: '占库数量', prop: 'occupyQty', width: '120' }, { label: '占库金额', prop: 'occupyTotalAmount', width: '120' }, {
            label: '发货数量',
            prop: 'dispatchQty',
            width: '100'
          }, { label: '发货金额', prop: 'dispatchTotalAmount', width: '100' }, { label: '发货数量差异', prop: 'dispatchDiffQty', width: '100' }]
      },
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
          cmp: SelectC
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
      this.tableCofig.tableHeader = [{ label: '仓库名称', prop: 'warehouseName', width: '240' },
        {
          label: '货号',
          prop: 'productCode',
          width: '180'
        }, { label: '品牌', prop: 'brandValue', width: '180' }, { label: '年份', prop: 'productYear', width: '100' }, {
          label: '季节',
          prop: 'productSeasonValue',
          width: '80'
        }, { label: '类别', prop: 'productTypeValue', width: '90' }]
      this.tableCofig.tableData = [
        {
          balanceAmount: 500.0111,
          brandValue: 'ADIDAS(阿迪)',
          colorValue: '黑色',
          cutAmount: 1,
          cutTotalAmount: 500.01,
          discount: 0.6031,
          dispatchDiffQty: 0,
          dispatchQty: 1,
          dispatchTotalAmount: 500.01,
          occupyQty: 1,
          occupyTotalAmount: 500.01,
          payAmount: 500.01,
          planListingDate: '2017-01-01 00:00:00',
          productCode: 'BW0620',
          productProjectValue: '套装',
          productSeasonValue: '春',
          productSeriesValue: '跑步系列',
          productShortName: 'marathon 10 tr CNY',
          productTypeValue: '鞋子',
          productYear: '2019',
          remark: '',
          retailPrice: 829,
          sexValue: '男',
          sizeCode: '3-',
          warehouseName: '宝唯上海-宝唯唯品会大宗销售仓'
        },
        {
          balanceAmount: 400,
          brandValue: 'ADIDAS(阿迪)',
          colorValue: '黑色',
          cutAmount: 2,
          cutTotalAmount: 800,
          discount: 0.4825,
          dispatchDiffQty: 0,
          dispatchQty: 2,
          dispatchTotalAmount: 800,
          occupyQty: 2,
          occupyTotalAmount: 800,
          payAmount: 800,
          planListingDate: '2017-01-01 00:00:00',
          productCode: 'BW0620',
          productProjectValue: '套装',
          productSeasonValue: '春',
          productSeriesValue: '跑步系列',
          productShortName: 'marathon 10 tr CNY',
          productTypeValue: '鞋子',
          productYear: '2019',
          remark: '',
          retailPrice: 829,
          sexValue: '男',
          sizeCode: '4',
          warehouseName: '宝唯上海-宝唯唯品会大宗销售仓'
        }
      ]
    }
  }
}
</script>
