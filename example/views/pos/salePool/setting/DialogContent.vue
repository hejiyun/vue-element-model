<template>
  <el-dialog
    :visible.sync="data.dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :lose-on-press-escape="false"
    width="70%">
    <el-form ref="form" :model="data.form" label-width="120px">
      <div style="padding: 15px;border: 1px solid #999">
        <h3>基本信息</h3>
        <el-row>
          <el-col :span="8">
            <el-form-item label="销售商品池名称">
              <el-input :disabled="reshow" v-model="data.form.poolName"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售商品池编码">
              <el-input :disabled="reshow" v-model="data.form.poolCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否独享">
              <el-switch
                v-model="data.form.shareMode"
                active-color="#13ce66"
                inactive-color="#ff4949"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
      </div>
      <div style="margin-top:20px;padding: 15px;border: 1px solid #999">
        <h3>库存推送配置 <el-button type="primary" @click="getDianpu">查询店铺</el-button></h3>
        <el-row>
          <el-col :span="24">
            <el-row class="relative" style="margin-top:10px">
              <el-col :span="10">
                <el-table
                  :data="data.form.dianpuData"
                  :row-style="{height: '41px'}"
                  stripe
                  height="200px"
                  border
                  @selection-change="(val) => {handleSelectionChange(val,'kucun')}">
                  <el-table-column
                    type="selection"
                    width="55"/>
                  <el-table-column
                    prop="targetName"
                    label="店铺"/>
                  <el-table-column
                    prop="bizMode"
                    label="业务类型"/>
                </el-table>
              </el-col>
              <div class="absolute1">
                <el-button type="primary" size="default" icon="el-icon-right" circle @click="youyi(data.multipleSelection, data.form.dianpuToData)"/>
              </div>
              <el-col :span="10" :offset="4">
                <el-table
                  :data="data.form.dianpuToData"
                  height="200px"
                  stripe
                  border>
                  <el-table-column
                    prop="targetName"
                    label="店铺"/>
                  <el-table-column
                    prop="spreadDisabled"
                    label="是否推送库存">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row['spreadDisabled']"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="spreadValue"
                    label="推送库存比例"
                    width="100">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row['spreadValue']" style="width:80%" placeholder="请输入内容" @keyup.native="testNum(scope.row)"/>%
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                      <el-button @click="delRow(scope.row, 'dianpu')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:20px;padding: 15px;border: 1px solid #999">
        <h3>绑定关系设置  <el-button style="margin-left:30px" type="primary" @click="getQudao">查询渠道商品池</el-button> </h3>
        <el-row>
          <el-col :span="24">
            <el-row class="relative" style="margin-top:10px">
              <el-col :span="10">
                <el-table
                  :data="data.form.qudaoData"
                  :row-style="{height: '41px'}"
                  height="200px"
                  stripe
                  border
                  @selection-change="(val) => {handleSelectionChange(val,'qudao')}">
                  <el-table-column
                    type="selection"
                    width="55"/>
                  <el-table-column
                    prop="targetName"
                    label="渠道商品池"/>
                  <el-table-column
                    prop="bizMode"
                    label="业务类型"/>
                </el-table>
              </el-col>
              <div class="absolute1">
                <el-button type="primary" size="default" icon="el-icon-right" circle @click="youyi(data.multipleSelectionQudao, data.form.qudaoToData)"/>
              </div>
              <el-col :span="10" :offset="4">
                <el-table
                  :data="data.form.qudaoToData"
                  stripe
                  height="200px"
                  border>
                  <el-table-column
                    prop="targetName"
                    label="渠道商品池"/>
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
                      <el-input v-model="scope.row['sourceretrivePriority']" placeholder="请输入内容" @keyup.native="testNumSelect(scope.row)"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="offlineDisabled"
                    label="是否可下架库存">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row['offlineDisabled']"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                      <el-button @click="delRow(scope.row, 'qudao')">删除</el-button>
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
export default {
  name: 'SalegoodProductDialogContent',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    bizModeList: {
      type: Array,
      default: () => []
    },
    reshow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: {
        dialogVisible: this.showDialog, // 控制弹窗变量
        multipleSelection: [],
        multipleSelectionQudao: [],
        show: false,
        form: { // 表单变量
          bizMode: '',
          shareMode: true,
          poolCode: '',
          poolName: '',
          bizModeList: [],
          dianpuToData: [],
          dianpuData: [],
          qudaoToData: [],
          qudaoData: [],
          CodeTableData: [],
          channelData: []
        }
      }
    }
  },
  watch: {
    showDialog(val) {
      console.log(val)
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
          this.data.form.shareMode = arr.poolBase.shareMode === 0
        }
        const arr1 = []
        if (arr && arr.poolDownwardConfigs && arr.poolDownwardConfigs.length) {
          arr.poolDownwardConfigs.forEach(e => {
            const item = JSON.parse(JSON.stringify(e))
            item.sourceretriveDisabled = item.sourceretriveDisabled === 0
            item.offlineDisabled = item.offlineDisabled === 0
            arr1.push(item)
          })
          this.data.form.qudaoToData = arr1
        }
        const arr2 = []
        if (arr && arr.poolUpwardConfigs && arr.poolUpwardConfigs.length) {
          arr.poolUpwardConfigs.forEach(e => {
            const item = JSON.parse(JSON.stringify(e))
            item.spreadDisabled = item.spreadDisabled === 0
            console.log(item, 'zheli')
            arr2.push(item)
          })
          this.data.form.dianpuToData = arr2
        }
      },
      deep: true
    }
  },
  methods: {
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
      const arr = this.data.form.qudaoToData.filter(item => item.sourceretrivePriority === row.sourceretrivePriority && item.targetValue !== row.targetValue)
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
    testNum(row) {
      // 首先校验用户输入是否规范
      console.log(row.spreadValue)
      var re = /^[0-9]+$/
      console.log(re.test(row.spreadValue))
      if (row.spreadValue === '') return
      if (!re.test(row.spreadValue) || parseInt(row.spreadValue) < 0 || parseInt(row.spreadValue) > 100) {
        this.$message({
          showClose: true,
          message: '比例需要为0-100之间的正整数',
          type: 'error',
          duration: 3000
        })
        row.spreadValue = ''
        return
      }
    },
    reset() {
      console.log('reskjj')
      this.data = {
        dialogVisible: this.showDialog, // 控制弹窗变量
        multipleSelection: [],
        multipleSelectionQudao: [],
        show: false,
        form: { // 表单变量
          bizMode: '',
          shareMode: true,
          bizModeList: this.bizModeList,
          poolCode: '',
          poolName: '',
          dianpuToData: [],
          dianpuData: [],
          qudaoToData: [],
          qudaoData: [],
          CodeTableData: [],
          channelData: []
        }
      }
    },
    // 获取店铺
    getDianpu() {
      this.$axios({
        method: 'post',
        data: { bizMode: this.data.form.bizMode },
        url: '/bff/pos/api/v1/sales/pool/r/query_storepool_list'
      }).then(res => {
        console.log(res.data.data, '请求')
        res.data.data.map(e => {
          e['dictCode'] = e.poolCode
          e['targetValue'] = e.poolCode
          e['targetName'] = e.poolName
          e['targetType'] = 'STORE_POOL'
        })
        this.data.form.dianpuData = res.data.data
      }).catch(e => {
        this.$message('获取店铺失败!')
      })
    },
    // 获取渠道
    getQudao() {
      this.$axios({
        method: 'post',
        data: { bizMode: this.data.form.bizMode },
        url: '/bff/pos/api/v1/sales/pool/r/query_channelpool_list'
      }).then(res => {
        console.log(res.data.data, '请求')
        res.data.data.map(e => {
          e['dictCode'] = e.poolCode
          e['targetValue'] = e.poolCode
          e['targetName'] = e.poolName
          e['targetType'] = 'STORE_POOL'
        })
        this.data.form.qudaoData = res.data.data
      }).catch(e => {
        this.$message('获取店铺失败!')
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
    // 删除行
    delRow(row, str) {
      if (str === 'dianpu') {
        this.data.form.dianpuToData = this.data.form.dianpuToData.filter(item => item.targetValue !== row.targetValue)
      } else {
        this.data.form.qudaoToData = this.data.form.qudaoToData.filter(item => item.targetValue !== row.targetValue)
      }
    },
    // 多选框
    handleSelectionChange(val, str) {
      if (str === 'kucun') {
        this.data.multipleSelection = val
      } else {
        this.data.multipleSelectionQudao = val
      }
    },
    youyi(arr, list) {
      if (arr.length === 0) {
        this.$message('请勾选需要添加的分项！')
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
  .relative{
    position: relative;
  }
</style>
