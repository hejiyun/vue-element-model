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
            @click="$router.push(`/ODS/DeliveryList/DeliveryDetail/${scope.rowData.row.billNo}/${scope.rowData.row.isMerge ? 1 : 0}`)">查看</el-button>
          <el-button
            :disabled="isDisable"
            type="text"
            size="mini"
            @click="Send(scope.rowData.row.billNo)">导出</el-button>
          <el-button
            v-if="scope.rowData.row.isMerge"
            type="text"
            size="mini"
            @click="pushToJIT(scope.rowData.row)">查看合发单</el-button>
            <!-- 可以用循环自定义设置按键名称及个数 -->
        </template>
      </table-common>
      <!-- 分页器部分 -->
      <page-common
        ref="page"
        :default-parameters="params1"
        :hide-last="true"
        layout="total, sizes, prev, pager, next"
        api="/bff/api/v1/dispatch/_page"
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
import TableText from '@/textResources/tableText'
import searchBarOptions from '@/textResources/searchBarOptions'
import { getNewTime } from '@/textResources/searchBarOptions'
import moment from 'moment'
export default{
  name: 'DeliveryList',
  components: {
    SearchBar, // 搜索框组件
    PageCommon, // 分页器组件
    TableCommon // 表格组件
  },
  data() {
    return {
      isDisable: false, // 防重复点击控制变量
      deliverytableHeader: TableText.deliverytableHeader, // 表格表头项变量
      deliveryListOptions: searchBarOptions.deliveryListOptions, // 搜索框选项变量
      tableData: [], // 表格数组
      loading: false, // 加载动画变量
      getFlag: false, // 控制查询无结果时显示文字变量
      MessageArr: [], // 数组字典接收变量
      CustormList: [], // 用户列表变量
      optionsCopy: [], // 多选框来源数据变量
      moment: moment, // 时间插件, 更改时间格式
      params1: { // 初始化默认搜索参数
        fromCreateTime: '',
        toCreateTime: ''
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
    getNewTime()
    this.params1.toCreateTime = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    this.params1.fromCreateTime = this.moment(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)).format('YYYY-MM-DD HH:mm:ss')
    const params = ['dispatch_bill_status', 'dispatch_bill_biz_type', 'warehouse_type', 'receive_bill_status', 'receive_bil_biz_type']
    // 获取搜索栏字典数据信息
    const res = await this.$api.getMessage(params)
    this.MessageArr = res.data.data
    // 处理字典数据格式,转换为可利用键值对格式
    this.MessageArr.map(item => {
      item.dictCodes.map(e => {
        e['value'] = e.dictCode
        e['label'] = e.dictValue
      })
    })
    // 对搜索框选项进行添加下拉选项
    this.deliveryListOptions[1].options = this.MessageArr.filter(item => item.typeCode === 'dispatch_bill_status')[0].dictCodes
    this.deliveryListOptions[5].options = this.MessageArr.filter(item => item.typeCode === 'dispatch_bill_biz_type')[0].dictCodes
    // 获取客商信息
    const res1 = await this.$api.getCustorm()
    res1.data.data.map(item => {
      item['label'] = item.vendCustName
      item['value'] = item.vendCustCode
    })
    // 对客商搜索框进行赋值
    this.deliveryListOptions[4].options = res1.data.data
    // 将原始数据保存便于清空选项时返回数据信息
    this.optionsCopy = res1.data.data
  },
  mounted() {
    // 初始化, 调整样式
    this.params1 = {}
    // const res = document.getElementsByClassName('search-bar-col')
    // res[12].style = 'margin-left: 10px;margin-right: 1px'
  },
  methods: {
    pushToJIT(row) {
      sessionStorage.setItem('JITBillNo', row.billNo)
      this.$router.push(`/ODS/JITCombinedOrder`)
    },
    // 搜索查询方法
    search(params) {
      // ODS迭代自测流程参数正常,查询条件参数正常,
      // 如果选择创建时间,则拆份为开始与结束时间,否则删除参数属性
      if (params.createTime) {
        params.toCreateTime = moment(params.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
        params.fromCreateTime = moment(params.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        delete params.createTime
      }
      // 如果选择发货时间,则拆份为开始与结束时间,否则删除参数属性, 该参数后台暂未提供查询服务
      if (params.deliveryTime) {
        params.toDeliveryTime = moment(params.deliveryTime[1]).format('YYYY-MM-DD HH:mm:ss')
        params.fromDeliveryTime = moment(params.deliveryTime[0]).format('YYYY-MM-DD HH:mm:ss')
        delete params.deliveryTime
      }
      // 去除参数属性为空的非必要传递属性
      for (var e in params) {
        if (params[e] === '') {
          delete params[e]
        } else if (typeof (params[e]) === 'string') {
          params[e] = params[e].trim()
        }
      }
      // 对仓库代码信息传递格式进行处理
      for (var k in params) {
        if (k === 'fromExternalWarehouseCodeList' || k === 'toExternalWarehouseCodeList') {
          const arr = []
          params[k].map(item => {
            arr.push(item.value)
          })
          params[k] = arr
        }
      }
      // 重置提示文字显示属性
      this.getFlag = true
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
