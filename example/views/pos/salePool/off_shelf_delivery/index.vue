<template>
  <div class="store-shelves">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:search-btn="form">
        <el-button type="primary" @click="exportExcel(form.params)">导出</el-button>
        <el-button type="primary" @click="shelvesDialog = true">批量下架库存</el-button>
      </template>
      <template v-slot:table-btn="scope">
        <span v-if="scope.row.processStatus && scope.row.processStatus === 'PROCESS_DOING'">{{ scope.row.processStatusShow }}</span>
        <el-popconfirm
          title="确认需要下架出库吗?"
          @onConfirm="shelves(scope.row)"
        >
          <el-button slot="reference" type="text">下架</el-button>
        </el-popconfirm>
      </template>
      <template v-slot:table-btn2="scope">
        <el-input v-model="scope.row['qty']" placeholder="请输入内容" @keyup.native="setNum(scope.row)"/>
      </template>
    </HtmlPage>
    <DialogBox
      :dialog-config="shelvesConfig"
      :show-dialog.sync="shelvesDialog"
      @DialogConfirm="Confirm">
      <template v-slot:export>
        <el-button type="text" @click="exportModel">批量下架库存.xlsx</el-button>
      </template>
    </DialogBox>
    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%">
      <span>您是否执行商品下架操作?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchShelves">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config, shelvesConfig } from '@base/module_pos/sale_pool_manage/off_shelf_delivery'
import requestMixin from '@/axios/module_pos/sale_pool_manage/mixin'
import { getSalePull, ExportExcel, ExportExcelModel, batchPull } from '@/axios/module_pos/sale_pool_manage/off_shelf_delivery'
import DialogBox from '@common/DialogBox'

export default {
  name: 'SalePoolOffShelfDelivery',
  components: {
    HtmlPage,
    DialogBox
  },
  mixins: [requestMixin],
  data() {
    return {
      config: config,
      shelvesDialog: false,
      dialogVisible: false,
      shelvesConfig: shelvesConfig,
      curParams: {}
    }
  },
  methods: {
    exportModel() {
      ExportExcelModel()
    },
    setNum(row) {
      if (!RegExp(/^[0-9]*$/).test(row.qty)) {
        this.$notify({
          title: '错误',
          message: '下架库存必须为正数值',
          type: 'error',
          duration: 2000
        })
        row.qty = ''
        return
      }
    },
    exportExcel(form) {
      const params = JSON.parse(JSON.stringify(form))
      for (const k in params) {
        if (k === 'productNos' || k === 'productCodes') {
          const arr = []
          params[k].split(',').map(e => {
            e = e.replace(/[\r\n]/g, '').trim()
            if (e) {
              arr.push(e)
            }
          })
          params[k] = arr
        }
        if (!params[k] || params[k].length === 0 || JSON.stringify(params[k]) === '{}') {
          delete params[k]
        }
      }
      if (!params['poolCode'] || !params['brand']) {
        return this.$message.error('请选择必填导出参数')
      }
      ExportExcel(params)
    },
    async shelves(row) {
      const params = {
        poolCode: this.data.currentRow.poolCode,
        productInfoList: [{
          poolCode: this.data.currentRow.poolCode,
          productNo: this.data.currentRow.productNo,
          qty: this.data.currentRow.qty
        }]
      }
      const res = await getSalePull(params)
      if (res.data.code !== '0') {
        this.$message.error(res.data.msg)
      } else {
        this.data.dialogVisible = false
        this.$message('下架出库申请成功!')
        this.getList()
      }
    },
    Confirm(even) {
      console.log(even)
      this.dialogVisible = true
      const Fdata = new FormData()
      Fdata.append('file', even.file[0])
      this.curParams = Fdata
    },
    async batchShelves() {
      const res = await batchPull(this.curParams)
      if (res.data.code !== '0') {
        this.$message.error(res.data.msg)
      } else {
        this.$message('批量下架申请成功!')
        this.shelvesDialog = false
        this.dialogVisible = false
        this.$refs.targetPage.getList()
      }
    }
  }
}
</script>
