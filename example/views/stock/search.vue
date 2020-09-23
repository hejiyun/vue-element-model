<template>
  <div>
    <el-container class="order-box">
      <el-col :span="24">
        <p class="mr"><span class="blue-line">|</span>查询条件</p>
        <el-row>
          <el-form ref="form" :model="form">
            <!-- <el-col :span="6">
              <el-form-item label="条码">
                <el-input v-model="form.barCodeList" placeholder="支持批量输入,以,号隔开" type="textarea"/>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item>
                <el-col :span="6">
                  <el-select v-model="form.type" style="width:100%" size="medium" @change="changeInput">
                    <el-option value="barCodeList" label="条码"/>
                    <el-option value="materialCodeList" label="货号"/>
                  </el-select>
                  <el-col :span="22" :offset="2">
                    <p v-if="!show" style="color: #666">最多支持50条</p>
                    <p v-if="show" style="color: #666">最多支持10条</p>
                  </el-col>
                </el-col>
                <el-col :span="1">
                  <span style="color: red;padding-left:5px;font-size:16px">*</span>
                </el-col>
                <el-col :span="17">
                  <el-input ref="gdt" :autosize="{ minRows: 2, maxRows: 3 }" v-model="form.textarea" placeholder="可批量输入 以英文,号隔开" type="textarea" @keyup.native="numLimit" @scroll="showScrollBar"/>
                </el-col>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="货号">
                <el-input v-model="form.materialCodeList" placeholder="支持批量输入,以,号隔开"/>
              </el-form-item>
            </el-col> -->
            <el-col :span="10">
              <el-form-item label="仓库" label-width="60px">
                <Select :isRset="isReset" @getValue="getvalue"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="未分配可用数≥" label-width="130px">
                <el-input v-model="form.minUnallocatedQty" placeholder="请输入整数" type="number" @blur="getInteger"/>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="8">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="search(form)">查询</el-button>
              <el-button type="primary" @click="reset(form)">重置</el-button>
              <el-button :disabled="undisable" type="primary" @click="Export(form)">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <p class="mr"><span class="blue-line">|</span>查询结果 <span v-if="nowTime" style="float:right;margin-right: 10px">库存查询时间: {{ nowTime }}</span></p>
      <table-common :table-header="stocktableHeader" :table-data="tableData" :height="500" @getSortList="gfetLisdt"/>
      <page-common
        ref="page"
        api="/bff/api/v1/physical_inventory/_list"
        method="post"
        @query="query"
        @loading="load"
      />
    </el-container>
  </div>
</template>

<script>
import PageCommon from './PageCommon'
import TableCommon from './TableCommon'
import TableText from '@/textResources/tableText'
import Select from '@/components/searchBar/text'
import moment from 'moment'
// const arr2 = []
export default{
  name: 'SeaderStock',
  components: {
    PageCommon,
    TableCommon,
    Select
  },
  data() {
    return {
      textarea2: '',
      isReset: false,
      nowTime: '',
      stocktableHeader: TableText.stocktableHeader,
      tableData: [],
      undisable: false,
      currentPage4: 4,
      form: {
        textarea: '',
        type: 'barCodeList',
        warehouseCodeList: [],
        minUnallocatedQty: ''
      },
      options: [],
      loading: false,
      orderList: [],
      oldList: [],
      show: false
    }
  },
  watch: {
  },
  async created() {
  },
  mounted() {
  },
  methods: {
    gfetLisdt(column) {
      if (column.order) {
        const data = {
          orderByList: [{
            columnName: column.prop,
            order: column.order
          }]
        }
        data[this.form.type] = this.oldList
        this.$refs.page.getList(data)
      }
    },
    changeInput(form) {
      this.form.textarea = ''
      if (this.form.type === 'barCodeList') {
        this.show = false
      } else {
        this.show = true
      }
    },
    numLimit(form) {
      this.form.textarea = this.form.textarea.replace(/，/g, ',')
      // console.log(this.form.textarea, 'dshfj')
      const arr3 = this.form.textarea.split(',')
      // console.log(arr3)
      if (arr3.length <= 50) {
        return arr3
      } else {
        const arr4 = arr3.splice(0, 50)
        // console.log(arr4)
        this.form.textarea = arr4.join(',')
      }
      // this.$refs.gdt.scrollTop = this.$refs.gdt.scrollHeight
    },
    showScrollBar() {
    },
    getvalue(val) {
      if (val !== '') {
        const arr = []
        val.map(item => {
          arr.push(item.value)
        })
        this.form.warehouseCodeList = arr
      } else {
        this.form.warehouseCodeList = []
      }
    },
    getInteger() {
      this.form.minUnallocatedQty = parseInt(this.form.minUnallocatedQty)
      // console.log(this.form.minUnallocatedQty)
    },
    search(form) {
      const params = { ... form }
      params[this.form.type] = this.form.textarea
      delete params['type']
      delete params['textarea']
      if (this.form.textarea === '') {
        this.$alert('查询时SKU条码和货号必输入一项', '提示', {
          confirmButtonText: '确定'
        })
      }
      for (const k in params) {
        if (k === 'materialCodeList' || k === 'barCodeList') {
          if (params[k] === '') {
            delete params[k]
          } else {
            if (params[k]) {
              const arr = params[k].split(',') || params[k].split('，') || [params[k]]
              const arr2 = []
              arr.map(item => {
                item = item.replace(/[\r\n]/g, '')
                arr2.push(item)
              })
              params[k] = arr2
            }
          }
        }
      }
      if (this.form.textarea !== '') {
        this.nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm')
      }
      for (var k in params) {
        if (k === 'materialCodeList' || k === 'barCodeList') {
          this.oldList = params[k]
        }
      }
      this.$refs.page.getList(params)
    },
    query(data) {
      this.tableData = data
    },
    load(status) {
      this.loading = status
    },
    Export(params) {
      const form = { ...params }
      form[this.form.type] = params.textarea
      delete form['type']
      delete form['textarea']
      for (const k in form) {
        if (k === 'materialCodeList' || k === 'barCodeList') {
          if (form[k] !== '') {
            if (form[k].indexOf(',') !== -1) {
              form[k] = form[k].split(',')
            } else {
              form[k] = [form[k]]
            }
            if (form[k].length > 50 && k !== 'warehouseCodeList') {
              this.$notify({
                title: '提示',
                message: 'sku或货号最多只能支持50条导出',
                duration: 2000
              })
              return
            }
          }
        }
        if (k === 'warehouseCodeList') {
          if (form[k] === '') {
            form[k] = []
          }
        }
      }
      const that = this
      this.undisable = true
      this.$axios({
        method: 'post',
        url: `/bff/api/v1/physical_inventory/_export`,
        data: form,
        responseType: 'blob'
      }).then(res => {
        that.undisable = false
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
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '库存查询导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    reset(form) {
      for (const k in form) {
        form[k] = ''
      }
      this.isReset = !this.isReset
      this.form.type = 'barCodeList'
      this.nowTime = ''
      this.readonly = false
    }
  }
}
</script>
<style scoped>
  *{font-size: 12px;}
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
  /* .gdt {
    overflow:scroll;
    overflow-x:hidden;
    height:100px;
  } */
</style>
