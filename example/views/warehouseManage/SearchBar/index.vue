<template>
  <div class="search-bar">
    <el-form ref="ruleForm">
      <el-row class="flexBox">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="flexBoxItem">
          <el-col v-if="option.type==='select'" class="search-bar-col">
            <!--下拉选择-->
            <el-form-item :label="option.label" style = "display: flex">
              <el-select
                :multiple="option.multiple"
                v-model="params[option.name]"
                :placeholder="option.placeholder||'全部'"
                :filterable="option.filterable"
                style="width: 100%;"
                collapse-tags
                clearable
                @change="option.multiple ? selectAll($event, option.options, option.name) : function(){}"
              >
                <el-option v-if="option.multiple && option.options.length > 0" label="全部" value="选项0"/>
                <el-option
                  v-for="(item, index) in option.options"
                  :label="item.label"
                  :value="item.value"
                  :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='lazySelect'" class="search-bar-col">
            <el-form-item :label="option.label" style = "display: flex">
              <el-select
                v-model="params[option.name]"
                :remote-method="remoteMethod"
                :loading="loading"
                style="width: 100%;"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入关键词">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='date'" class="search-bar-col">
            <!--时间单选-->
            <el-form-item :label="option.label" style = "display: flex">
              <el-date-picker
                v-model="params[option.name]"
                :placeholder="option.placeholder||'选择日期'"
                type="datetime"/>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='daterange'" class="search-bar-col">
            <!--时间范围选择-->
            <el-form-item :label="option.label" style = "display: flex">
              <el-date-picker
                v-model="params[option.name]"
                type="daterange"
                style="width: 100%;"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='input'" class="search-bar-col" >
            <el-form-item :label="option.label" style = "display: flex">
              <el-input
                v-model="params[option.name]"
                :placeholder="option.placeholder||'请填写'"
                :maxlength="option.maxlength"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='checkbox'" class="search-bar-col" >
            <el-form-item :label="option.label" style = "display: flex">
              <el-checkbox v-model="params[option.name]" :label="option.placeholder||'请填写'"/>
            </el-form-item>
          </el-col>
        </div>
        <el-button v-preventReClick v-show="isSearch" :disabled="searchDisable" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button v-preventReClick v-if="isExport" type="primary" icon="el-icon-download" @click="exportExcel(exportOptions)">导出</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'SearchBar123',
  components: { // 组件
  },
  props: {
    defaultParams: {
      type: Object,
      default: function() {
        return {}
      }
    },
    WidthNumber: {
      type: Number,
      default: 8
    },
    labelWidth: {
      type: Number,
      default: 120
    },
    options: {
      type: Array,
      default: function() {
        return []
      }
    },
    exportUrl: {
      type: String,
      default: ''
    },
    modelText: {
      type: String,
      default: '导出'
    },
    isExport: {
      type: Boolean,
      default: false
    },
    isImport: {
      type: Boolean,
      default: false
    },
    isModel: {
      type: Boolean,
      default: false
    },
    isReset: {
      type: Boolean,
      default: false
    },
    allParams: {
      type: Boolean,
      default: false
    },
    allOrederParams: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    isSearch: {
      type: Boolean,
      default: true
    },
    searchDisable: {
      type: Boolean,
      default: false
    },
    exportOptions: {
      type: Object,
      default: function() {
        return {}
      }
    },
    lazyUpdate: {
      type: Boolean,
      default: false
    }
  },
  data: function() { // 初始化数据
    return {
      loading: false,
      params: {},
      options1: []
    }
  },
  async created() {
    this.options.forEach((item) => {
      this.$set(this.params, item.name, '')
    })
  },
  mounted() {
    this.options.map((v, i) => {
      if (v.defaultValue) {
        this.$set(this.params, v.name, v.defaultValue)
      }
    })
    for (var k in this.defaultParams) {
      for (var e in this.params) {
        if (k === e) {
          this.params[e] = this.defaultParams[k]
        }
      }
    }
  },
  methods: { // 方法
    getParams() {
      return this.params
    },
    search() {
      const params = { ...this.params }
      for (const k in params) {
        if (k === 'daterange') {
          if (params[k]) {
            params.startDate = moment(params[k][0]).format('YYYY/MM/DD')
            params.endDate = moment(params[k][1]).format('YYYY/MM/DD')
          }
          delete params[k]
        }
        // 如果是数组， 过滤掉全选的参数
        if (params[k] instanceof Array) {
          params[k] = params[k].filter(item => item !== '选项0')
        }
        // if (this._.find(this.options, {'name': k}) && this._.find(this.options, {'name': k}).multiple) {
        //   params[k] = params[k].join(',')
        // }
      }
      this.$emit('search', params)
    },
    async getList(a) {
      const params = {
        warehouseNameLike: a
      }
      const res = await this.$api.getlogHouse(params)
      console.log(res)
      this.options1 = res.data.data.list.map(item => {
        return { value: item.warehouseName, label: item.warehouseName }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getList(query)
        }, 200)
      } else {
        this.options1 = []
      }
    },
    exportExcel() {
      this.$nextTick(() => {
        const params = this.exportOptions
        let flag = true
        if (params.hasParams) {
          for (var k in params.data) {
            if (!params.data[k]) {
              flag = false
            }
          }
          console.log(params, flag)
          if (!flag) {
            this.$notify({
              title: '错误',
              message: '请选择导出项',
              type: 'error',
              duration: 2000
            })
            return
          }
        }
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
          console.log(res.data)
          const blob = new Blob(['\ufeff' + res.data], { type: 'text/csv;charset=utf-8' })
          const url = window.URL.createObjectURL(blob)
          // 通过创建a标签实现
          const link = document.createElement('a')
          link.href = url
          // 对下载的文件命名
          link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '导出数据表.csv'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-bar {
  padding-right: 10px;
  background: #FFFFFF;
  .search-bar-col {
    height: 30px;
    .text-right {
      text-align: center;
      .textarea-radio-width{
        width: 50%;
      }
    }
    .width-one-hundred-percent {width: 100%}
    .move-left-50-percent {
      position: absolute;
        top:0;
        left:-50%;
    }
  }
}

  .tc{
    text-align: center;
    margin-bottom: 20px;
  }
  .pt {
    position: absolute;
    top: -100px;
  }
 .spanClass{
    display:inline-block;
    width:27%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
 .checkClass {
    display:inline-block;
    width:30px;
    overflow: hidden
 }
  .spanClass1{
    display:inline-block;
    width:45%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
  .spanClass2{
    display:inline-block;
    width:15%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
  .flexBox {
   display: flex;
   flex-wrap: wrap;
   padding: 5px 0;
 }
 .flexBoxItem {
    padding-left: 5px;
   height: 30px;
 }
</style>
