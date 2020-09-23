<template>
  <div>
    <el-row style="font-size:14px;margin:30px 0 20px 40px">
      <el-col :span="3">
        <span>总数量:  {{ data.count }}</span>
      </el-col>
    </el-row>
    <el-form ref="form" :model="data.form1" label-width="120px">
      <el-col :span="6">
        <el-form-item label="商品条码">
          <el-input v-model="data.form1.productNo" style="width:60%"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="商品货号">
          <el-input v-model="data.form1.productCode" style="width:60%"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="addMain">添加</el-button>
        <el-button type="primary" @click="searchProduct">查询已有商品</el-button>
        <el-button type="primary" @click="showALL">显示全部</el-button>
      </el-col>
    </el-form>
    <table-common :table-cofig="data.tableConfig" @selectionChange="selectionChange">
      <template v-slot:btn="scope">
        <el-input v-model="scope.row['qty']" style="width:60%" @keyup.native="setNum(scope.row)"/>
      </template>
    </table-common>
    <el-row style="margin-top:10px">
      <el-col :span="16" :offset="3">
        <el-button type="primary" @click="delteLog()">
          批量清除所选记录</el-button>
        <el-button type="primary" @click="saveLog()">保存草稿</el-button>
        <el-button type="primary" @click="submit()">
          提交分货单</el-button>
        <el-button type="primary" @click="cancel()">取消</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="text-align: right">
        <el-pagination
          :current-page="data.currentPage4"
          :page-sizes="[25, 50, 100]"
          :page-size="10"
          :total="data.count"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="data.dialogVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="生成单号成功"
      width="30%">
      <span>当前生成单号为{{ data.billNo }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$router.push('/pos/salepool/select')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="data.dialogVisible1"
      width="40%">
      <span style="color:red">*有部分条码未填写申请数量, 是否继续提交?*</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAgain">继续提交</el-button>
        <el-button @click="data.dialogVisible1 = false">再看看</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="data.dialogVisible2"
      width="40%">
      <span style="color:red">*本次保存只会保存已填写申请数量的商品条目, 是否继续保存?*</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAgain">继续保存</el-button>
        <el-button @click="data.dialogVisible2 = false">再看看</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TableCommon from '@common/Table'
import { tableConfig } from '@base/module_pos/sale_pool_manage/product_distribute_add'
import { saveText, submitSelect, addProduct } from '@/axios/module_pos/sale_pool_manage/product_distribute_add'
export default {
  name: 'SalegoodAddSelectTable',
  components: {
    TableCommon
  },
  props: {
    getParams: {
      type: Function,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      data: {
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2: false,
        currentPage4: 1,
        total: 10,
        showDialog: false, // 控制弹窗变量
        form1: { // 按条码批量搜索变量
          productNo: '',
          productCode: ''
        },
        tableConfig: tableConfig,
        count: 0,
        selectionIds: [],
        billNo: '',
        curList: [], // 保存查询已有的数组
        search: false
      }
    }
  },
  beforeDestroy() {
    this.data = null
  },
  methods: {
    showALL() {
      if (this.data.search) {
        this.data.tableConfig.tableData = this.data.curList
      }
    },
    setNum(row) {
      if (row.qty === '') return
      if (!RegExp(/^[0-9]*$/).test(row.qty)) {
        this.$message.error('申请数量必须为正数值')
        row.qty = ''
        return
      }
      if ((row.qty - row.availableQty) > 0 || row.qty === '' || row.qty < 0) {
        row.qty = ''
        this.$message.error('申请数量必须小于等于可用库存数量')
        return
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    async addMain() {
      const wareHouse = this.getParams()
      console.log(wareHouse)
      if (!wareHouse.sourceCode && !wareHouse.destCode) {
        this.$message.error('调入调出仓必须选择')
        return
      }
      if (!this.data.form1.productNo && !this.data.form1.productCode) {
        this.$message.error('请输入条码或者货号')
        return
      }
      if (this.data.search) {
        this.data.tableConfig.tableData = this.data.curList
      }
      const res = this.getParams()
      const params = {
        poolCode: res.sourceCode,
        productNo: this.data.form1.productNo,
        productCode: this.data.form1.productCode
      }
      try {
        const res = await addProduct(params)
        const arr = res.data.data
        const carr = []
        if (arr.length) {
          if (this.data.tableConfig.tableData.length === 0) {
            this.data.tableConfig.tableData = arr
          } else {
            arr.forEach(e => {
              let flag = true
              this.data.tableConfig.tableData.forEach(item => {
                if (item.productNo === e.productNo) {
                  flag = false
                }
              })
              if (flag) {
                console.log('都没有')
                carr.push(e)
              } else {
                console.log('已经有了')
              }
            })
            if (carr.length === 0) {
              this.$message.error('添加的条码或货号已存在')
              return
            }
            carr.forEach(e => {
              this.data.tableConfig.tableData.unshift(e)
            })
          }
          this.data.count = this.data.tableConfig.tableData.length
        } else {
          this.$message.error('该调出仓中无此条码或货号')
        }
      } catch (e) {
        this.$message.error('添加的条码或货号不存在')
      }
    },
    searchProduct() {
      if (!this.data.form1.productNo && !this.data.form1.productCode) {
        this.$message.error('请输入条码或者货号')
        return
      }
      let arr
      if (this.data.form1.productCode && !this.data.form1.productNo) {
        arr = this.data.tableConfig.tableData.filter(e => e.productCode === this.data.form1.productCode)
      } else {
        arr = this.data.tableConfig.tableData.filter(e => e.productNo === this.data.form1.productNo)
      }
      if (!arr.length) {
        this.$message.error('该条码或货号不存在')
        return
      } else {
        this.data.search = true
        this.data.curList = this.data.tableConfig.tableData
        this.data.tableConfig.tableData = arr
      }
    },
    selectionChange(val) {
      this.data.selectionIds = val
    },
    async submitAgain() {
      const arr = this.data.tableConfig.tableData.filter(e => e.qty)
      const resP = this.getParams()
      const params = {
        productInfoList: arr,
        sourceCode: resP.sourceCode,
        destCode: resP.destCode
      }
      const res = await submitSelect(params)
      this.data.billNo = res.data.data.billNo
      this.data.dialogVisible = true
    },
    async submit() {
      if (this.data.search) {
        this.data.tableConfig.tableData = this.data.curList
      }
      let flag = true
      this.data.tableConfig.tableData.forEach(e => {
        if (!e.qty) {
          flag = false
        }
      })
      if (!flag) {
        this.data.dialogVisible1 = true
      } else {
        const resP = this.getParams()
        const params = {
          productInfoList: this.data.tableConfig.tableData,
          sourceCode: resP.sourceCode,
          destCode: resP.destCode
        }
        const res = await submitSelect(params)
        console.log(res)
        if (res.data.code !== '0') {
          this.$message.error(res.data.msg)
        } else {
          this.data.billNo = res.data.data.billNo
          this.data.dialogVisible = true
        }
      }
    },
    async saveAgain() {
      const arr = this.data.tableConfig.tableData.filter(e => e.qty)
      const resP = this.getParams()
      const params = {
        productInfoList: arr,
        sourceCode: resP.sourceCode,
        destCode: resP.destCode
      }
      const res = await saveText(params)
      if (res.data.code !== '0') {
        this.$message.error(res.data.msg)
      } else {
        this.data.billNo = res.data.data.billNo
        this.data.dialogVisible2 = false
        this.data.dialogVisible = true
      }
    },
    async saveLog() {
      if (this.data.search) {
        this.data.tableConfig.tableData = this.data.curList
      }
      const arr = this.data.tableConfig.tableData.filter(e => e.qty)
      if (!arr.length) {
        this.$notify({
          title: '提示',
          message: '请分配至少一条商品信息的申请数量',
          duration: 2000
        })
        return
      }
      this.data.dialogVisible2 = true
    },
    delteLog() {
      this.data.selectionIds.forEach(e => {
        this.data.tableConfig.tableData = this.data.tableConfig.tableData.filter(item => item.productNo !== e.productNo)
        this.data.curList = this.data.curList.filter(item => item.productNo !== e.productNo)
      })
    },
    cancel() {
      this.$router.push('/pos/salepool/select')
    }
  }
}
</script>
