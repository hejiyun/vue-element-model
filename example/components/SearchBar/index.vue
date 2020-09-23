<template>
  <!-- 文档 -->
  <div class="search-bar">
    <el-form ref="ruleForm" :label-width="`${labelWidth}px`" label-position="left">
      <el-row @keyup.13="search">
        <el-col :span="24">
          <el-row :gutter="20">
            <div
              v-for="(option, index) in options"
              :key="index">
              <el-col v-if="option.type==='select'" :xs="24" :sm="12" :md="8" :lg="WidthNumber" :xl="WidthNumber" class="search-bar-col">
                <!--下拉选择-->
                <el-form-item :label="option.label">
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
              <el-col v-if="option.type==='date'" :xs="24" :sm="12" :md="8" :lg="WidthNumber" :xl="WidthNumber" class="search-bar-col">
                <!--时间单选-->
                <el-form-item :label="option.label">
                  <el-date-picker
                    v-model="params[option.name]"
                    :placeholder="option.placeholder||'选择日期'"
                    style="width: 100%;"
                    type="datetime"/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='daterange'" :xs="24" :sm="12" :md="8" :lg="WidthNumber" :xl="WidthNumber" class="search-bar-col">
                <!--时间范围选择-->
                <el-form-item :label="option.label">
                  <el-date-picker
                    v-model="params[option.name]"
                    type="daterange"
                    style="width: 100%;"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='input'" :xs="24" :sm="12" :md="8" :lg="WidthNumber" :xl="WidthNumber" class="search-bar-col" >
                <el-form-item :label="option.label">
                  <el-input
                    v-model="params[option.name]"
                    :placeholder="option.placeholder||'请填写'"
                    clearable/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='checkbox'" :xs="24" :sm="12" :md="8" :lg="WidthNumber" :xl="WidthNumber" class="search-bar-col" >
                <el-form-item :label="option.label">
                  <el-checkbox v-model="params[option.name]" :label="option.placeholder||'请填写'"/>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-col>
        <el-col :span="24" class="search-bar-btn-col tc">
          <el-button v-preventReClick v-show="isSearch" :disabled="searchDisable" type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button v-if="isReset" type="primary" @click="resetForm('ruleForm')">重置</el-button>
          <el-button v-preventReClick v-if="isExport" type="primary" icon="el-icon-download" @click="exportExcel(exportOptions)">导出</el-button>
          <el-button v-if="isImport" type="primary" icon="el-icon-upload2" @click="importExcel">{{ text }}</el-button>
          <el-button v-preventReClick v-if="isModel" type="primary" icon="el-icon-download" @click="outExport">{{ modelText }}</el-button>
          <!-- 自定义插入按钮 -->
        </el-col>
      </el-row>
    </el-form>
    <div v-show="false">
      <form ref="myform" :action="`${exportOptions.url}`" :method="`${exportOptions.method}`">
        <input v-for="(val, key, index) in exportOptions.data" :key="index" :value="val" :name="`${key}`" type="text">
        <input type="submit" value="提交">
      </form>
    </div>
    <el-table
      v-show="false"
      id="table"
      style="width: 100%">
      <el-table-column
        v-for="(item,index) in outExportOptions"
        :key="index"
        :label="item"
        width="180"/>
    </el-table>
  </div>
</template>
<script>
import moment from 'moment'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'SearchBar123',
  components: { // 组件
  },
  props: {
    outExportName: {
      type: String,
      default: '导出文件.xlsx'
    },
    outExportOptions: {
      type: Array,
      default: function() {
        return {}
      }
    },
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
      // 多选下拉框全选对应参数
      oldOptions: ['选项0'],
      params: {},
      status: 0,
      text: '导入商品清单',
      warehouseType: '',
      currentOption: []
    }
  },
  async created() {
    this.options.forEach((item) => {
      this.$set(this.params, item.name, '')
    })
    if (this.lazyUpdate) {
      const res = await this.$api.getwarehouseType1()
      const arr = res.data.data.map(item => {
        return item.dictCode
      })
      this.warehouseType = arr.join(',')
      const str = this.warehouseType
      this.getList('', str)
    }
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
    // 远程下拉框获取数据
    async getList(query, type) {
      const res = await this.$api.getwarehouseList(query, type)
      if (res.data.data.warehouseList.length === 0) {
        this.lazyOption = []
      } else {
        this.lazyOption = res.data.data.warehouseList.map(item => {
          return { value: item.externalWarehouseCode, label: item.warehouseName, type: item.warehouseTypeName, isSelect: false }
        })
      }
      this.checkTotal = false
    },
    // 多选下拉实现全选功能
    selectAll(val, options, name) {
      const allValues = ['选项0']
      // 保留所有值
      for (const item of options) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions[1]
      // 若是全部选择
      if (val.includes('选项0')) this.params[name] = allValues
      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('选项0') && !val.includes('选项0')) this.params[name] = []
      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('选项0') && val.includes('选项0')) {
        const index = val.indexOf('选项0')
        val.splice(index, 1) // 排除全选选项
        this.params[name] = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('选项0') && !val.includes('选项0')) {
        if (val.length === allValues.length - 1) this.params[name] = ['选项0'].concat(val)
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldOptions[1] = this.params[name]
    },
    checkStatus(item) {
      this.$emit('chooseStatus', item)
    },
    checkNode(data, name) {
      // 测试一下,
      const val = []
      data.map(item => val.push(item[0]))
      this.params[name] = val
    },
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
    importExcel() {
      this.$emit('import')
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
          data: params.data,
          responseType: 'blob'
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
      })
    },
    resetForm() {
      for (var k in this.params) {
        this.params[k] = ''
      }
      this.$emit('resetForm', '重置成功')
    },
    outExport() {
      const wb = XLSX.utils.table_to_book(document.querySelector('#table'))
      /* #table 就是表格的id */
      const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.outExportName)
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    }
  }
}
</script>
<style scoped>
.search-bar {
  margin: 10px 0;
  background: #FFFFFF;
  border: 1px solid #cccccc;
  padding: 20px 20px 0px 20px;
  box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1);
}
  /* .search-bar-col {
    margin-bottom: 10px;
  } */
  .tc{
    text-align: center;
    margin-bottom: 10px;
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
</style>
