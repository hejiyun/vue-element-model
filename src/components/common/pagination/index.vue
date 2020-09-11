<template>
  <div class="page-bar">
    <el-pagination
      :small="false"
      :current-page="sendParams.pageNum"
      :page-sizes="Config.pageSizeList"
      :page-size="sendParams.pageSize"
      :total="totalPage"
      :url="Config.api"
      :method="Config.method"
      :layout="Config.layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'PageCommon',
  props: {
    pageConfig: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      sendParams: {
        pageSize: 10,
        pageNum: 1
      },
      totalPage: 0
    }
  },
  computed: {
    Config() {
      return Object.assign({
        pageSizeList: [10, 20, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper',
        url: '',
        method: 'get',
        noGetList: false
      }, this.pageConfig)
    }
  },
  created() {
    if (this.Config.pageSizeList && this.Config.pageSizeList.length > 0) {
      this.sendParams.pageSize = this.Config.pageSizeList[0]
    }
  },
  mounted() {
    if (!this.Config.noGetList) {
      this.getList()
    }
  },
  methods: {
    // 处理请求来的数据
    processing(data) {
      let result
      if (data.hasOwnProperty('list')) {
        result = data
      } else {
        result = data.data
      }
      this.totalPage = result.total
      if (!result.list) {
        result.list = []
      }
      result.list.map(item => {
        for (var k in item) {
          if (item[k] === undefined || item[k] === null) {
            item[k] = ''
          }
        }
      })
      this.$emit('loading', false)
      this.$emit('query', result.list)
    },
    // 请求数据
    async getList(params) {
      // 分页器请求不加载loading动画
      sessionStorage.setItem('noload', true);
      const resetParams = {
        pageSize: this.sendParams.pageSize,
        pageNum: this.sendParams.pageNum
      }
      // 同名属性后面的覆盖前面的
      if (params) {
        this.sendParams = { ...resetParams, ...params }
      }
      const axiosBase = {
        method: this.Config.method,
        url: this.Config.url
      }
      if (this.Config.method === 'post') {
        axiosBase['data'] = this.sendParams
      } else {
        axiosBase['params'] = this.sendParams
      }
      this.$emit('loading', true)
      const res = await this.$axios(axiosBase)
      this.processing(res.data)
    },
    // 翻页
    handleCurrentChange(val) {
      this.sendParams.pageNum = val
      this.getList()
    },
    // 设置每页显示的条数
    handleSizeChange(val) {
      this.sendParams.pageSize = val
      this.getList()
    }
  }
}
</script>

<style scoped>
  .page-bar {
    margin-top: 20px;
    text-align: right;
  }
  .el-pagination {
    white-space: normal;
  }
</style>
