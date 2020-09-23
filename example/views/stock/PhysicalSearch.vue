<template>
  <div>
    <el-container class="order-box stockExample">
      <el-col class="searchBox">
        <el-form ref="searchForm" :model="searchForm">
          <el-col>
            <el-form-item class="switchStock">
              <el-radio-group v-model="searchForm.searchCodeType">
                <el-radio-button label="materialCode">货号</el-radio-button>
                <el-radio-button label="barCode" style="margin-left:-2px;">条码</el-radio-button>
              </el-radio-group>
              <!-- <span style="color: red; font-size: 16px; padding-left: 4px;">*</span> -->

              <el-input ref="gdt" :autosize="{ minRows: 2, maxRows: 3 }" v-model="searchForm.code" placeholder="可批量输入 以英文逗号隔开" type="textarea" @keyup.native="convertChineseComma"/>

            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="仓库类别">
              <el-select v-model="selectedWarehouseType" clearable style="width:100%" placeholder="全部" @change="getTypeToWarehouse">
                <el-option v-for="item in warehouseTypeList" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item class="bt" label="仓库">
              <selectWarehouse ref="sle" :porps-type="selectedWarehouseType" @getValue="getvalue"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="品牌">
              <el-select v-model="searchForm.brandCodeList" style="width:100%" filterable reserve-keyword multiple collapse-tags placeholder="全部">
                <el-option
                  v-for="item in brandList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="实物数≥">
              <el-input v-model="searchForm.minTotalQty" placeholder="请输入整数" type="number" @blur="searchForm.minTotalQty = toInt(searchForm.minTotalQty)"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="未分配可用数≥">
              <el-input v-model="searchForm.minUnallocatedQty" placeholder="请输入整数" type="number" @blur="searchForm.minUnallocatedQty = toInt(searchForm.minUnallocatedQty)"/>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
              <el-button type="primary" @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-form>
        <div class="showbox" style="color:#00ace6;cursor:pointer;text-align:right;">
          <span v-show="!showMore" style="text-decoration: underline" @click="setShowMore(true)">展开查看商品详情
            <i class="el-icon-right"/>
          </span>
          <span v-show="showMore" style="text-decoration: underline" @click="setShowMore(false)">
            <i class="el-icon-back"/>
            收起
          </span>
        </div>
      </el-col>
      <div v-show="!showMore" class="showbox">
        <el-table
          :data="inventoryList"
          :header-cell-style="{background: '#204060', color: 'white'}"
          style="width: 100%"
          height="calc(100vh - 210px)"
          border>
          <af-table-column
            prop="materialCode"
            label="货号"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="sizeTypeValue"
            label="尺码类别"
            align="center"/>
          <af-table-column
            prop="size"
            label="尺码"
            align="center"/>
          <af-table-column
            prop="barCode"
            label="sku条码"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="shortName"
            label="货品简称"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="brandName"
            label="品牌"
            align="center"/>
          <af-table-column
            prop="externalWarehouseCode"
            label="仓库代码"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="warehouseName"
            label="仓库名称"
            align="center"/>
          <af-table-column
            prop="warehouseTypeName"
            label="仓库类型"
            align="center"/>
          <el-table-column
            prop="totalQty"
            align="center"
            min-width="90">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">实物数</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="occupiedQty"
            align="center"
            min-width="90">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">占用数</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unallocatedQty"
            align="center"
            min-width="100">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">未分配数</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="allocatedQty"
            align="center"
            min-width="100">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">已分配数</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="showMore" class="showbox">
        <el-table
          :data="inventoryList"
          :header-cell-style="{background: '#204060', color: 'white'}"
          style="width: 100%"
          height="calc(100vh - 210px)"
          border>
          <af-table-column
            prop="materialCode"
            label="货号"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="sizeTypeValue"
            label="尺码类别"
            align="center"/>
          <af-table-column
            prop="size"
            label="尺码"
            align="center"/>
          <af-table-column
            prop="barCode"
            label="sku条码"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="shortName"
            label="货品简称"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="brandName"
            label="品牌"
            align="center"/>
          <af-table-column
            prop="externalWarehouseCode"
            label="仓库代码"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="warehouseName"
            label="仓库名称"
            align="center"/>
          <af-table-column
            prop="warehouseTypeName"
            label="仓库类型"
            align="center"/>
          <el-table-column
            prop="totalQty"
            align="center"
            min-width="90">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">实物数</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="occupiedQty"
            align="center"
            min-width="90">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">占用数</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unallocatedQty"
            align="center"
            min-width="100">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">未分配数</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="allocatedQty"
            align="center"
            min-width="100">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">已分配数</span>
            </template>
          </el-table-column>
          <af-table-column
            v-if="showMore"
            prop="color"
            label="颜色"
            align="center"/>
          <af-table-column
            v-if="showMore"
            prop="retailPrice"
            label="零售价"
            align="center"/>
          <af-table-column
            v-if="showMore"
            prop="year"
            label="年份"
            align="center"/>
          <af-table-column
            v-if="showMore"
            prop="developSeasonValue"
            label="季节"
            align="center"/>
          <af-table-column
            v-if="showMore"
            prop="listingDate"
            label="上市时间"
            align="center"/>
          <af-table-column
            v-if="showMore"
            :show-overflow-tooltip="true"
            prop="productSeriesValue"
            label="系列"
            align="center"/>
          <af-table-column
            v-if="showMore"
            prop="sexValue"
            label="性别"
            align="center"/>
          <af-table-column
            v-if="showMore"
            :show-overflow-tooltip="true"
            prop="productTypeValue"
            label="类别"
            align="center"/>
          <af-table-column
            v-if="showMore"
            :show-overflow-tooltip="true"
            prop="productPatternValue"
            label="款型"
            align="center"/>
          <af-table-column
            v-if="showMore"
            :show-overflow-tooltip="true"
            prop="projectValue"
            label="项目"
            align="center"/>
        </el-table>
      </div>
      <div class="page-bar">
        <div class="mr2">
          <div style="font-size:20px;" class="bcode">
            <span>共<span style="color:red">{{ total }}</span>个数据</span><span v-if="total > 10000">，只能查询前10000个数据</span>
          </div>
        </div>
        <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :pager-count="5"
          :total="searchableTotal"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-container>
  </div>
</template>

<script>
import selectWarehouse from './searchBar/text'

export default{
  name: 'PhysicalSearch',
  components: {
    selectWarehouse
  },
  data() {
    return {
      searchForm: { // 表单数据
        code: '', // 条码或货号
        searchCodeType: 'materialCode', // 查询编码类型，按条码(barCode)或货号查询(materialCode)
        brandCodeList: [], // 品牌code list
        // externalWarehouseCodeList: [], // 仓库外码list
        warehouseCodeList: [], // 仓库内码list
        minUnallocatedQty: '', // 最小未分配可用数
        minTotalQty: '' // 最小实物数
      },
      inventoryList: [], // 实物库存list
      brandList: [], // 品牌list
      warehouseTypeList: [], // 仓库类别list
      selectedWarehouseType: '', // 选中的仓库类别
      pageNum: 1, // 当前页数
      pageSize: 50, // 每页查询数量
      searchableTotal: 0, // 可查询的总数
      total: 0, // 查询总数
      showMore: false // 是否展开查看商品详情
    }
  },
  async created() {
    this.getBrand()
    this.getWarehouseType()
  },
  async mounted() {
    this.searchPhysicalInventory()
  },
  methods: {
    // 修改每页条数
    async handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageNum = 1
      this.searchPhysicalInventory()
    },

    // 转int
    toInt(value) {
      if (value) {
        return parseInt(value)
      }
      return null
    },

    // 修改当前页数
    async handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.searchPhysicalInventory()
    },

    // 获取品牌
    async getBrand() {
      const res = await this.$axios.get('/bff/api/v1/brands')
      this.brandList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },

    // 获取仓库类型
    async getWarehouseType() {
      const res = await this.$api.getDictType('physical_inventory_query_warehouse_type')
      this.warehouseTypeList = res.data.data.map(item => {
        return {
          value: item.dictCode,
          label: item.dictValue
        }
      })
    },

    // 修改是否展开查看商品详情
    setShowMore(value) {
      this.showMore = !this.showMore
    },

    // 中文逗号转英文逗号
    convertChineseComma() {
      this.searchForm.code = this.searchForm.code.replace(/，/g, ',')
    },

    // 把选中的仓库编码赋值到表单对象
    getvalue(selectedWarehouseCodeList) {
      // this.searchForm.externalWarehouseCodeList = selectedWarehouseCodeList ? selectedWarehouseCodeList.map(item => item.value) : []
      // 改为传仓库内码
      this.searchForm.warehouseCodeList = selectedWarehouseCodeList ? selectedWarehouseCodeList.map(item => item.value) : []
    },

    // 根据选中的仓库类别显示相应类别的仓库
    async getTypeToWarehouse(warehouseTypeCode) {
      // this.searchForm.externalWarehouseCodeList = []
      // 改为传仓库内码
      this.searchForm.warehouseCodeList = []
      this.$refs.sle.clearSelection()
      this.$refs.sle.getList('', warehouseTypeCode)
    },

    // 查询实物库存
    async searchPhysicalInventory() {
      const request = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.searchForm.code) {
        const arr = []
        this.searchForm.code.split(',').map(item => {
          item = item.replace(/[\r\n]/g, '').trim()
          if (item) {
            arr.push(item)
          }
        })
        request[this.searchForm.searchCodeType + 'List'] = arr
      }

      // 改为传仓库内码
      if (this.searchForm.warehouseCodeList && this.searchForm.warehouseCodeList.length) {
        request.warehouseCodeList = this.searchForm.warehouseCodeList
      } else if (this.selectedWarehouseType) {
        const data = await this.$api.getwarehouseList('', [this.selectedWarehouseType])
        // request.externalWarehouseCodeList = data.data.data.warehouseList.map(item => item.externalWarehouseCode)
        request.warehouseCodeList = data.data.data.warehouseList.map(item => item.warehouseCode)
      }

      if (this.searchForm.brandCodeList) {
        request.brandCodeList = this.searchForm.brandCodeList
      }

      if (this.searchForm.minTotalQty) {
        request.minTotalQty = this.searchForm.minTotalQty
      }

      if (this.searchForm.minUnallocatedQty) {
        request.minUnallocatedQty = this.searchForm.minUnallocatedQty
      }

      const res = await this.$axios.post('/bff/api/v1/physical_inventory/_search', request)
      this.inventoryList = res.data.data.list
      this.total = res.data.data.total
      this.searchableTotal = this.total > 10000 ? 10000 : this.total
    },

    // 重置
    reset() {
      for (const key in this.searchForm) {
        this.searchForm[key] = ''
      }
      this.selectedWarehouseType = ''
      this.searchForm.searchCodeType = 'materialCode'
      this.$refs.sle.reset()
    }
  }
}
</script>

<style>
  label {
    font-size: 11px !important;
    font-weight: 500;
  }
</style>
<style lang='scss' scoped>
  * {
    font-size: 11px;
    font-family: tahoma, arial, 宋体, sans-serif;
  }
   .searchBox{
     display: block;
   }
  .order-box {
    display: block;
    width:100%;
    padding: 15px 40px;
  }
  .mr{
    position: absolute;
    right: 10px;
    width: 300px;
    text-align: right;
    &>div{
      display:inline-block;
    }
  }
  .mr2{
    position: absolute;
    display:inline-block;
    left: 10px;
  }
  .dejts {
    margin-bottom: -10px;
  }
  .page-bar {
   position: relative;
  }
  .el-pagination {
    white-space: normal;
  }
</style>
