<template>
  <div class="order-box">
    <el-container class="add-list">
      <el-col :span="24">
        <p class="mr"><span class="blue-line">|</span>调拨信息</p>
        <el-form ref="form" :model="form" class="searchBox">
          <el-row>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="单号" label-width="70px">
                <el-input
                  v-model="form.transferNo"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="调拨方式" label-width="90px">
                <el-input
                  v-model="form.transferModeName"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="操作员" label-width="90px">
                <el-input
                  v-model="form.operatorName"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="备注" label-width="80px">
                <el-input
                  v-model="form.remark"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="9" :xl="9" :md="9" :xs="24" :sm="12">
              <el-form-item label="调出仓库" label-width="70px">
                <el-input
                  v-model="form.outWarehouseName"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :lg="9" :xl="9" :md="9" :xs="24" :sm="12">
              <el-form-item label="调入仓库" label-width="80px">
                <el-input
                  v-model="form.inWarehouseName"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="调拨类型" label-width="80px">
                <el-input
                  v-model="form.transferTypeName"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="9" :xl="9" :md="9" :xs="24" :sm="12">
              <el-form-item label="出货地址" label-width="70px">
                <el-input
                  v-model="form.outWarehouseAddressValue"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :lg="9" :xl="9" :md="9" :xs="24" :sm="12">
              <el-form-item label="收货地址" label-width="80px">
                <el-input
                  v-model="form.inWarehouseAddressValue"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6" :md="6" :xs="24" :sm="12">
              <el-form-item label="开单日期" label-width="80px">
                <el-input
                  v-model="form.createTime"
                  :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span>总数量：</span>
              <span> {{ totalApplyQty }}</span>
            </el-col>
            <el-col :span="6">
              <span>总金额：</span>
              <span> {{ totalApplyPrice }}</span>
            </el-col>
            <el-col :span="12">
              <el-col :span="4">
                <el-button v-if="hasActionCode(form.actionList, 'CONTINUE_EDITING_DRAFT')" type="primary" @click="operate('CONTINUE_EDITING_DRAFT', form.transferNo)">继续编辑</el-button>
              </el-col>
              <el-col :span="4">
                <el-button v-if="hasActionCode(form.actionList, 'CONTINUE_EDITING')" type="primary" @click="operate('CONTINUE_EDITING', form.transferNo)">继续编辑</el-button>
              </el-col>
              <el-col :span="4">
                <el-button v-if="hasActionCode(form.actionList, 'DELETE')" type="primary" @click="operate('DELETE', form.transferNo)">删除草稿</el-button>
              </el-col>
              <el-col :span="4">
                <el-button v-if="hasActionCode(form.actionList, 'CANCEL')" type="primary" @click="operate('CANCEL', form.transferNo)">取消</el-button>
              </el-col>
              <el-col :span="4">
                <el-button v-if="hasActionCode(form.actionList, 'CONFIRM_OCCUPY')" type="primary" @click="operate('CONFIRM_OCCUPY', form.transferNo)">确认占库结果</el-button>
              </el-col>
              <el-col :span="4">
                <el-button v-if="hasActionCode(form.actionList, 'RE_OCCUPY')" type="primary" @click="operate('RE_OCCUPY', form.transferNo)">重新占库</el-button>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <div class="mr">
        <div><span class="blue-line">|</span><span>货品信息</span></div>
      </div>
      <div class="detail_result">
        <el-table
          :data="tableData"
          :header-cell-style="{background: '#204060', color: 'white'}"
          style="width: 100%;box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1);"
          height="300"
          border
          @selection-change="selsChange">
          <!-- <el-table-column
            type="selection"
            prop="choose"
            label="选择"
            align="center"
            width="60"/> -->
          <el-table-column
            prop="productNo"
            label="条码"
            align="center"
            width="120"/>
          <el-table-column
            prop="materialCode"
            label="货号"
            align="center"
            width=""/>
          <el-table-column
            prop="sizeName"
            align="center"
            label="尺码"
            width="60"/>
          <el-table-column
            prop="retailPrice"
            align="center"
            label="吊牌价"/>
          <el-table-column
            prop="totalRetailPrice"
            align="center"
            label="金额"/>
          <el-table-column
            prop="productTypeValue"
            align="center"
            label="类别"/>
          <el-table-column
            prop="productProjectValue"
            align="center"
            label="项目"/>
          <el-table-column
            prop="productSeriesValue"
            align="center"
            label="系列"/>
          <el-table-column
            prop="productPatternValue"
            align="center"
            label="款型"/>
          <el-table-column
            prop="brand"
            align="center"
            label="品牌"/>
          <el-table-column
            prop="applyQty"
            label="申请数量"
            align="center"
            width=""/>
          <el-table-column
            prop="occupyQty"
            align="center"
            label="占库量"/>
          <el-table-column
            prop="occupyName"
            label="占库记录"
            align="center"
            width=""/>
          <el-table-column
            v-if="form.billStatus === '1'"
            prop="exceptionalDetail"
            label="异常原因"
            align="center"
            class-name="exce-reason"/>
          <el-table-column
            prop="jit"
            label="JIT"
            align="center"
            class-name="exce-reason"/>
          <el-table-column
            prop="bbc"
            label="BBC"
            align="center"
            class-name="exce-reason"/>
          <el-table-column
            prop="b2c"
            label="B2C"
            align="center"
            class-name="exce-reason"/>
        </el-table>
      </div>
      <div class="detail-pages">
        <div class="left">
          <el-radio-group v-model="radio">
            <!-- <el-radio :label="1">当前页全选</el-radio>
            <el-radio :label="2">所有页全选</el-radio> -->
            <!-- <el-checkbox :disabled="checkAll" v-model="checkCurrent" @change="selectCurrentPage">当前页全选</el-checkbox>
            <el-checkbox :disabled="checkCurrent" v-model="checkAll" @change="selectAllPage">所有页全选</el-checkbox> -->
          </el-radio-group>
        </div>
        <div class="right">
          <el-pagination
            :page-sizes="[25]"
            :current-page="pageNum"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </div>
      <div style="text-align:center">
        <el-row>
          <el-button v-preventReClick type="primary" size="small" @click="Export(form)">导出明细信息</el-button>
        </el-row>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'ScmDetail',
  components: {
  },
  data() {
    return {
      tableData: [], // 货品信息table
      radio: '', // 当前页/所有页全选按钮开关 现已弃用
      total: 0, // 分页器总页数 默认为0
      totalApplyQty: '', // 货品信息的总数量
      totalApplyPrice: '', // 货品信息的总金额
      form: {
        billStatusList: [], // 单据状态
        fromCreateTime: '', // 开单日期的开始日期
        inWarehouseCodeList: [], // 调入仓库
        materialCodeList: [], // 货号
        notEmpty: false,
        operatorCodeList: [], // 操作员
        outWarehouseCodeList: [], // 调出仓
        toCreateTime: '', // 开单日期的结束日期
        productNoList: [],
        transferModeCodeList: [], // 调拨方式
        transferNoList: [], // 单号
        transferTypeCodeList: [], // 调拨类型
        billStatus: ''
      },
      pageNum: 1, // 当前页数
      pageSize: 25, // 分页器每页条数 默认每页25条
      checkCurrent: false, // 当前页全选按钮状态 已弃用
      checkAll: false // 所有页全选按钮状态 已弃用
    }
  },
  async created() {
    if (sessionStorage.getItem('urlName') !== '调拨管理-调拨申请单详情页面') {
      window._paq.push(['setDocumentTitle', '调拨管理-调拨申请单详情页面'])
      window._paq.push(['trackPageView'])
      sessionStorage.setItem('urlName', '调拨管理-调拨申请单详情页面')
    }
    this.getDetail()
  },
  methods: {
    async getDetail() {
      // 调拨信息
      const res = await this.$axios.get(`/bff/api/v1/transfer/${this.$route.params.id}`)
      const dbInfo = res.data.data
      this.totalApplyQty = dbInfo.totalApplyQty
      this.totalApplyPrice = dbInfo.totalApplyPrice.toFixed(2)
      this.form = dbInfo
      // 货品信息
      const request = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      if (this.form.transferNo) {
        request.transferNo = this.form.transferNo
      }

      if (this.form.productNoList && this.form.productNoList.length) {
        request.productNoList = [this.form.productNoList]
      }
      const res2 = await this.$axios.post('/bff/api/v1/transfer/detail/_page', request)
      this.total = res2.data.data.total
      this.tableData = res2.data.data.list
    },
    // 判断该条单据是否有操作项
    hasActionCode(actionList, actionCode) {
      if (actionList && actionList.length) {
        return actionList.filter(item => item.actionCode === actionCode).length
      }
      return false
    },
    // 点击相应操作按钮并刷新
    async operate(actionCode, transferNo) {
      if (!actionCode) {
        return
      }
      if (actionCode === 'CANCEL') {
        this.$confirm('确定取消调拨申请单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer/manage', {
            transferNo: transferNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$message({
              message: '取消成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.getDetail()
        })
      }
      if (actionCode === 'CONFIRM_OCCUPY') {
        this.$confirm('确定进行占库确认吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer/manage', {
            transferNo: transferNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$message({
              message: '占库确认成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.getDetail()
        })
      }
      if (actionCode === 'DELETE') {
        this.$confirm('确定删除该草稿吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer/manage', {
            transferNo: transferNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.getDetail()
        })
      }
      if (actionCode === 'CONTINUE_EDITING_DRAFT') {
        this.$router.push({
          path: '/scm/add/',
          query: {
            info: transferNo
          }
        })
      }
      if (actionCode === 'CONTINUE_EDITING') {
        this.$router.push({
          path: '/scm/add/',
          query: {
            info2: transferNo
          }
        })
      }
      if (actionCode === 'RE_OCCUPY') {
        this.$confirm('确定重新占库吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$axios.post('/bff/api/v1/transfer/manage', {
            transferNo: transferNo,
            action: actionCode
          })
          if (res.status === 200) {
            this.$message({
              message: '请求成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.getDetail()
        })
      }
    },
    // 切换选择每页多少条
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      // this.pageNum = 1
      this.getDetail()
    },
    // 翻页
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.getDetail()
    },
    load(status) {
      this.loading = status
    },
    query(data) {
      this.tableData = data
    },
    selsChange(sels) {
      this.sels = sels
    },
    // 导出明细信息
    Export(params) {
      const request = {
        billStatusList: [params.billStatus],
        fromCreateTime: params.fromCreateTime,
        inWarehouseCodeList: [params.inWarehouseCode],
        outWarehouseCodeList: [params.outWarehouseCode],
        toCreateTime: params.toCreateTime,
        transferModeCodeList: [params.transferModeCode],
        transferNoList: [params.transferNo],
        transferTypeCodeList: [params.transferTypeCode]
      }
      const that = this
      this.undisable = true
      this.$axios({
        method: 'post',
        url: `/bff/api/v1/transfer/detail/_export`,
        data: request,
        timeout: 120000,
        responseType: 'blob'
      }).then(res => {
        that.undisable = false
        if (res.data.code) {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '调拨明细导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
*{font-size: 12px;}
.add-list {
  display: block;
  width:100%;
  padding: 15px 40px
}
.blue-line{
  width: 15px;
  font-weight: 900;
  color: blue;
  display: inline-block;
}
.searchBox {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 15px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1);
}
.detail_result {
  margin-top: 10px;
}
.detail-pages {
  overflow: hidden;
}
.detail-pages > .left {
  float: left;
  line-height: 40px;
  margin-left: 10px;
}
.detail-pages > .right {
  float: right;
  line-height: 40px;
  margin-right: 20px;
}
</style>
