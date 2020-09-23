<template>
  <div class="store-shelves">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:search-btn="form">
        <el-button type="primary" @click="exportExcel(form.params)">导出</el-button>
        <el-button type="primary" @click="shelvesDialog = true">批量上下架</el-button>
        <el-button type="primary" @click="$router.push(`/pos/storepool/batchproduct`)">批量上下架结果查询</el-button>
      </template>
      <template v-slot:table-btn="scope">
        <span v-if="scope.row.processStatus && scope.row.processStatus === 'PROCESS_DOING'">{{ scope.row.processStatusShow }}</span>
        <el-popconfirm
          :title="`确定要${scope.row.onffLineStatus === 'ONFFLINE_YES'? `上架` : `下架`}吗？`"
          @onConfirm="shelves(scope.row)"
        >
          <el-button slot="reference" type="text">{{ scope.row.onffLineStatus === 'ONFFLINE_YES'? `下架` : `上架` }}</el-button>
        </el-popconfirm>
      </template>
    </HtmlPage>
    <DialogBox
      :dialog-config="shelvesConfig"
      :show-dialog.sync="shelvesDialog"
      @DialogConfirm="Confirm">
      <template v-slot:export>
        <el-button type="text" @click="exportModel">批量商品上下架.xlsx</el-button>
      </template>
    </DialogBox>
    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%">
      <span>当前选择为{{ text }}模式, 是否继续提交?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchShelves">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config, shelvesConfig } from '@base/module_pos/store_pool_manage/upper_lower_shelves'
import requestMixin from '@/axios/module_pos/store_pool_manage/mixin'
import { getSalePush, ExportExcel, ExportExcelModel, batchPush } from '@/axios/module_pos/store_pool_manage/upper_lower_shelves'
import DialogBox from '@common/DialogBox'

export default {
  name: 'StorePoolShelves',
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
      text: '',
      curParams: {}
    }
  },
  methods: {
    exportModel() {
      ExportExcelModel()
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
      ExportExcel(params)
    },
    async shelves(row) {
      const params = {
        products: [{
          poolCode: row.poolCode,
          productNo: row.productNo
        }],
        onffLineType: row.onffLineStatus === 'ONFFLINE_YES' ? 'ONFFLINE_NOT' : 'ONFFLINE_YES'
      }
      const res = await getSalePush(params)
      if (res.data.code !== '0') {
        this.$message.error(res.data.msg)
      } else {
        this.$message('上下架申请成功!')
        this.$refs.targetPage.getList()
      }
    },
    Confirm(even) {
      console.log(even)
      this.text = even['onffLineType'] === 'ONFFLINE_NOT' ? '下架' : '上架'
      this.dialogVisible = true
      const Fdata = new FormData()
      Fdata.append('file', even.file[0])
      Fdata.append('onffLineType', even.onffLineType)
      this.curParams = Fdata
    },
    async batchShelves() {
      console.log(this.curParams.get('file'))
      const res = await batchPush(this.curParams)
      if (res.data.code !== '0') {
        this.$message.error(res.data.msg)
      } else {
        this.$message('批量导入成功!')
        this.shelvesDialog = false
        this.dialogVisible = false
        this.$refs.targetPage.getList()
      }
    }
  }
}
</script>
