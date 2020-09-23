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
        <el-button type="primary" @click="cancel()">取消草稿</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="text-align: right">
        <el-pagination
          :current-page="data.currentPage4"
          :page-sizes="[25, 50, 100]"
          :page-size="data.pageSize"
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
      title="保存草稿成功"
      width="30%">
      <span>当前创建草稿单号为{{ data.billNo }}</span>
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
import { getTableList, saveText, submitSelect, addProduct, deleteItem, cancelText, searchHas, testHas } from '@/axios/module_pos/sale_pool_manage/product_distribute_edit'
export default {
  name: 'SalegoodEditSelectTable',
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
        tableConfig: tableConfig,
        dialogVisible1: false,
        dialogVisible2: false,
        currentPage4: 1,
        pageSize: 25,
        pageNum: 1,
        showDialog: false, // 控制弹窗变量
        form1: { // 按条码批量搜索变量
          productNo: '',
          productCode: ''
        },
        count: 0,
        selectionIds: [],
        billNo: '',
        curList: [], // 保存查询已有的数组
        search: false,
        showList: [] // 分页器展示数组
      }
    }
  },
  beforeDestroy() {
    this.data = null
  },
  created() {
    this.getList()
  },
  methods: {
    showALL() {
      if (this.data.curList.length) {
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
    async getList(Num, Size) {
      const params = {
        billNo: this.$route.params.id,
        pageNum: Num || this.data.pageNum,
        pageSize: Size || this.data.pageSize
      }
      const res = await getTableList(params)
      res.data.data.list.map(e => {
        if (e.expectQty) {
          e['qty'] = e.expectQty
        }
      })
      this.data.tableConfig.tableData = res.data.data.list
      this.data.count = res.data.data.list.length
    },
    async handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.data.pageSize = val
      // 1. 先查出当前页的,
      if (this.data.search) {
        return
      }
      const params = {
        billNo: this.$route.params.id,
        pageNum: this.data.pageNum,
        pageSize: val
      }
      const res = await getTableList(params)
      const arr = res.data.data.list
      // 2. 然后添加进list里
      const carr = []
      if (arr.length) {
        arr.forEach(e => {
          let flag = true
          this.data.tableConfig.tableData.forEach(item => {
            if (item.productNo === e.productNo) {
              flag = false
            }
          })
          if (flag) {
            carr.push(e)
          }
        })
        carr.forEach(e => {
          this.data.tableConfig.tableData.push(e)
        })
      }
      // 3. 然后再查找当前返回的
      this.data.search = true
      // 在查找完成后. 重置list条数, 并重置当前页数为第一页
      this.data.count = arr.length
      this.data.pageNum = 1
      this.data.curList = this.data.tableConfig.tableData
      this.data.tableConfig.tableData = arr
    },
    async handleCurrentChange(val) {
      this.data.pageNum = val
      // 1. 先查出当前页的,
      if (this.data.search) {
        return
      }
      const params = {
        billNo: this.$route.params.id,
        pageNum: val,
        pageSize: this.data.pageSize
      }
      const res = await getTableList(params)
      const arr = res.data.data.list
      // 2. 然后添加进list里
      const carr = []
      if (arr.length) {
        arr.forEach(e => {
          let flag = true
          this.data.tableConfig.tableData.forEach(item => {
            if (item.productNo === e.productNo) {
              flag = false
            }
          })
          if (flag) {
            carr.push(e)
          }
        })
        carr.forEach(e => {
          this.data.tableConfig.tableData.push(e)
        })
      }
      // 3. 然后再查找当前返回的
      this.data.search = true
      // 在查找完成后. 重置list条数, 并重置当前页数为第一页
      this.data.count = arr.length
      this.data.pageNum = 1
      this.data.curList = this.data.tableConfig.tableData
      this.data.tableConfig.tableData = arr
    },
    async addMain() {
      if (!this.data.form1.productNo && !this.data.form1.productCode) {
        this.$message.error('请输入条码或者货号')
        return
      }
      if (this.data.search) {
        this.data.tableConfig.tableData = this.data.curList
        this.data.search = false
        this.data.pageNum = 1
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
        let targetArr = []
        const arr2 = []
        arr.forEach(e => {
          arr2.push(e.productNo)
        })
        if (arr2.length !== 0) {
          // 先校验有没有
          const HasParams = {
            billNo: this.$route.params.id,
            productNos: arr2
          }
          const resHas = await testHas(HasParams)
          const hasArr = resHas.data.data.productInfoList
          console.log(hasArr, '明细中已有的选项')
          if (arr2.length <= 1) {
            // dan个的
            console.log('dangetianjia')
            if (hasArr.length) {
              this.$message.error('添加的条码或货号已存在')
              return
            } else {
              // 添加
              targetArr = arr
            }
          } else {
            // 多个
            if (hasArr.length === 0) {
              targetArr = arr
            } else {
              console.log('jinruzheli')
              if (hasArr.length === arr.length) {
                this.$message.error('添加的条码或货号已存在')
                return
              } else if (hasArr.length < arr.length) {
                const arrD = []
                arr.forEach(e => {
                  let flag = true
                  hasArr.forEach(item => {
                    if (e.productNo === item.productNo) {
                      flag = false
                    }
                  })
                  if (flag) {
                    arrD.push(e)
                  }
                })
                targetArr = arrD
              }
            }
          }
          const carr = []
          if (this.data.tableConfig.tableData.length === 0) {
            this.data.tableConfig.tableData = targetArr
          } else {
            targetArr.forEach(e => {
              let flag = true
              this.data.tableConfig.tableData.forEach(item => {
                if (item.productNo === e.productNo) {
                  flag = false
                }
              })
              if (flag) {
                carr.push(e)
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
          return
        }
      } catch (e) {
        this.$message.error('添加的条码或货号不存在')
      }
    },
    async searchProduct() {
      if (!this.data.form1.productNo && !this.data.form1.productCode) {
        this.$message.error('请输入条码或者货号')
        return
      }
      // 先去查, 如果有, 那么放在push添加到list中,
      // const res = this.getParams()
      const params = {
        billNo: this.$route.params.id,
        productNo: this.data.form1.productNo ? this.data.form1.productNo : null,
        productCode: this.data.form1.productCode ? this.data.form1.productCode : null,
        pageNum: 1,
        pageSize: 100
      }
      try {
        const res = await searchHas(params)
        const arr = res.data.data.list // 查出来的数据
        arr.map(e => {
          e['qty'] = e.expectQty
        })
        const carr = []
        if (arr.length) {
          arr.forEach(e => {
            let flag = true
            this.data.tableConfig.tableData.forEach(item => {
              if (item.productNo === e.productNo) {
                flag = false
              }
            })
            if (flag) {
              carr.push(e)
            }
          })
          carr.forEach(e => {
            this.data.tableConfig.tableData.push(e)
          })
        } else {
          this.$message.error('该条码或货号不存在')
        }
        let arr1
        if (this.data.form1.productCode && !this.data.form1.productNo) {
          arr1 = this.data.tableConfig.tableData.filter(e => e.productCode === this.data.form1.productCode)
        } else {
          arr1 = this.data.tableConfig.tableData.filter(e => e.productNo === this.data.form1.productNo)
        }
        if (!arr1.length) {
          this.$message.error('该条码或货号不存在')
          return
        } else {
          this.data.search = true
          this.data.count = arr.length
          this.data.pageNum = 1
          this.data.curList = this.data.tableConfig.tableData
          this.data.tableConfig.tableData = arr1
        }
      } catch (e) {
        console.log(e)
        return
      }
    },
    selectionChange(val) {
      this.data.selectionIds = val
    },
    async submitAgain() {
      const arr = []
      this.data.tableConfig.tableData.forEach(e => {
        if (e.id) {
          if (e.qty) {
            const item = {
              id: e.id,
              qty: e.qty
            }
            arr.push(item)
          }
        } else {
          if (e.qty) {
            arr.push(e)
          }
        }
      })
      const params = {
        billNo: this.$route.params.id,
        productInfoList: arr
      }
      const res = await submitSelect(params)
      console.log(res)
      if (res.data.code !== '0') {
        this.$message.error(res.data.msg)
      } else {
        this.data.billNo = res.data.data.billNo
        this.data.dialogVisible1 = false
        this.$message('提交分货单成功')
        this.getList()
      }
    },
    async submit() {
      if (this.data.search) {
        this.data.tableConfig.tableData = this.data.curList
        this.data.search = false
        this.data.pageNum = 1
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
        const arr = []
        this.data.tableConfig.tableData.forEach(e => {
          if (e.id) {
            if (e.qty) {
              const item = {
                id: e.id,
                qty: e.qty
              }
              arr.push(item)
            }
          } else {
            arr.push(e)
          }
        })
        console.log(arr, 'zheli')
        const params = {
          billNo: this.$route.params.id,
          productInfoList: arr
        }
        const res = await submitSelect(params)
        if (res.data.code !== '0') {
          this.$message.error(res.data.msg)
        } else {
          this.data.billNo = res.data.data.billNo
          this.$message('提交分货单成功')
          this.getList()
        }
      }
    },
    async saveAgain() {
      const arr = this.data.tableConfig.tableData.filter(e => e.qty)
      const arr1 = []
      arr.forEach(e => {
        if (e.id) {
          if (e.qty) {
            const item = {
              id: e.id,
              qty: e.qty
            }
            arr1.push(item)
          }
        } else {
          arr1.push(e)
        }
      })
      const params = {
        billNo: this.$route.params.id,
        productInfoList: arr1
      }
      const res = await saveText(params)
      if (res.data.code !== '0') {
        this.$message.error(res.data.msg)
      } else {
        this.data.billNo = res.data.data.billNo
        this.data.dialogVisible2 = false
        this.$message('保存草稿成功')
      }
    },
    async saveLog() {
      if (this.data.search) {
        this.data.tableConfig.tableData = this.data.curList
        this.data.search = false
        this.data.pageNum = 1
      }
      const arr = this.data.tableConfig.tableData.filter(e => e.qty)
      if (!arr.length) {
        this.$message.error('请分配至少一条商品信息的申请数量')
        return
      }
      this.data.dialogVisible2 = true
    },
    async delteLog() {
      // 如果只是操作前端数据
      const cArr = []
      const hArr = []
      this.data.selectionIds.forEach(e => {
        if (e.id) {
          hArr.push(e.id)
        } else {
          cArr.push(e)
        }
      })
      const params = {
        ids: hArr,
        billNo: this.$route.params.id
      }
      // 如果都是前台数据
      if (hArr.length === 0) {
        cArr.forEach(e => {
          this.data.tableConfig.tableData = this.data.tableConfig.tableData.filter(item => item.productNo !== e.productNo)
          this.data.curList = this.data.curList.filter(item => item.productNo !== e.productNo)
        })
      } else {
        if (cArr.length === 0) {
          try {
            await deleteItem(params)
            hArr.forEach(e => {
              this.data.tableConfig.tableData = this.data.tableConfig.tableData.filter(item => item.id !== e)
              this.data.curList = this.data.curList.filter(item => item.id !== e)
            })
          } catch (e) {
            this.$message.error('同步后台数据失败，请重新尝试')
          }
        } else {
          try {
            await deleteItem(params)
            this.data.selectionIds.forEach(e => {
              if (e.id) {
                this.data.tableConfig.tableData = this.data.tableConfig.tableData.filter(item => item.id !== e.id)
                this.data.curList = this.data.curList.filter(item => item.id !== e.id)
              } else {
                this.data.tableConfig.tableData = this.data.tableConfig.tableData.filter(item => item.productNo !== e.productNo)
                this.data.curList = this.data.curList.filter(item => item.productNo !== e.productNo)
              }
            })
          } catch (e) {
            this.$message.error('同步后台数据失败，请重新尝试')
          }
        }
      }
    },
    async cancel() {
      const params = {
        billNo: this.$route.params.id
      }
      const res = await cancelText(params)
      console.log(res)
      this.$router.push('/pos/salepool/select')
    }
  }
}
</script>
