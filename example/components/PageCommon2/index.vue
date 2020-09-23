<template>
  <div class="page-bar">
    <el-pagination
      :base-url="url"
      :small="false"
      :current-page="params.pageNum"
      :page-sizes="[25,50,100,200]"
      :page-size="params.pageSize"
      :total="totalPage"
      :url="api"
      :method="method"
      :param="defaultParameters"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

</template>

<script>
import { get } from '@/utils/request'

export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    api: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: get
    },
    defaultParameters: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      params: {
        pageSize: 25,
        pageNum: 1
      },
      totalPage: 200
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 处理请求来的数据
    processing(data) {
      const list = data.data.data
      // if (this.method === 'post') {
      //   list = data
      // }
      console.log(data)
      this.totalPage = list.total
      this.$emit('query', list.list)
    },
    // 请求数据
    async getList(item, reset) {
      // 追加参数
      this.params = { ...this.defaultParameters, ...this.params, ...item }
      // 修改基础地址
      const url = this.url ? this.url : ''
      // loading动画&获取数据
      this.$emit('loading', true)
      // 带参请求
      if (!reset) {
        try {
          let data
          if (this.method === 'get') {
            data = await get(url + this.api, this.params)
          } else {
            data = await this.$axios[this.method](url + this.api, this.params)
          }
          this.processing(data)
        } catch (e) {
          console.log(e)
        } finally {
          this.$emit('loading', false)
        }
      }

      // 无参请求
      if (reset) {
        try {
          let data
          if (this.method === 'get') {
            data = this.$axios[this.method](url + this.api, {
              params: {
                pageSize: this.params.pageSize,
                pageNum: this.params.pageNum
              }
            })
          } else {
            data = this.$axios[this.method](url + this.api, {
              pageSize: this.params.pageSize,
              pageNum: this.params.pageNum
            })
          }

          this.processing(data)
        } finally {
          this.$emit('loading', false)
        }
      }
    },
    // 翻页
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getList()
    },
    // 设置每页显示的条数
    handleSizeChange(val) {
      this.params.pageSize = val
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
