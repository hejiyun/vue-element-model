<template>
  <div>
    <el-container class="order-box ODSOrderBox">
      <el-col :span="24">
        <!-- 查询条件搜索框部分 -->
        <search-bar
          ref="sh"
          :all-oreder-params="true"
          :options="deliveryListOptions"
          :export-options="defaultExportOptions"
          :options-copy="optionsCopy"
          lazy-update
          is-reset
          @search="search"/>
      </el-col>
      <!-- 列表表格部分 -->
      <table-common v-loading="loading" :height="210" :table-header="deliverytableHeader" :table-data="tableData" :change-cell="[12]" :change-cell-color="'red'" :table-button-width="150" table-button>
        <template slot="btn" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="$router.push(`/ODS/JITCombinedOrderDetail/${scope.rowData.row.mergeDispatchNo}`)">查看</el-button>
        </template>
      </table-common>
      <!-- 分页器部分 -->
      <page-common
        ref="page"
        :default-parameters="params1"
        :hide-last="true"
        layout="total, sizes, prev, pager, next"
        api="/bff/ods/api/v1/merge/dispatch/r/query_page"
        method="post"
        @query="query"
        @loading="load"
      />
    </el-container>
  </div>
</template>

<script>
import SearchBar from './SearchBar'
import PageCommon from '@/components/PageCommon'
import TableCommon from './TableCommon'
import { deliverytableHeader, deliveryListOptions } from './db'
import { getNewTime } from '@/textResources/searchBarOptions'
import moment from 'moment'
export default{
  name: 'JITCombinedOrder',
  components: {
    SearchBar, // 搜索框组件
    PageCommon, // 分页器组件
    TableCommon // 表格组件
  },
  data() {
    return {
      isDisable: false, // 防重复点击控制变量
      deliverytableHeader: deliverytableHeader, // 表格表头项变量
      deliveryListOptions: deliveryListOptions, // 搜索框选项变量
      tableData: [], // 表格数组
      loading: false, // 加载动画变量
      getFlag: false, // 控制查询无结果时显示文字变量
      MessageArr: [], // 数组字典接收变量
      CustormList: [], // 用户列表变量
      optionsCopy: [], // 多选框来源数据变量
      moment: moment, // 时间插件, 更改时间格式
      params1: { // 初始化默认搜索参数
        dispatchNo: ''
      },
      defaultExportOptions: { // 初始化默认导出参数
        url: '/bff/api/v1/dispatch/_export', // 导出接口
        data: {
          billNoList: [] // 导出传递参数
        },
        method: 'post', // 导出方法
        hasParams: true // 导出参数是否存在
      }
    }
  },
  beforeDestroy() {
    // 页面的变量后期可整理，组件销毁时，可以将变量释放掉。
  },
  async created() {
    // 刷新最新默认时间
    if (sessionStorage.getItem('JITBillNo')) {
      this.deliveryListOptions[6].defaultValue = sessionStorage.getItem('JITBillNo')
      this.params1.dispatchNo = sessionStorage.getItem('JITBillNo')
      sessionStorage.removeItem('JITBillNo')
    } else {
      getNewTime()
      this.params1.toMergeCreateTime = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      this.params1.fromMergeCreateTime = this.moment(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)).format('YYYY-MM-DD HH:mm:ss')
    }
    const params = ['merge_dispatch_bill_status', 'dest_vip_warehouse_code']
    // 获取搜索栏字典数据信息
    const res = await this.$api.getMessage(params)
    console.log(res, 'asdfj')
    this.MessageArr = res.data.data
    // 处理字典数据格式,转换为可利用键值对格式
    this.MessageArr.map(item => {
      item.dictCodes.map(e => {
        e['value'] = e.dictCode
        e['label'] = e.dictValue
      })
    })
    // 对搜索框选项进行添加下拉选项
    this.deliveryListOptions[1].options = this.MessageArr.filter(item => item.typeCode === 'merge_dispatch_bill_status')[0].dictCodes
    this.deliveryListOptions[3].options = this.MessageArr.filter(item => item.typeCode === 'dest_vip_warehouse_code')[0].dictCodes
  },
  mounted() {
    // 初始化, 调整样式
    this.params1 = {}
  },
  methods: {
    // 搜索查询方法
    search(params) {
      // ODS迭代自测流程参数正常,查询条件参数正常,
      // 如果选择创建时间,则拆份为开始与结束时间,否则删除参数属性
      if (params.mergeTime) {
        params.toMergeCreateTime = moment(params.mergeTime[1]).format('YYYY-MM-DD HH:mm:ss')
        params.fromMergeCreateTime = moment(params.mergeTime[0]).format('YYYY-MM-DD HH:mm:ss')
        delete params.mergeTime
      }
      // 如果选择发货时间,则拆份为开始与结束时间,否则删除参数属性, 该参数后台暂未提供查询服务
      if (params.deliveryTime) {
        params.toDeliveryTime = moment(params.deliveryTime[1]).format('YYYY-MM-DD HH:mm:ss')
        params.fromDeliveryTime = moment(params.deliveryTime[0]).format('YYYY-MM-DD HH:mm:ss')
        delete params.deliveryTime
      }
      // 去除参数属性为空的非必要传递属性
      for (var e in params) {
        if (params[e] === '' || params[e] === null || params[e].length === 0) {
          delete params[e]
        } else if (typeof (params[e]) === 'string') {
          params[e] = params[e].trim()
        }
      }
      // 对仓库代码信息传递格式进行处理
      for (var k in params) {
        if (k === 'fromExternalWarehouseCodeList') {
          const arr = []
          params[k].map(item => {
            arr.push(item.value)
          })
          params[k] = arr
        }
      }
      if (params['dispatchNo'] || params['expressBillNo']) {
        params = {
          dispatchNo: params['dispatchNo'],
          expressBillNo: params['expressBillNo']
        }
      }
      // 请求数据
      this.$refs.page.getList(params)
    },
    // 获取列表数据
    query(data) {
      this.tableData = data
    },
    // 加载动画方法
    load(status) {
      this.loading = status
    },
    formatter(row, column) {
      return row.address
    },
    // 跳转详情
    handleView(index, row) {
      this.$router.push(`/TradingPlatform/returnList/creditDetail/${index}`)
    },
    // 导出
    async Send(id) {
      this.isDisable = true
      const that = this
      setTimeout(() => {
        that.isDisable = false
      }, 2000)
      // 提供导出传递参数
      this.defaultExportOptions.data.billNoList = [id]
      await this.$refs.sh.exportExcel()
    }
  }
}
</script>
<style scoped>
.textStyle{
  margin-left: 40px;
  color:red
}
  .order-box {
    display: block;
    width:100%;
    padding: 15px 40px;
  }
  .blue-line{
    width: 15px;
    font-weight: 900;
    color: blue;
    display: inline-block;
  }
  .el-divider{
    margin: 12px 0;
  }
  .mr{
    margin: 10px 0;
  }
  .text-right{
    text-align: center;
  }
  .text-right button:last-child {
    margin-right: 5%;
  }
</style>
