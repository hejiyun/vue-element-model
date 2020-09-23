<template>
  <div>
    <el-container class="order-box B2BReturnBox">
      <el-col :span="24">
        <search-bar
          ref="sh"
          :all-oreder-params="true"
          :options="dealersSearchBarOptions"
          :options-copy="optionsCopy"
          :width-px="120"
          :out-export-options="modelList"
          :out-export-name="modelText"
          :is-search="true"
          @search="search"
          @import="dialogVisible = true"
        >
          <template slot="btn">
            <el-button type="primary" @click="importExcel('RETURN_DISCOUNT_TEMPLATE')">导入退货单(折扣)</el-button>
            <el-button class="p-r" type="text" @click="exportCut">
              <span class="span-model">导出模板(折扣)</span>
            </el-button>
            <el-button class="ml-90" type="primary" @click="importExcel('RETURN_SALES_AMOUNT_TEMPLATE')">导入退货单(结算金额)</el-button>
            <el-button class="p-r" type="text" @click="exportPrice">
              <span class="span-model">导出模板(结算金额)</span>
            </el-button>
          </template>
        </search-bar>
      </el-col>
      <table-common :height="150" :table-header="returntableHeader" :table-data="tableData" :table-button-width="120" table-button @getSortList="getSort">
        <template slot="btn" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handleView(scope.rowData.row)">查看</el-button>
        </template>
      </table-common>
      <page-common
        ref="page"
        :page-size-list="[50, 100]"
        api="/bff/b2b/api/v1/ret_order/_list"
        method="post"
        @query="query"
        @loading="load"
      />
      <el-dialog :visible.sync="dialogVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="max-width: 400px; margin-left:50px;">
          <el-form-item label="客户" prop="customerCode">
            <el-select v-model="temp.customerCode" filterable clearable placeholder="请输入客户" style="width: 90%">
              <el-option
                v-for="item in customerList"
                :key="item.value"
                :label="item.value + ' : ' + item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="手工单号" prop="123">
            <el-input v-model="temp.manualBillNo" placeholder="请输入手工单号" style="width: 90%"/>
          </el-form-item>
          <el-form-item label="仓库" prop="cangku">
            <el-select v-model="temp.cangku" filterable clearable placeholder="请输入仓库代码或名称" style="width: 90%">
              <el-option
                v-for="item in warehouseList"
                :key="item.value"
                :label="item.value + ' : ' + item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="退货类型" prop="quality">
            <el-select v-model="temp.quality" filterable clearable placeholder="请输入退货类型代码或名称" style="width: 90%">
              <el-option
                v-for="item in returnTypeList"
                :key="item.value"
                :label="item.value + ' : ' + item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item >
          <el-upload
            ref="uploadx"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            class="upload-demo"
            name="file"
            list-type="text"
            accept=".xls,.xlsx,.xlsm"
            action="aa"
            multiple>
            <el-button size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传excel文件，仅限格式xlsx、xls、xlsm，单个文件不超过10MB</div>
          </el-upload>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-preventReClick @click="dialogVisible = false">取消</el-button>
          <el-button :disabled="isDisable" type="primary" @click="createData('dataForm')">确定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import SearchBar from './common/SearchBar'
import PageCommon from '@/components/PageCommon'
import TableCommon from '@/components/TableCommon'
import TableText from '@/textResources/tableText'
import searchBarOptions from '@/textResources/searchBarOptions'
import moment from 'moment'
import { get } from '@/utils/request'
// 权限菜单请求接口
const getRole = () => get('/bff/b2b/api/v2/auth/createRetOrder')

export default{
  name: 'ReturnList',
  components: {
    SearchBar,
    PageCommon,
    TableCommon
  },
  data: function() {
    return {
      modelList: ['*货号', '*尺码', '*数量', '*折扣'],
      modelText: '订单模板(折扣).xlsx',
      isDisable: false, // 防重点击
      getFlag: false, // 控制无结果时显示提示文字
      warehouseList: [], // 仓库数据
      moment: moment, // 第三方插件, 更改时间格式
      dealersSearchBarOptions: searchBarOptions.dealersSearchBarOptions, // 搜索选项数组
      returntableHeader: TableText.returntableHeader, // 表格表头信息
      tableData: [], // 表格数据
      optionsCopy: [], // 传递仓库数据
      rules: { // 校验规则
        customerCode: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        cangku: [{ required: true, message: '仓库不能为空', trigger: 'change' }],
        quality: [{ required: true, message: '退货类型不能为空', trigger: 'change' }]
      },
      dialogVisible: false, // 导入退货弹窗变量
      formData: [], // 弹窗内容信息
      discount: 0, // 计数变量
      customerList: [], // 客商信息
      temp: { // 弹窗信息变量
        id: undefined,
        customerCode: undefined, // 客商代码
        attachName: undefined, // 无用
        file: undefined, // 无用
        bizType: undefined, // 无用
        manualBillNo: undefined, // 手工单号
        cangku: undefined, // 选择仓库
        sourceBillNo: undefined // 来源订单号
      },
      orderByList: [], // 排序数据
      returnTypeList: [],
      str: ''
    }
  },
  async created() {
    // 获取全部仓库信息
    const res3 = await this.$api.getwarehouse('')
    const warehouseList = res3.data.data.warehouseList
    // 修改仓库数据格式以适应下拉框
    warehouseList.map(item => {
      item['label'] = item.warehouseName
      item['value'] = item.warehouseCode
    })
    this.optionsCopy = warehouseList
    this.warehouseList = warehouseList
    // 获取客商信息
    const res1 = await this.$api.getCustormer('')
    // 修改客商数据格式以适应下拉框
    res1.data.data.map(item => {
      item['label'] = item.shortNameValue
      item['value'] = item.customerCode
    })
    this.customerList = res1.data.data
    // 获取搜索下拉框数据
    const resObj = await this.$api.getSearchTypeObj()
    const retOrderStatus = resObj.data.data.retOrderStatus
    // 转换数据格式
    if (retOrderStatus.length) {
      retOrderStatus.map(item => {
        item['label'] = item.value
        item['value'] = item.code
      })
    }
    const retType = resObj.data.data.qualityTypes
    if (retType.length) {
      retType.map(item => {
        item['label'] = item.value
        item['value'] = item.code
      })
    }
    this.dealersSearchBarOptions[1].options = retOrderStatus
    this.dealersSearchBarOptions[3].options = retType
    this.returnTypeList = retType
  },
  mounted() {
  },
  methods: {
    exportCut() {
      this.modelList = ['*货号', '*尺码', '*数量', '*折扣', '来源单号']
      this.modelText = '退货单模板(折扣).xlsx'
      this.$nextTick(() => {
        this.$refs.sh.outExport()
      })
    },
    exportPrice() {
      this.modelList = ['*货号', '*尺码', '*数量', '*含税结算金额']
      this.modelText = '退货单模板(结算金额).xlsx'
      this.$nextTick(() => {
        this.$refs.sh.outExport()
      })
    },
    // 导入订单函数
    importExcel(str) {
      this.str = str
      this.dialogVisible = true
    },
    // 导出事件
    Export() {
      this.$refs.sh.outExport()
    },
    // 查询方法函数
    search(params) {
      console.log(params, 'canshu')
      const params1 = { ...params }
      // 判断是否包含时间, 时间有值则添加开始与结束时间属性
      // 并删除空属性
      for (var k in params1) {
        if (k === 'createTime') {
          if (params1[k]) {
            params1.begin = moment(params1[k][0]).format('YYYY/MM/DD HH:mm:ss')
            params1.end = moment(params1[k][1]).format('YYYY/MM/DD HH:mm:ss')
          }
          delete params1[k]
        }
        if (!params1[k]) {
          delete params1[k]
        }
      }
      // 如果有排列规则, 则传递参数
      if (this.orderByList) {
        params['orderByList'] = this.orderByList
      }
      this.getFlag = true
      this.$refs.page.getList(params1)
    },
    // table数据源
    query(data) {
      this.tableData = data
    },
    // 加载动画函数
    load(status) {
      this.loading = status
    },
    // 点击排序触发函数
    getSort(column) {
      // 如果有排序, 则将排序规则保存并查询数据
      if (column.order) {
        const data = {
          orderByList: [{
            columnName: column.prop,
            order: column.order === 'descending' ? 'DESC' : 'ASC'
          }]
        }
        this.orderByList = data.orderByList
        this.$refs.page.getList(data)
      }
    },
    formatter(row, column) {
      return row.address
    },
    // 跳转详情页
    handleView(row) {
      console.log(row)
      this.$router.push(`/TradingPlatform/returnList/creditDetail/${row.retOrderNo}`)
    },
    // 关闭弹窗
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 获取详情信息
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 移除触发函数
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 导入退货商品函数
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const that = this
          // // 如果客商/仓库/品质未选, 则直接提示并结束逻辑
          // if (!this.temp.customerCode || !this.temp.cangku || !this.temp.quality) {
          //   this.$notify({
          //     title: '错误',
          //     message: '客户，仓库及品质为必选项',
          //     type: 'error',
          //     duration: 2000
          //   })
          //   return
          // }
          // 此处可修改, 暂留至整改计划
          this.isDisable = true
          setTimeout(() => {
            that.isDisable = false
          }, 1000)
          that.formData = new FormData()
          // 触发表单上传方法
          that.$refs['uploadx'].submit()
          // 如果是一次, 则结束逻辑
          if (this.discount === 1) {
            this.discount = 0
            return
          }
          this.$refs['dataForm'].validate(async(valid) => {
            if (valid) {
              // 将用户填选信息同步至formData中
              const customerName = this.customerList.filter(item => item.value === this.temp.customerCode)
              that.formData.append('customerCode', this.temp.customerCode)
              that.formData.append('customerName', customerName.length ? customerName[0].label : '')
              that.formData.append('templateModel', this.str || '')
              that.formData.append('manualBillNo', this.temp.manualBillNo || '')
              const warehouse = this.warehouseList.filter(item => item.value === this.temp.cangku)
              that.formData.append('warehouseCode', this.temp.cangku)
              that.formData.append('warehouseName', warehouse.length ? warehouse[0].label : '')
              that.formData.append('retType', this.temp.quality)
              // 判断不存在文件或文件超过10M的情况, 结束逻辑
              if (!that.formData.get('file')) {
                this.$notify({
                  title: '错误',
                  message: '文件不能为空',
                  type: 'error',
                  duration: 2000
                })
                return
              }
              if (that.formData.get('file').size / 1024 / 1024 >= 10) {
                this.$notify({
                  title: '错误',
                  message: '上传文件大小不能超过 10MB!',
                  type: 'error',
                  duration: 2000
                })
                return
              }
              await getRole()
              try {
                // 导入退货单并判断异常处理
                const res = await this.$api.createReturnOrder(that.formData)
                if (res.data.code === '4011005') {
                  this.$notify({
                    title: '错误',
                    message: res.data.msg,
                    type: 'error',
                    duration: 2000
                  })
                  this.$router.push('/login')
                  return
                }
                if (res.data.code !== '0') {
                  this.$notify({
                    title: '错误',
                    message: res.data.msg,
                    type: 'error',
                    duration: 2000
                  })
                  return
                }
                this.discount = 0
                this.dialogVisible = false
                this.$notify({
                  title: '成功',
                  message: '导入成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs.page.getList(this.params)
                })
                // 清空表单项
                that.$refs['uploadx'].clearFiles()
              } catch (e) {
                this.$notify({
                  title: '错误',
                  message: e.response.data.msg || '导入失败, 请稍后重试',
                  type: 'error',
                  duration: 2000
                })
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传文件前触发函数
    beforeUpload(file) {
      // 过滤不符合条件文件及异常处理
      const str = file.name.substring(file.name.length, file.name.length - 5)
      if (str.indexOf('xlsx') !== -1 || str.indexOf('.xls') !== -1 || str.indexOf('xlsm') !== -1) {
        this.formData.append('file', file)
        this.discount = 0
        return false
      } else {
        this.$notify({
          title: '错误',
          message: '上传文件格式错误',
          type: 'error',
          duration: 2000
        })
        this.discount = 1
        return
      }
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
  .dingwei {
    position:absolute;
    top:10px;
    left:-10px;
    color:red
  }
  .dingwei1 {
    position:absolute;
    top:0;
    left:-10px;
    color:red
  }
    .span-model {
    position: absolute;
    bottom: 0;
    left:-10px;
    text-decoration: underline;
    color:#409EFF;
  }
    .ml-90 {
    margin-left:90px;
  }
  .p-r {
    position: relative;
  }
</style>
