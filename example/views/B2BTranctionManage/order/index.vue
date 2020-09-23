<template>
  <div class="b2b-tranction-manage">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:search-btn>
        <el-button type="primary" @click="importExcel('DISCOUNT_TEMPLATE')">导入订单(折扣)</el-button>
        <el-button class="p-r" type="text" @click="exportCut">
          <span class="span-model">导出模板(折扣)</span>
        </el-button>
        <el-button class="ml-90" type="primary" @click="importExcel('SALES_AMOUNT_TEMPLATE')">导入订单(结算金额)</el-button>
        <el-button class="p-r" type="text" @click="exportPrice">
          <span class="span-model">导出模板(结算金额)</span>
        </el-button>
      </template>
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="$router.push(`/TradingPlatform/List/ListDetail/${scope.row.orderNo}`)">查看</el-button>
      </template>
    </HtmlPage>
    <el-table
      v-show="false"
      id="table"
      style="width: 100%">
      <el-table-column
        v-for="(item,index) in modelList"
        :key="index"
        :label="item"
        width="180"/>
    </el-table>
    <DialogBox
      :dialog-config="importConfig"
      :show-dialog.sync="importDialog"
      @DialogConfirm="submit">
      <template v-slot:billType="form">
        <el-radio-group v-model="form.form['billType']">
          <el-radio label="FUTURE">期货</el-radio>
          <el-radio label="SPECIAL">特价</el-radio>
          <el-radio label="SPOT">现货</el-radio>
          <el-radio label="OTHER" style="width:38%">
            其他
            <el-select v-model="form.form['otherbillType']" placeholder="请选择" style="width:74%">
              <el-option
                v-for="item in resurceoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                style="margin-right:10px"/>
            </el-select>
          </el-radio>
        </el-radio-group>
      </template>
    </DialogBox>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config, importConfig, resurceoptions, orderStatus } from '@base/module_b2b/order'
import { getCustormer, getwarehouse, getRole, createOrder } from '@/axios/module_b2b/order'
import DialogBox from '@common/DialogBox'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'B2BTranctionManageOrder',
  components: {
    HtmlPage,
    DialogBox
  },
  data() {
    return {
      config: config, // 页面配置
      importConfig: importConfig,
      resurceoptions: resurceoptions,
      importDialog: false,
      modelList: [],
      modelText: '',
      type: '',
      orderStatus: orderStatus,
      warehouseList: []
    }
  },
  async created() {
    const res = await getCustormer('')
    // 改变客商信息数据格式以适应下拉框
    this.$set(this.importConfig.options[0], 'options', res.data.data)
    // 获取全部仓库信息
    const res3 = await getwarehouse('')
    this.$set(this.importConfig.options[2], 'options', res3.data.data.warehouseList)
    this.warehouseList = res3.data.data.warehouseList
  },
  methods: {
    importExcel(str) {
      this.type = str
      this.importDialog = true
    },
    async submit(event) {
      if (event['billType'] === 'OTHER' && !event['otherbillType']) {
        this.$message.error('请选择任一其他类型')
        return
      }
      if (event['file'].length === 0) {
        this.$message.error('请上传文件')
        return
      }
      const ste = this.warehouseList.filter(e => e.warehouseCode === event.bwWarehouseCode)[0].warehouseName
      const formData = new FormData()
      formData.append('billType', event['billType'])
      if (event['otherbillType'] && event['billType'] === 'OTHER') {
        formData.set('billType', event['otherbillType'])
      }
      formData.append('customerCode', event.customerCode)
      formData.append('manualNo', event['manualBillNo'] || '')
      formData.append('templateModel', this.type || '')
      formData.append('file', event.file[0])
      formData.append('userCode', this.$store.getters.code)
      formData.append('bwWarehouseCode', event.bwWarehouseCode)
      formData.append('bwWarehouseName', ste)
      // 请求权限接口
      await getRole()
      // 请求创建订单的接口
      const res = await createOrder(formData)
      if (res.data.code !== '0') return this.$message(res.data.msg)
      this.$message('创建订单成功')
      this.importDialog = false
      this.$refs.targetPage.getList()
    },
    exportCut() {
      this.modelList = ['*货号', '*尺码', '*数量', '*折扣']
      this.modelText = '订单模板(折扣).xlsx'
      this.outExport()
    },
    exportPrice() {
      this.modelList = ['*货号', '*尺码', '*数量', '*含税结算金额']
      this.modelText = '订单模板(结算金额).xlsx'
      this.outExport()
    },
    outExport() {
      this.$nextTick(() => {
        const wb = XLSX.utils.table_to_book(document.querySelector('#table'))
        /* #table 就是表格的id */
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.modelText)
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      })
    }
  }
}
</script>
<style scoped>
  .ml-90 {
    margin-left:90px;
  }
  .p-r {
    position: relative;
  }
  .span-model {
    position: absolute;
    bottom: 0;
    left:-10px;
    text-decoration: underline;
    color:#409EFF;
  }
</style>
