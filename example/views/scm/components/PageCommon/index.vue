<template>
  <div class="page-bar">
    <el-pagination
      :base-url="url"
      :small="false"
      :current-page="params.pageNum"
      :page-sizes="[25]"
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
  name: 'PageCommon',
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
    },
    isRset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {
        pageSize: 25,
        pageNum: 1
      },
      totalPage: 0
    }
  },
  watch: {
    isRset(val) {
      this.reset()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 处理请求来的数据
    processing(data) {
      console.log(data, '123123333')
      const list = data.data.data
      // if (this.method === 'post') {
      //   list = data
      // }
      // console.log(list, 'dddddddddddddddddddddddddddddd')
      console.log(data.data.data, 'ddddddddddddddd')
      this.totalPage = list.total
      list.list.map(item => {
        for (var k in item) {
          if (item[k] === '' || item[k] === null) {
            item[k] = ''
          }
        }
      })
      this.$emit('query', list.list, list.total, list.currentInput, list.currentCount)
    },
    // 请求数据
    async getList(item, reset) {
      // 追加参数
      for (var k in item) {
        if (!item[k]) {
          delete item[k]
        }
      }
      if (item) {
        const params = { pageSize: this.params.pageSize }
        this.params = { ...this.defaultParameters, ...params, ...item }
      } else {
        this.params = { ...this.defaultParameters, ...this.params, ...item }
      }
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
          if (data.data.code !== '0') {
            this.$notify({
              title: '提示',
              message: data.data.msg,
              duration: 2000
            })
            data = {
              data: {
                data: {
                  total: 0,
                  list: []
                }
              }
            }
          }
          this.processing(data)
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
          if (data.data.code !== '0') {
            this.$notify({
              title: '提示',
              message: data.data.msg,
              duration: 2000
            })
            data = {
              data: {
                data: {
                  total: 0,
                  list: []
                }
              }
            }
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
      // console.log(this.params.pageSize, 'kkkkk')
      this.getList()
    },
    reset() {
      this.total = ''
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
