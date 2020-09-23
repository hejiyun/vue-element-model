<template>
  <div>
    <el-container class="order-box">
      <el-col :span="24" >
        <span>历史折扣列表</span>
        <el-divider/>
      </el-col>
      <el-col :span="24">
        <p class="mr"><span class="blue-line">|</span>查询条件</p>
        <search-bar
          :all-oreder-params="true"
          :options="dealersSearchBarOptions"
          @search="search"
        />
        <el-col class="text-right search-bar-btn-col">
          <el-button type="primary" icon="el-icon-search" @click="search" >搜索</el-button>
          <el-button type="primary" icon="el-icon-search" @click="console.log(1)">导出</el-button>
        </el-col>
      </el-col>
      <p class="mr"><span class="blue-line">|</span>查询结果</p>
      <el-table
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        align="center"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="年份"
          width="300"/>
        <el-table-column
          prop="date"
          label="季节"
          width="220"/>
        <el-table-column
          prop="date"
          label="取价方式"
          width="220"/>
        <el-table-column
          prop="date"
          label="客户代码"
          width="220"/>
        <el-table-column
          prop="date"
          label="客户简称"
          width="220"/>
        <el-table-column
          prop="date"
          label="品牌"
          sortable
          width="220"/>
        <el-table-column
          prop="date"
          label="类别"
          sortable
          width="220"/>
        <el-table-column
          prop="date"
          label="期货折扣"
          sortable
          width="220"/>
        <el-table-column
          prop="date"
          label="现货折扣"
          sortable
          width="220"/>
        <el-table-column
          prop="date"
          label="是否可用"
          sortable
          width="220"/>
      </el-table>
      <el-pagination
        :current-page.sync="currentPage4"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="10"
        :total="400"
        layout="total, sizes, prev, pager, next, jumper"
        style="text-align: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </el-container>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar'

export default{
  name: 'HistoryDiscount',
  components: {
    SearchBar
  },
  data: function() {
    return {
      dealersSearchBarOptions: [{
        type: 'input',
        name: 'name',
        placeholder: '全部',
        label: '年份'
      }, {
        type: 'select',
        name: 'required',
        options: [
          { id: 0, name: '春' },
          { id: 1, name: '夏' },
          { id: 2, name: '秋' },
          { id: 3, name: '冬' }
        ],
        placeholder: '全部',
        label: '季节'
      }, {
        type: 'input',
        name: 'name',
        placeholder: '请输入查询客户代码',
        label: '客户代码'
      }, {
        type: 'input',
        name: 'name',
        placeholder: '请输入关键字',
        label: '客户简称'
      }, {
        type: 'input',
        name: 'name',
        placeholder: '请输入关键字',
        label: '货品类别'
      }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      currentPage4: 4
    }
  },
  created() {
  },
  methods: {
    search(params) {
      this.params = { ...params }
      this.$refs.page.getList(this.params)
    },
    formatter(row, column) {
      return row.address
    },
    handleView(index, row) {
      this.$router.push(`/TradingPlatform/List/ListDetail/${index}`)
    }
  }
}
</script>
<style scoped>
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
    text-align: right;
  }
  .text-right button:last-child {
    margin-right: 5%;
  }
</style>
