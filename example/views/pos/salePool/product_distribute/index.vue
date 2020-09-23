<template>
  <div class="store-shelves-result">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:search-btn>
        <el-button type="primary" @click="$router.push('/pos/salepool/addselect')">新增分货</el-button>
        <el-button type="primary" @click="shelvesDialog = true">批量分货</el-button>
      </template>
      <template v-slot:table-btn="scope">
        <el-button :key="scope.row.billNo" type="text" @click="$router.push(`/pos/salepool/selectDetail/${scope.row.billNo}`)">查看</el-button>
        <el-button v-show="scope.row.operation[1]" type="text" @click="$router.push(`/pos/salepool/editselect/${scope.row.billNo}`)">编辑</el-button>
      </template>
    </HtmlPage>
    <el-dialog
      :visible.sync="shelvesDialog"
      title="提示"
      width="40%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="调入商品池">
          <SelectC ref="restFItem" :item="shelvesConfig[0]" @updateValue="updateValue($event, shelvesConfig[0].prop, 1)"/>
        </el-form-item>
        <el-form-item label="调出商品池">
          <SelectC ref="restFItem" :item="shelvesConfig[1]" @updateValue="updateValue($event, shelvesConfig[1].prop, 0)"/>
        </el-form-item>
        <el-form-item label="批量导入模板">
          <el-button type="text" @click="exportModel">批量分货.xlsx</el-button>
        </el-form-item>
        <el-form-item label="上传文件">
          <Upload ref="restFItem" :item="shelvesConfig[2]" @updateValue="updateValue($event, shelvesConfig[2].prop), 2"/>
        </el-form-item>
        <span v-show="showTips" style="color:red; margin-left:34px">*您选择的商品池无对应可分货调入/调出仓, 请重新选择*</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shelvesDialog = false">取 消</el-button>
        <el-button type="primary" @click="Confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%">
      <span>确认执行批量分货操作?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchShelves">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { SelectC, Upload } from '@component/Form/ExportItem.js'
import { config, shelvesConfig } from '@base/module_pos/sale_pool_manage/product_distribute'
import { getTypeCode, selectMore, ExportExcelModel, getWareHouseList } from '@/axios/module_pos/sale_pool_manage/product_distribute'
export default {
  name: 'SalePoolProductDistribute',
  components: {
    HtmlPage,
    SelectC,
    Upload
  },
  data() {
    return {
      config: config, // 页面配置
      shelvesDialog: false,
      dialogVisible: false,
      shelvesConfig: shelvesConfig,
      allList: [],
      form: {},
      showTips: false
    }
  },
  async created() {
    // 请求业务类型和店铺状态字典数据接口l
    const params = { dictCodes: ['WORK_FLOW_STATUS'] }
    const res = await getTypeCode(params)
    const res2 = await getWareHouseList({})
    this.$set(this.config.searchBar[5], 'options', res.data.data.WORK_FLOW_STATUS.dictItems)
    this.$set(this.config.searchBar[1], 'options', res2.data.data)
    this.$set(this.config.searchBar[2], 'options', res2.data.data)
    this.$set(this.shelvesConfig[0], 'options', res2.data.data)
    this.$set(this.shelvesConfig[1], 'options', res2.data.data)
    this.allList = res2.data.data
    // 为店铺赋值
  },
  methods: {
    updateValue(event, name, index) {
      this.form[name] = event
      if (index === 2) {
        return
      }
      const str = name === 'sourceCode' ? 'destCode' : 'sourceCode'
      // 在这里判断, 如果当前值为空, 那么当前的list应该为allList,
      if (!event && !this.form[str]) {
        this.$set(this.shelvesConfig[0], 'options', this.allList)
        this.$set(this.shelvesConfig[1], 'options', this.allList)
        this.showTips = false
        return
      }
      if (event === this.form[str]) {
        this.$message.error('调入仓与调出仓不能相同')
        this.form[name] = ''
        return
      }
      if (event && !this.form[str]) {
        const FileList = []
        // 先选出当前项的downwardRelatedPoolCodes
        const target = this.allList.filter(e => e.poolCode === event)[0]
        const qudaoList = target.downwardRelatedPoolCodes
        if (target.downwardRelatedPoolCodes.length) {
          this.allList.forEach(e => {
            for (let index = 0; index < qudaoList.length; index++) {
              const element = qudaoList[index]
              const arr = e.downwardRelatedPoolCodes.filter(item => item === element)
              if (arr.length) {
                if (target.poolCode !== e.poolCode) {
                  FileList.push(e)
                  continue
                }
              }
            }
          })
        }
        this.$set(this.shelvesConfig[index], 'options', FileList)
        if (!FileList.length) {
          this.showTips = true
        }
      }
      // 如果这个不为空, 那么 另一个的集合要换成对应的filterlist, 如果filterList为空, 则提示
    },
    exportModel() {
      ExportExcelModel()
    },
    Confirm() {
      if (!this.form['destCode'] || !this.form['sourceCode']) {
        this.$message.error('请选择调入调出商品池')
        return
      }
      if (!this.form['file'].length) {
        this.$message.error('请选择文件')
        return
      }
      this.dialogVisible = true
    },
    async batchShelves() {
      const Fdata = new FormData()
      Fdata.append('file', this.form.file[0])
      Fdata.append('destCode', this.form.destCode)
      Fdata.append('sourceCode', this.form.sourceCode)
      const res = await selectMore(Fdata)
      if (res.data.code !== '0') {
        this.$message.error(res.data.msg)
      } else {
        this.$message('批量分货导入成功!')
        this.shelvesDialog = false
        this.dialogVisible = false
        this.$refs.targetPage.getList()
      }
    }
  }
}
</script>
