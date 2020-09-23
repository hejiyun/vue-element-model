<template>
  <el-container class="order-box ODSOrderDetailBox DeliveryDetail">
    <!-- 详情页展示信息自测正常, 自测阶段结束, 等待提测 -->
    <!-- // data接受传过来的集合内容, options设定当前每一个字段对应展示的label, key:设定的label,对应集合中的什么字段., -->
    <div class="padding-left-10">
      <detail-view :options="detailOptions" :data="baseText">
        <template slot="operation" slot-scope="scope">
          <el-button
            v-if="$route.params.isMerge && $route.params.isMerge === '1'"
            size="mini"
            style="color:blue;text-decoration:underline"
            type="text"
            @click="openDialog1(scope.rowData)">关联的合发单号</el-button>
        </template>
      </detail-view>
    </div>
    <el-row class="rowStyle">
      <el-form ref="form" :model="form">
        <el-col :xs="24" :sm="12" :md="12" :lg="3" :xl="2">
          <el-form-item >
            <el-select v-model="form.type" placeholder="请选择" @change="resetText">
              <el-option
                label="SKU条码"
                value="barCode"/>
              <el-option
                label="货号"
                value="materialCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-form-item>
            <el-input
              ref="int"
              v-model="form.textarea"
              :rows="3"
              type="text"
              class="widthLength"
              placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-form-item>
            <el-checkbox v-model="form.onlyDiffBill">只看发货差异</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="7" :xl="7">
          <el-form-item>
            <el-button v-preventReClick type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
            <el-button v-preventReClick type="primary" @click="exportWord">导出</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-col :span="24">
      <p><span v-if="getFlag && tableData.length === 0" class="spanStyle">没有符合查询条件的结果,请更改查询条件试一试</span></p>
    </el-col>
    <!-- 列表表格 -->
    <table-common v-loading="loading" v-if="flag" :height="150" :table-header="deliveryDetailtableHeader" :change-cell="[9]" :change-cell-color="'red'" :table-data="tableData" class="del" @getSortList="getSortMethod" />
    <!-- 分页器 -->
    <page-common
      ref="page"
      :api="`/bff/api/v1/dispatch/details/_page?billNo=${encodeURI(this.$route.params.id)}`"
      method="post"
      @query="query"
      @loading="load"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%">
      <el-card class="box-card">
        <span v-if="JITCombinedList.length === 0">暂无数据</span>
        <div v-else>
          <h3>合发单号</h3>
          <div v-for="(item, index) in JITCombinedList" :key="index" class="text item">
            <el-button
              size="mini"
              style="color:blue;text-decoration:underline"
              type="text"
              @click="$router.push(`/ODS/JITCombinedOrderDetail/${item}`)">{{ item }}</el-button>

          </div>
        </div>
      </el-card>
    </el-dialog>
  </el-container>
</template>

<script>
import PageCommon from '@/components/PageCommon'
import TableCommon from '@/components/TableCommon'
import detailView from './detailView'
import TableText from '@/textResources/tableText'
import detailText from '@/textResources/detail'
import { get } from '@/utils/request'
// 合发单状态请求接口
const getJITNo = (params) => get(`/bff/ods/api/v1/merge/dispatch/r/query_merge_dispatch_no?dispatchNo=${params}`)
// import moment from 'moment'
export default {
  name: 'DeliveryDetail',
  components: {
    PageCommon, // 分页器组件
    TableCommon, // 表格组件
    detailView // 详情组件
  },
  data() {
    return {
      form: { // 搜索条件参数
        type: 'barCode',
        onlyDiffBill: '',
        textarea: ''
      },
      JITCombinedList: [],
      dialogVisible: false,
      curData: [1, 2, 3],
      getFlag: false, // 控制查询无结果显示文字变量
      detailOptions: detailText.deliveryOptions, // 详情组件选项参数
      deliveryDetailtableHeader: TableText.deliveryDetailtableHeader, // 表格组件选项参数
      tableData: [], // 表格数组
      flag: false, // 控制表格显示变量
      baseText: {}, // 详情数据来源变量
      defaultExportOptions: { // 默认导出变量
        url: '/bff/api/v1/dispatch/_export', // 导出地址
        data: {
          billNoList: [this.$route.params.id] // 导出参数
        },
        method: 'post', // 导出方法
        hasParams: true // 导出参数是否存在
      },
      loading: false // 加载动画变量
    }
  },
  beforeDestroy() {
    // 页面的变量后期可整理，组件销毁时，可以将变量释放掉。
  },
  async created() {
    // 获取基本信息
    const id = this.$route.params.id
    // 获取详情
    const res = await this.$api.getDelivery(id)
    this.baseText = res.data.data
    console.log(this.baseText)
  },
  mounted() {
    this.flag = true
  },
  methods: {
    async openDialog1(row) {
      this.curData = row
      this.dialogVisible = true
      const res = await getJITNo(this.$route.params.id)
      this.JITCombinedList = res.data.data
    },
    // 重置输入框
    resetText() {
      this.form.textarea = ''
    },
    // 列表排序方法
    getSortMethod(column) {
      if (column.order) {
        console.log('点击触发排序,', column.order)
        const data = {
          orderByList: [{
            columnName: 'difference_amount',
            order: column.order
          }]
        }
        this.$refs.page.getList(data)
      }
    },
    // 导出
    exportWord() {
      const params = this.defaultExportOptions
      this.$axios({
        method: params.method,
        url: params.url,
        data: params.data
        // responseType: 'blob'
      }).then(res => {
        if (res.data.code) {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        const blob = new Blob(['\ufeff' + res.data], { type: 'text/csv;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '发货单导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 查询方法
    search() {
      const params = {}
      // 转换传递参数属性,
      params[this.form.type] = this.form.textarea.trim() || this.form.textarea
      params['onlyDiffBill'] = this.form.onlyDiffBill
      // 重置提示文字显示属性
      this.getFlag = true
      // 请求数据
      this.$refs.page.getList(params)
    },
    // 获取列表数据
    query(data) {
      this.tableData = data
    },
    // 加载动画
    load(status) {
      this.loading = status
    },
    // 重置
    reset() {
      for (var k in this.form) {
        this.form[k] = ''
      }
      this.form.type = 'barCode'
    }
  }
}
</script>

<style scoped>
.spanStyle{
  margin-left: 40px;
  color:red
}
.widthLength{
  width:80%
}
.rowStyle{
  padding: 10px 5px 0px 5px
}
.Hcolor{
  color: #0a76a4
}
  .order-box {
    display: block;
    width:100%;
    padding: 15px 40px;
  }
  .padding-left-10 {
 padding-left:10px
}
  .export-btn{
    position: absolute;
    top: 10px;
    right: 30px;
    z-index: 99;
  }
  .tabel-detail span:last-child{
    display: inline-block;
    margin-left: 20px;
    font-weight: 200;

  }
  .tabel-detail span{
    font-weight: 200;
    font-size: 15px;
  }
  .tabel-detail{
    overflow: hidden;
    padding-bottom: 30px;
  }
  .mt{
    margin-top: 30px;
  }
  .tr{
    text-align: right;
  }
   .blue-line{
    width: 15px;
    font-weight: 900;
    color: blue;
    display: inline-block;
  }
  .child-class{
    text-align:center;
    border-bottom:1px solid #ccc
  }
</style>
<style>
 .del .el-table__body tr,
 .del .el-table__body td {
    padding: 0;
    height: 35px;
}
</style>
