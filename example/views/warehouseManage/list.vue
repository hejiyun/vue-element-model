<template>
  <el-container class="order-box">
    <el-col :span="24">
      <search-bar
        ref="searchtop"
        :all-oreder-params="true"
        :options="whouseListOptions"
        :export-options="defaultExportOptions"
        :width-number="6"
        is-export
        @search="searchList"
      />
    </el-col>
    <table-common v-loading="loading" :table-header="whouseListHeader" :table-data="tableData" :height="180" :table-button-width="100" table-button>
      <template slot="btn" slot-scope="scope">
        <el-button type="text" @click="handleView(scope.rowData.$index, scope.rowData.row)">编辑</el-button>
        <el-button v-preventReClick v-if="false" v-show="scope.rowData.row.btnStatus === 0" type="text" @click="changeStatus(scope.rowData.row)">启用</el-button>
        <el-button v-preventReClick v-if="false" v-show="scope.rowData.row.btnStatus === 1" type="text" @click="changeStatus(scope.rowData.row)">禁用</el-button>
      </template>
    </table-common>
    <page-common
      ref="page"
      api="/bff/bd/api/v1/warehouse/getWarehousePagination"
      method="post"
      get-params
      @getParams="getParamsChange"
      @query="query"
      @loading="load"
    />
    <el-dialog :visible.sync="dialogFormVisible" title="仓库信息编辑">
      <el-form :model="form">
        <el-col :span="12">
          <el-form-item label-width="120px" label="所属账套" >
            <el-input v-model="form.warehouseAccount" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="仓库外码" >
            <el-input v-model="form.warehouseExternalCode" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="仓库名称" >
            <el-input v-model="form.warehouseName" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="仓库内码" >
            <el-input v-model="form.warehouseCode" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="仓库类型" >
            <el-input v-model="form.warehouseTypeValue" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="实体仓" >
            <el-input v-model="form.physicalWarehouse" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="仓库属性" >
            <el-input v-model="form.warehousePropertyValue" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="仓库分类" >
            <el-input v-model="form.warehouseCategoryValue" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务类型" label-width="120px">
              <el-select v-model="form.bizType" placeholder="全部">
                <el-option v-for="(item, index) in currentBizeType" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物理仓" label-width="120px">
              <el-select v-model="form.samePhysicalWarehouse" placeholder="全部">
                <el-option v-for="(item, index) in currentPhysicalWarehouse" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指定仓发" label-width="120px">
              <el-select v-model="form.designatedWarehouseSend" placeholder="全部">
                <el-option v-for="(item, index) in currentDesignatedWarehouse" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宝唯物理仓" label-width="120px">
              <el-select v-model="form.bwPhysicalWarehouse" placeholder="全部">
                <el-option v-for="(item, index) in currentBwPhysicalWarehouse" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-preventReClick type="primary" @click="submitEdit(form)">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import SearchBar from './SearchBar'
import PageCommon from '@/components/PageCommon'
import TableCommon from '@/components/TableCommon'
import TableText from '@/textResources/tableText'
import searchBarOptions from '@/textResources/searchBarOptions'
import { get } from '@/utils/request'
const getWhouseSearch = () => get('/bff/bd/api/v1/dic/query?types=bizType,samePhysicalWarehouse,designatedWarehouseSend,warehouseStatus,physicalWarehouse,bwPhysicalWarehouse')

export default {
  name: 'WareHoseList',
  components: {
    SearchBar,
    PageCommon,
    TableCommon
  },
  data() {
    return {
      whouseListOptions: searchBarOptions.whouseListOptions,
      whouseListHeader: TableText.whouseListHeader,
      currentPhysicalWarehouse: [],
      currentDesignatedWarehouse: [],
      currentBwPhysicalWarehouse: [],
      currentBizeType: [],
      tableData: [],
      form: {
      },
      loading: false,
      getFlag: false,
      Dictionary: {
        bizType: [],
        physicalWarehouse: [],
        samePhysicalWarehouse: [],
        designatedWarehouseSend: []
      },
      dialogFormVisible: false,
      oldTabel: [],
      currentItem: [],
      defaultExportOptions: {
        url: '/bff/bd/api/v1/warehouse/exportWarehouse',
        data: {
          pageSize: 10
        },
        method: 'post',
        hasParams: true
      }
    }
  },
  async created() {
    const res = await getWhouseSearch()
    const lest = res.data.data
    console.log(lest)
    for (var k in lest) {
      lest[k].map(item => {
        item['value'] = item.dic_key
        item['label'] = item.dic_value
      })
      lest[k].unshift({
        value: 'all',
        label: '全部'
      })
    }
    this.Dictionary = lest
    this.whouseListOptions[2].options = lest.warehouseName
    this.whouseListOptions[3].options = lest.physicalWarehouse
    this.whouseListOptions[4].options = lest.bizType
    this.currentBizeType = lest.bizType
    this.currentBizeType.shift()
    this.whouseListOptions[5].options = lest.samePhysicalWarehouse
    this.currentPhysicalWarehouse = lest.samePhysicalWarehouse
    this.currentPhysicalWarehouse.shift()
    this.whouseListOptions[6].options = lest.bwPhysicalWarehouse
    this.currentBwPhysicalWarehouse = lest.bwPhysicalWarehouse
    this.currentBwPhysicalWarehouse.shift()
    this.whouseListOptions[7].options = lest.designatedWarehouseSend
    this.currentDesignatedWarehouse = lest.designatedWarehouseSend
    this.currentDesignatedWarehouse.shift()
    // this.whouseListOptions[8].options = lest.warehouseStatus
  },
  methods: {
    async changeStatus(row) {
      const params = {
        warehouseCode: row.warehouseCode,
        warehouseStatus: row.btnStatus ? 0 : 1
      }
      try {
        const res = await this.$api.updataWhouseMsg(params)
        if (res.data.code !== '0') {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        this.$notify({
          title: '成功',
          message: res.data.msg,
          type: 'success',
          duration: 2000
        })
        this.$refs.page.getList()
      } catch (error) {
        this.$notify({
          title: '错误',
          message: '编辑失败,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    getParamsChange(params) {
      this.defaultExportOptions.data = params
    },
    searchList(params) {
      this.$refs.page.getList(params)
    },
    handleView(index, row) {
      const item = this.oldTabel.filter(e => e.id === row.id)
      const str = JSON.stringify(item[0])
      this.currentItem = JSON.parse(str)
      this.form = item[0]
      this.form.physicalWarehouse = this.form.physicalWarehouse ? '是' : '否'
      if (this.form.bizType === 0) {
        this.form.bizType = '未选择'
      } else {
        this.form.bizType = (this.form.bizType).toString()
      }
      if (this.form.samePhysicalWarehouse === '') {
        this.form.samePhysicalWarehouse = '未选择'
      } else {
        this.form.samePhysicalWarehouse = (this.form.samePhysicalWarehouse).toString()
      }
      if (this.form.designatedWarehouseSend === 0) {
        this.form.designatedWarehouseSend = '未选择'
      } else {
        this.form.designatedWarehouseSend = (this.form.designatedWarehouseSend).toString()
      }
      this.form.bwPhysicalWarehouse = (this.form.bwPhysicalWarehouse).toString()
      this.dialogFormVisible = true
    },
    async submitEdit(form) {
      const params = {
        warehouseCode: form.warehouseCode,
        bizType: form.bizType,
        samePhysicalWarehouse: form.samePhysicalWarehouse,
        designatedWarehouseSend: form.designatedWarehouseSend,
        bwPhysicalWarehouse: form.bwPhysicalWarehouse
      }
      if (params.samePhysicalWarehouse === '未选择' || params.samePhysicalWarehouse === (this.currentItem.samePhysicalWarehouse).toString()) {
        params.samePhysicalWarehouse = null
      }
      if (params.bizType === '未选择' || params.bizType === (this.currentItem.bizType).toString()) {
        params.bizType = null
      }
      if (params.designatedWarehouseSend === '未选择' || params.designatedWarehouseSend === (this.currentItem.designatedWarehouseSend).toString()) {
        params.designatedWarehouseSend = null
      }
      if (params.bwPhysicalWarehouse === '未选择' || params.bwPhysicalWarehouse === (this.currentItem.bwPhysicalWarehouse).toString()) {
        params.bwPhysicalWarehouse = null
      }
      if (!params.designatedWarehouseSend && !params.samePhysicalWarehouse && !params.bizType && !params.bwPhysicalWarehouse) {
        this.$notify({
          title: '提示',
          message: '本次未进行编辑',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        return
      }
      try {
        const res = await this.$api.updataWhouseMsg(params)
        if (res.data.code !== '0') {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        this.$notify({
          title: '成功',
          message: res.data.msg,
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.$refs.page.getList(this.defaultExportOptions.data)
      } catch (error) {
        this.$notify({
          title: '错误',
          message: '编辑失败,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }
    },
    query(data) {
      const data1 = JSON.stringify(data)
      if (data) {
        this.oldTabel = JSON.parse(data1)
        setTimeout(() => {
          data.map(item => {
            const t1 = this.Dictionary.bizType.filter(e => e.value === `${item.bizType}`)[0] || { label: '' }
            const t2 = this.Dictionary.physicalWarehouse.filter(e => e.value === `${item.physicalWarehouse}`)[0] || { label: item.physicalWarehouse }
            const t3 = this.Dictionary.samePhysicalWarehouse.filter(e => e.value === `${item.samePhysicalWarehouse}`)[0] || { label: item.samePhysicalWarehouse }
            const t4 = this.Dictionary.designatedWarehouseSend.filter(e => e.value === `${item.designatedWarehouseSend}`)[0] || { label: '' }
            const t5 = this.Dictionary.bwPhysicalWarehouse.filter(e => e.value === `${item.bwPhysicalWarehouse}`)[0] || { label: '' }
            item.bizType = t1.label
            item.btnStatus = item.warehouseStatus
            item.physicalWarehouse = t2.label
            item.samePhysicalWarehouse = t3.label
            item.designatedWarehouseSend = t4.label
            item.bwPhysicalWarehouse = t5.label
            item.warehouseStatus = item.warehouseStatus ? '启用' : '禁用'
          })
          this.tableData = data
        }, 500)
      }
    },
    load(status) {
      this.loading = status
    }
  }
}
</script>
<style scoped>
 .blue-line{
    width: 15px;
    font-weight: 900;
    color: blue;
    display: inline-block;
  }
    .order-box {
    display: block;
    width:100%;
    padding: 15px 40px;
  }
 .mr{
    margin: 10px 0;
  }
.el-divider{
   margin: 15px 0
 }
</style>
