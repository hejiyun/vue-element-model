<template>
  <div class="page-bar">
    <el-pagination
      :small="false"
      :current-page="Config.baseList.length ? sendParams[Config.baseList[0]] : sendParams.pageNum"
      :page-sizes="Config.pageSizeList"
      :page-size="Config.baseList.length ? sendParams[Config.baseList[1]] : sendParams.pageSize"
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
      sendParams: {},
      totalPage: 0
    }
  },
  computed: {
    Config() {
      return Object.assign({
        pageSizeList: [25, 50, 100], // 每页多少条
        layout: 'total, sizes, prev, pager, next, jumper', // 分页器格式, 这里默认全部, 可以自己修改
        baseList: [], // 传递, page, limit取值数组, 定义传递参数属性名, 第一个参数为当前页, 第二个参数为条数
        noGetList: false, // 第一次是否发送请求
        defaultParamter: {},
        request: function() { // 请求数据的方法请求
          return
        }
      }, this.pageConfig)
    }
  },
  created() {
    if (this.Config.baseList.length) {
      this.$set(this.sendParams, this.Config.baseList[0], 1)
      this.$set(this.sendParams, this.Config.baseList[1], 25)
      this.sendParams[this.Config.baseList[1]] = this.Config.pageSizeList[0]
    } else {
      this.sendParams = {
        pageSize: 25,
        pageNum: 1
      }
      this.sendParams.pageSize = this.Config.pageSizeList[0]
    }
  },
  mounted() {
    !this.Config.noGetList && this.getList()
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
      this.$emit('getCount', result.total)
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
      sessionStorage.setItem('noload', true)
      let resetParams = {}
      if (this.Config.baseList.length) {
        this.$set(resetParams, this.Config.baseList[0], this.sendParams[this.Config.baseList[0]])
        this.$set(resetParams, this.Config.baseList[1], this.sendParams[this.Config.baseList[1]])
      } else {
        resetParams = {
          pageSize: this.sendParams.pageSize,
          pageNum: this.sendParams.pageNum
        }
      }
      // 同名属性后面的覆盖前面的
      if (params) {
        this.sendParams = { ...resetParams, ...this.Config.defaultParamter, ...params }
      } else {
        this.sendParams = { ...this.Config.defaultParamter, ...this.sendParams }
      }
      this.$emit('loading', true)
      try {
        const res = await this.Config.request(this.sendParams)
        this.processing(res.data)
      } catch (error) {
        this.$emit('loading', false)
      }
    },
    // 翻页
    handleCurrentChange(val) {
      if (this.Config.baseList.length) {
        this.sendParams[this.Config.baseList[0]] = val
      } else {
        this.sendParams.pageNum = val
      }
      this.getList()
    },
    // 设置每页显示的条数
    handleSizeChange(val) {
      if (this.Config.baseList.length) {
        this.sendParams[this.Config.baseList[1]] = val
      } else {
        this.sendParams.pageSize = val
      }
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
