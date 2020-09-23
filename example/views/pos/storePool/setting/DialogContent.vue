<template>
  <el-dialog
    :visible.sync="data.dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :lose-on-press-escape="false"
    width="60%">
    <el-form ref="form" :model="data.form" label-width="120px">
      <div style="padding: 15px;border: 1px solid #999">
        <h3>基本信息</h3>
        <el-row>
          <el-col :span="8">
            <el-form-item label="店铺名称">
              <el-input :disabled="reshow" v-model="data.form.poolName"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="店铺编码">
              <el-input :disabled="reshow" v-model="data.form.poolCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否自动同步库存">
              <el-switch
                v-model="data.form.pushType"
                active-color="#13ce66"
                inactive-color="#ff4949"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商ID">
              <el-input :disabled="reshow" v-model="data.form.vendor" @input="data.form.vendor=data.form.vendor.replace(/[^\d]/g,'')"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务模式">
              <el-select :disabled="reshow" v-model="data.form.bizMode" placeholder="请选择业务类型">
                <el-option
                  v-for="item in data.form.bizModeList"
                  :key="item.itemCode"
                  :label="item.itemCode"
                  :value="item.itemCode"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="常态合作编码">
              <el-button style="margin-left:30px" type="primary" @click="getChangtai">查询常态编码</el-button>
              <el-row class="relative" style="margin-top:10px">
                <el-col :span="6">
                  <el-table
                    :data="data.form.changtaiData"
                    :row-style="{height: '41px'}"
                    stripe
                    border
                    @selection-change="handleSelectionChange">
                    <el-table-column
                      type="selection"
                      width="55"/>
                    <el-table-column
                      prop="resourceName"
                      label="常态编码"/>
                  </el-table>
                </el-col>
                <div class="absolute2">
                  <span style="line-height: 40px; font-size: 24px" class="el-icon-right" @click="youyi('changtai')"/>
                </div>
                <el-col :span="14" :offset="4">
                  <el-table
                    :data="data.form.changtaiToData"
                    stripe
                    border>
                    <el-table-column
                      prop="resourceName"
                      label="常态编码"/>
                    <el-table-column
                      prop="ResourceCode"
                      label="是否订单寻源">
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row['checked']"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="ResourceCode"
                      label="比例">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.resourceCode" placeholder="请输入内容"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="120">
                      <template slot-scope="scope">
                        <el-button @click="delRow(scope.row, 'changtai')">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row> -->
      </div>
      <div style="margin-top:20px;padding: 15px;border: 1px solid #999">
        <h3>安全库存设置</h3>
        <el-row>
          <el-col :span="8">
            <el-form-item label="店铺安全库存">
              <el-input v-model="data.form.dianpuNum"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="品牌安全库存">
              <el-row>
                <el-col :span="6"><el-input v-model="data.form.pinpaiNum"/></el-col>
                <el-col :span="5" :offset="1"><el-button type="primary" @click="getBrand">查询品牌</el-button></el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row class="relative" style="margin-top:10px">
              <el-col :span="10">
                <el-table
                  :data="data.form.brandData"
                  :row-style="{height: '41px'}"
                  height="200px"
                  stripe
                  border
                  @selection-change="(val) => {handleSelectionChange(val, 'pinpai')}">
                  <el-table-column
                    type="selection"
                    width="55"/>
                  <el-table-column
                    prop="brandCode"
                    label="品牌ID"/>
                  <el-table-column
                    prop="brandName"
                    label="品牌名"/>
                </el-table>
              </el-col>
              <div class="absolute1">
                <el-button type="primary" size="default" icon="el-icon-right" circle @click="youyi(data.multipleSelection, data.form.brandToData)"/>
                <!-- <span  class="" /> -->
              </div>
              <el-col :span="10" :offset="4">
                <el-table
                  :data="data.form.brandToData"
                  height="200px"
                  stripe
                  border>
                  <el-table-column
                    prop="brandCode"
                    label="品牌ID"/>
                  <el-table-column
                    prop="brandName"
                    label="品牌名"/>
                  <el-table-column
                    prop="safeQty"
                    label="安全库存">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.safeQty" placeholder="请输入内容" @keyup.native="testNum(scope.row)"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                      <el-button @click="delRow(scope.row, 'pinpai')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin: 15px 0">
          <el-col :span="24">
            <el-form-item label="货号安全库存">
              <el-row>
                <el-col :span="3" style="text-align:center" >货号</el-col>
                <el-col :span="6"><el-input v-model="data.form.productCode"/></el-col>
                <el-col :span="5" :offset="1"><el-button type="primary" @click="getProductCode">查询货号</el-button></el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row class="relative" style="margin-top:10px">
              <el-col :span="10">
                <el-table
                  :data="data.form.CodeData"
                  :row-style="{height: '41px'}"
                  height="200px"
                  stripe
                  border
                  @selection-change="(val) => {handleSelectionChange(val, 'code')}">
                  <el-table-column
                    type="selection"
                    width="55"/>
                  <el-table-column
                    prop="productNo"
                    label="货号"/>
                </el-table>
              </el-col>
              <div class="absolute1">
                <el-button type="primary" size="default" icon="el-icon-right" circle @click="youyi(data.multipleSelectionCode, data.form.CodeToData)"/>
              </div>
              <el-col :span="10" :offset="4">
                <el-table
                  :data="data.form.CodeToData"
                  height="200px"
                  stripe
                  border>
                  <el-table-column
                    prop="productNo"
                    label="货号"/>
                  <el-table-column
                    prop="safeQty"
                    label="安全库存">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.safeQty" placeholder="请输入内容" @keyup.native="testNum(scope.row)"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                      <el-button @click="delRow(scope.row, 'code')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="条码安全库存">
              <el-row>
                <el-col :span="3" style="text-align:center">条码</el-col>
                <el-col :span="6"><el-input v-model="data.form.productNo"/></el-col>
                <el-col :span="5" :offset="1"><el-button type="primary" @click="getProduct">查询条码</el-button></el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row class="relative" style="margin-top:10px">
              <el-col :span="10">
                <el-table
                  :data="data.form.NoData"
                  :row-style="{height: '41px'}"
                  height="200px"
                  stripe
                  border
                  @selection-change="(val) => {handleSelectionChange(val, 'No')}">
                  <el-table-column
                    type="selection"
                    width="55"/>
                  <el-table-column
                    prop="productNo"
                    label="货号"/>
                  <el-table-column
                    prop="barcode"
                    label="条码"/>
                </el-table>
              </el-col>
              <div class="absolute1">
                <el-button type="primary" size="default" icon="el-icon-right" circle @click="youyi(data.multipleSelectionNo, data.form.NoToData)"/>
              </div>
              <el-col :span="10" :offset="4">
                <el-table
                  :data="data.form.NoToData"
                  height="200px"
                  stripe
                  border>
                  <el-table-column
                    prop="productNo"
                    label="货号"/>
                  <el-table-column
                    prop="barcode"
                    label="条码"/>
                  <el-table-column
                    prop="safeQty"
                    label="安全库存">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.safeQty" placeholder="请输入内容" @keyup.native="testNum(scope.row)"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                      <el-button @click="delRow(scope.row, 'No')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:20px;padding: 15px;border: 1px solid #999">
        <h3>绑定关系设置  <el-button style="margin-left:30px" type="primary" @click="getXiaoShou">查询销售商品池</el-button> </h3>
        <el-row>
          <el-col :span="24">
            <el-row class="relative" style="margin-top:10px">
              <el-col :span="10">
                <el-table
                  :data="data.form.xiaoshouData"
                  :row-style="{height: '41px'}"
                  height="200px"
                  stripe
                  border
                  @selection-change="(val) => {handleSelectionChange(val, 'xiaoshou')}">
                  <el-table-column
                    type="selection"
                    width="55"/>
                  <el-table-column
                    prop="targetName"
                    label="销售商品池"/>
                  <el-table-column
                    prop="bizMode"
                    label="业务类型"/>
                </el-table>
              </el-col>
              <div class="absolute1">
                <el-button type="primary" size="default" icon="el-icon-right" circle @click="youyi(data.multipleSelectionXiaoshou, data.form.xiaoshouToData)"/>
              </div>
              <el-col :span="10" :offset="4">
                <el-table
                  :data="data.form.xiaoshouToData"
                  height="200px"
                  stripe
                  border>
                  <el-table-column
                    prop="targetName"
                    label="销售商品池"/>
                  <el-table-column
                    prop="sourceretriveDisabled"
                    label="是否订单寻源">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row['sourceretriveDisabled']"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sourceretrivePriority"
                    label="寻源优先级">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.sourceretrivePriority" placeholder="请输入内容" @keyup.native="testNumSelect(scope.row)"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                      <el-button @click="delRow(scope.row, 'xiaoshou')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="DialogConfirm">提 交</el-button>
      <el-button type="primary" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getSaleList, getBrands, getProductCodes, getProductNos } from '@/axios/module_pos/store_pool_manage/setting'
export default {
  name: 'DialogContent',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    reshow: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
      }
    },
    bizModeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: {
        dialogVisible: this.showDialog, // 控制弹窗变量
        multipleSelection: [],
        multipleSelectionCode: [],
        multipleSelectionNo: [],
        multipleSelectionXiaoshou: [],
        show: false,
        currentBrandList: [],
        form: { // 表单变量
          dianpuNum: '',
          pinpaiNum: '',
          vendor: '',
          bizMode: '',
          poolCode: '',
          poolName: '',
          bizModeList: [],
          pushType: true,
          productCode: '',
          productNo: '',
          brandData: [],
          brandToData: [],
          CodeData: [],
          CodeToData: [],
          NoData: [],
          NoToData: [],
          CodeTableData: [],
          changtaiData: [],
          changtaiToData: [],
          xiaoshouToData: [],
          xiaoshouData: []
        }
      }
    }
  },
  watch: {
    showDialog(val) {
      this.data.dialogVisible = val
    },
    bizModeList: {
      handler(newVal) {
        this.data.form.bizModeList = newVal
      },
      deep: true
    },
    row: {
      handler(newVal) {
        if (!this.reshow) {
          return
        }
        const arr = JSON.parse(JSON.stringify(newVal))
        if (arr && arr.hasOwnProperty('poolBase')) {
          this.data.form.poolCode = arr.poolBase.poolCode
          this.data.form.poolName = arr.poolBase.poolName
          this.data.form.bizMode = arr.poolBase.bizMode
          this.data.form.pushType = arr.poolBase.pushType === 'AUTO'
        }
        this.data.form.vendor = arr && arr.vendor ? arr.vendor : ''
        this.data.form.brandToData = []
        this.data.form.NoToData = []
        this.data.form.CodeToData = []
        const arr1 = []
        if (arr && arr.poolDownwardConfigs && arr.poolDownwardConfigs.length) {
          arr.poolDownwardConfigs.forEach(e => {
            const item = JSON.parse(JSON.stringify(e))
            item.sourceretriveDisabled = item.sourceretriveDisabled === 0
            arr1.push(item)
          })
          this.data.form.xiaoshouToData = arr1
        }
        if (arr && arr.poolSafeConfigs && arr.poolSafeConfigs.length) {
          arr.poolSafeConfigs.forEach((e, index) => {
            if (e.brandCode) {
              e['dictCode'] = e.brandCode
              this.data.form.brandToData.push(e)
            } else if (e.barcode) {
              e['id'] = index
              this.data.form.NoToData.push(e)
            } else if (e.productNo && !e.barcode) {
              e['id'] = index
              this.data.form.CodeToData.push(e)
            } else if (!e.productNo && !e.barcode && !e.brandCode) {
              this.data.form.dianpuNum = e.safeQty
            }
            // shai选出三个类型的数组
          })
        }
      },
      deep: true
    }
  },
  methods: {
    testNum(row) {
      // 首先校验用户输入是否规范
      var re = /^[0-9]+$/
      if (row.safeQty === '') return
      if (!re.test(row.safeQty)) {
        this.$message({
          showClose: true,
          message: '安全库存应为正整数',
          type: 'error',
          duration: 3000
        })
        row.safeQty = ''
        return
      }
    },
    testNumSelect(row) {
      // 首先校验用户输入是否规范
      var re = /^[0-9]+$/
      if (row.sourceretrivePriority === '') return
      if (!re.test(row.sourceretrivePriority)) {
        this.$message({
          showClose: true,
          message: '优先级应为正整数',
          type: 'error',
          duration: 3000
        })
        row.sourceretrivePriority = ''
        return
      }
      const arr = this.data.form.xiaoshouToData.filter(item => item.sourceretrivePriority === row.sourceretrivePriority && item.targetValue !== row.targetValue)
      if (arr.length) {
        this.$message({
          showClose: true,
          message: '当前分配商品池中不能出现相同优先级',
          type: 'error',
          duration: 3000
        })
        row.sourceretrivePriority = ''
        return
      }
    },
    reset() {
      this.data = {
        dialogVisible: this.showDialog, // 控制弹窗变量
        multipleSelection: [],
        multipleSelectionCode: [],
        multipleSelectionNo: [],
        multipleSelectionXiaoshou: [],
        show: false,
        currentBrandList: [],
        form: { // 表单变量
          dianpuNum: '',
          pinpaiNum: '',
          vendor: '',
          bizMode: '',
          poolCode: '',
          poolName: '',
          bizModeList: this.bizModeList,
          pushType: true,
          productCode: '',
          productNo: '',
          brandData: [],
          brandToData: [],
          CodeData: [],
          CodeToData: [],
          NoData: [],
          NoToData: [],
          CodeTableData: [],
          changtaiData: [],
          changtaiToData: [],
          xiaoshouToData: [],
          xiaoshouData: []
        }
      }
    },
    async getXiaoShou() {
      if (!this.data.form.bizMode) {
        this.$message.error('请先选择业务类型!')
        return
      }
      const params = {
        bizMode: this.data.form.bizMode
      }
      const res = await getSaleList(params)
      res.data.data.map(e => {
        e['dictCode'] = e.poolCode
        e['targetValue'] = e.poolCode
        e['targetName'] = e.poolName
        e['targetType'] = 'SALES_POOL'
      })
      this.data.form.xiaoshouData = res.data.data
    },
    // 获取品牌
    async getBrand() {
      if (this.data.currentBrandList.length) {
        if (this.data.form.pinpaiNum) {
          this.data.form.brandData = this.data.currentBrandList.filter(e => {
            if (e.brandCode.toLowerCase().indexOf(this.data.form.pinpaiNum.toLowerCase()) > -1 || e.brandName.toLowerCase().indexOf(this.data.form.pinpaiNum.toLowerCase()) > -1) {
              return e
            }
          }

          )
        } else {
          this.data.form.brandData = this.data.currentBrandList
        }
      } else {
        const res = await getBrands()
        res.data.data.map(e => {
          e['brandCode'] = e.dictCode
          e['brandName'] = e.dictValue
        })
        this.data.currentBrandList = res.data.data
        if (this.data.form.pinpaiNum) {
          this.data.form.brandData = this.data.currentBrandList.filter(e => {
            if (e.brandCode.toLowerCase().indexOf(this.data.form.pinpaiNum.toLowerCase()) > -1 || e.brandName.toLowerCase().indexOf(this.data.form.pinpaiNum.toLowerCase()) > -1) {
              return e
            }
          }

          )
        } else {
          this.data.form.brandData = this.data.currentBrandList
        }
      }
    },
    async getProductCode() {
      if (!this.data.form.productCode) {
        this.$message('请输入要查询的货号!')
        return
      }
      const res = await getProductCodes(this.data.form.productCode)
      res.data.data.map(e => {
        e['productNo'] = e.product_code
        e['dictCode'] = e.product_code
      })
      this.data.form.CodeData = res.data.data
    },
    // 获取商品
    async getProduct() {
      if (!this.data.form.productNo) {
        this.$message('请输入要查询的条码!')
        return
      }
      const res = await getProductNos(this.data.form.productNo)
      res.data.data.map(e => {
        e['productNo'] = e.productCode
        e['barcode'] = e.barCode
        e['dictCode'] = e.barcode
      })
      this.data.form.NoData = res.data.data
    },
    // 获取常态编码
    getChangtai() {
      this.$axios({
        method: 'post',
        data: { id: this.row.id },
        url: ''
      }).then(res => {
        this.data.form.changtaiData = []
      }).catch(e => {
        this.$message('获取常态编码失败!')
      })
    },
    // 关闭弹窗
    handleClose(done) {
      this.reset()
      this.$emit('update:showDialog', false)
    },
    // 确认弹窗
    DialogConfirm() {
      this.$emit('DialogConfirm', this.data.form)
    },
    // 增加行
    addRow() {
      this.data.form.brandData.map((item, index) => {
        item.id = index + 1
      })
      const newRow = {
        id: this.data.form.brandData.length + 1,
        reamrk: '',
        resourceCode: '',
        url: '',
        parentId: '',
        resourceName: '',
        systemId: 10
      }
      this.data.form.brandData.push(newRow)
    },
    // 删除行
    delRow(row, str) {
      if (str === 'changtai') {
        this.data.form.changtaiToData = this.data.form.changtaiToData.filter(item => item.id !== row.id)
      } else if (str === 'pinpai') {
        this.data.form.brandToData = this.data.form.brandToData.filter(item => item.dictCode !== row.dictCode)
      } else if (str === 'code') {
        this.data.form.CodeToData = this.data.form.CodeToData.filter(item => item.id !== row.id)
      } else if (str === 'No') {
        this.data.form.NoToData = this.data.form.NoToData.filter(item => item.id !== row.id)
      } else {
        this.data.form.xiaoshouToData = this.data.form.xiaoshouToData.filter(item => item.targetValue !== row.targetValue)
      }
    },
    // 多选框
    handleSelectionChange(val, str) {
      if (str === 'pinpai') {
        this.data.multipleSelection = val
      } else if (str === 'code') {
        this.data.multipleSelectionCode = val
      } else if (str === 'No') {
        this.data.multipleSelectionNo = val
      } else {
        this.data.multipleSelectionXiaoshou = val
      }
    },
    youyi(arr, list) {
      if (arr.length === 0) {
        this.$message('请勾选需要添加的分项!')
        return
      }
      this.cantransfer(list, arr)
    },
    cantransfer(arr, list) {
      let flag = true
      arr.forEach(item => {
        list.forEach(e => {
          if (e.dictCode === item.dictCode) {
            flag = false
          }
        })
      })
      if (flag) {
        arr.push(...list)
      } else {
        this.$message('不能添加已有的分项!')
      }
    }
  }
}
</script>
<style scoped>
  .absolute{
    position: absolute;
    bottom: 10px;
    right: 10px
  }
   .absolute1{
    position: absolute;
    left: 48%;
    top:40%;
  }
  .absolute2{
    position: absolute;
   left: 30%;
   width:40px;
   height:40px;
   background-color: #409eff;
   border-radius: 50%;
   top:40%;
   text-align: center;
   vertical-align: middle;
   cursor: pointer;
  }
  .relative{
    position: relative;
  }
</style>
