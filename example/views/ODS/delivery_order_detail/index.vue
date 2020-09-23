<template>
  <div>
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:searchBar>
        <DetailView :options="options" :data="billDetail">
          <template slot="operation" slot-scope="scope">
            <el-button
              v-if="$route.params.isMerge && $route.params.isMerge === '1'"
              size="mini"
              style="color:blue;text-decoration:underline"
              type="text"
              @click="openDialog1(scope.rowData)">关联的合发单号</el-button>
          </template>
        </DetailView>
        <el-row class="rowStyle">
          <el-form ref="form" :model="form">
            <el-col :span="2">
              <el-form-item>
                <el-select v-model="form.type" placeholder="请选择" @change="resetText">
                  <el-option
                    label="SKU条码"
                    value="barCode"/>
                  <el-option
                    label="货号"
                    value="materialCode"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" >
              <el-form-item>
                <el-input
                  ref="int"
                  v-model="form.textarea"
                  :rows="3"
                  type="text"
                  class="widthLength"
                  placeholder="请输入内容"/>
              </el-form-item>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-form-item>
                <el-checkbox v-model="form.onlyDiffBill">只看收货差异</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
                <el-button type="primary" @click="exprotExcel">导出</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </template>
    </HtmlPage>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%">
      <el-card class="box-card">
        <span v-if="JITCombinedList.length === 0">暂无数据</span>
        <div v-else>
          <h3>合发单号</h3>
          <div v-for="(item, index) in JITCombinedList" :key="index" class="text item">
            <el-button
              size="mini"
              style="color:blue;text-decoration:underline"
              type="text"
              @click="$router.push(`/ODS/JITCombinedOrderDetail/${item}`)">{{ item }}</el-button>

          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import DetailView from '@common/DetailView'
import { config, options } from '@base/module_ods/delivery_order_detail'
import { ExportExcel, setId, getDelivery, getJITNo } from '@/axios/module_ods/delivery_order_detail'
export default {
  name: 'ODSDeliveryOrderDetail',
  components: {
    HtmlPage,
    DetailView
  },
  data() {
    return {
      config: config,
      billDetail: {},
      curData: [1, 2, 3],
      options: options,
      form: { // 搜索参数
        type: 'barCode',
        onlyDiffBill: '',
        textarea: ''
      },
      JITCombinedList: [],
      dialogVisible: false
    }
  },
  async created() {
    setId(this.$route.params.id)
    // 获取基本信息
    const id = this.$route.params.id
    const res = await getDelivery(id)
    this.billDetail = res.data.data
  },
  methods: {
    async openDialog1(row) {
      this.curData = row
      this.dialogVisible = true
      const res = await getJITNo(this.$route.params.id)
      this.JITCombinedList = res.data.data
    },
    exprotExcel() {
      const params = {
        billNoList: [this.$route.params.id]
      }
      ExportExcel(params)
    },
    // 重置
    resetText() {
      this.form.textarea = ''
    },
    // 重置
    reset() {
      for (var k in this.form) {
        this.form[k] = ''
      }
      this.form.type = 'barCode'
    },
    search() {
      const params = {}
      params[this.form.type] = this.form.textarea.trim() || this.form.textarea
      params['onlyDiffBill'] = this.form.onlyDiffBill
      this.$refs.targetPage.getList(params)
    }
  }
}
</script>
