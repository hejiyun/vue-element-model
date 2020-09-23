<template>
  <div class="createPost-container goods_detail">
    <div class="createPost-main-container">
      <el-card class="box-card" style="margin:4px; border:solid 1px #ccc">
        <div slot="header" class="clearfix">
          <h3>货品详情</h3>
        </div>
        <!--6 item-->
        <!-- 修改货品详情展示字段排列顺序 -->
        <el-row class="text item">
          <el-col :span="6">宝唯货号:{{ tempData.bw_product_code }}</el-col>
          <el-col :span="6">恒康货号:{{ tempData.product_code }}</el-col>
          <el-col :span="6">货品简称:{{ tempData.short_name }}</el-col>
          <el-col :span="6">上市日期:{{ tempData.listing_date | filterListingDate }}</el-col>
        </el-row>
        <el-row class="text item">
          <el-col :span="6">品牌:{{ tempData.brand_value }}</el-col>
          <el-col :span="6">吊牌价:{{ tempData.retail_price }}</el-col>
          <el-col :span="6">年份:{{ tempData.year }}</el-col>
          <el-col :span="6">季节:{{ tempData.develop_season_value }}</el-col>
        </el-row>
        <el-row class="text item">
          <el-col :span="6">产地:{{ tempData.producing_area }}</el-col>
          <el-col :span="6">性别:{{ tempData.sex_value }}</el-col>
          <el-col :span="6">类别:{{ tempData.product_type_value }}</el-col>
          <el-col :span="6">款型:{{ tempData.product_pattern_value }}</el-col>
        </el-row>
        <el-row class="text item">
          <el-col :span="6">项目:{{ tempData.project_value }}</el-col>
          <el-col :span="6">系列:{{ tempData.product_series_value }}</el-col>
          <el-col :span="6">主项目:{{ tempData.main_project_value }}</el-col>
          <el-col :span="6">类目:{{ '  ' }}</el-col>
        </el-row>
        <el-row class="text item">
          <el-col :span="6">货品全称:{{ tempData.full_name }}</el-col>
          <el-col :span="6">货品英文名称:{{ tempData.foreign_name }}</el-col>
          <el-col :span="6">款号:{{ tempData.product_pattern_code_value }}</el-col>
          <el-col :span="6">子款型:{{ tempData.product_child_pattern_value }}</el-col>
        </el-row>
        <el-row class="text item">
          <el-col :span="6">子项目:{{ tempData.child_project_value }}</el-col>
          <el-col :span="6">子系列:{{ tempData.child_series_value }}</el-col>
          <el-col :span="6">供应商:{{ tempData.supplier_value }}</el-col>
          <el-col :span="6">商业模式:{{ tempData.business_pattern | businessPatternFilter }}</el-col>
        </el-row>
        <el-row class="text item">
          <el-col :span="6">面料:{{ tempData.shell_fabric_value }}</el-col>
        </el-row>
      </el-card>
      <el-card :body-style="{padding:'5px'}" class="box-card table-card" style="margin:4px; border:solid 1px #ccc">
        <div slot="header" class="clearfix">
          <h3>SKU列表</h3>
        </div>
        <!-- <table-common :table-header="columns" :table-data="skudata" border expand>.</table-common> -->
        <el-table
          :data="skudata"
          :header-cell-style="{background: '#204060', color: 'white', padding: '1px 0'}"
          :span-method="objectSpanMethod"
          border
          expand>
          <el-table-column
            v-for="col in tableHeader"
            :prop="col.prop"
            :key="col.prop"
            :label="col.label"
            :width="col.width | null"
            align="center"
          >
            .</el-table-column>
        </el-table>
      </el-card>

      <el-card class="box-card" style="margin:4px; border:solid 1px #ccc">
        <div slot="header" class="clearfix">
          <h3>货品详情</h3>
        </div>
        <el-row class="text item">
          <div class="image-goods-div">
            <el-col>商品主图:</el-col>
            <el-col>
              <el-card v-for="img in tempData.main_images" :key="img.img_url" style="margin-right: 4px;display: inline-block">
                <img
                  v-image-preview
                  :key="img.img_url"
                  :src="img.img_url"
                  :onerror="defaultImg"
                  class="goods-image" >
                <div style="padding: 1px; text-align: center">
                  <span>{{ img.img_name }}</span>
                </div>
              </el-card>
            </el-col>
          </div>
          <el-divider/>
        </el-row>
        <el-row class="text item">
          <div class="image-goods-div">
            <el-col >透明图:</el-col>
            <el-col>
              <el-card v-for="img in tempData.transparent_images" :key="img.img_url" style="margin-right: 4px;display: inline-block">
                <img
                  v-image-preview
                  :key="img.img_url"
                  :src="img.img_url"
                  :onerror="defaultImg"
                  class="goods-image" >
                <div style="padding: 1px; text-align: center">
                  <span>{{ img.img_name }}</span>
                </div>
              </el-card>
            </el-col>
          </div>
          <el-divider/>
        </el-row>
        <el-row class="text item">
          <div class="image-goods-div">
            <el-col >吊牌图:</el-col>
            <el-col>
              <el-card v-for="img in tempData.tag_images" :key="img.img_url" style="margin-right: 4px;display: inline-block">
                <img
                  v-image-preview
                  :key="img.img_url"
                  :src="img.img_url"
                  :onerror="defaultImg"
                  class="goods-image" >
                <div style="padding: 1px; text-align: center">
                  <span>{{ img.img_name }}</span>
                </div>
              </el-card>
            </el-col>
          </div>
          <el-divider/>
        </el-row>
        <el-row class="text item">
          <div class="image-goods-div">
            <el-col >详情页切图:</el-col>
            <el-col>
              <el-card v-for="img in tempData.detail_images" :key="img.img_url" style="margin-right: 4px;display: inline-block">
                <img
                  v-image-preview
                  :key="img.img_url"
                  :src="img.img_url"
                  :onerror="defaultImg"
                  class="goods-image" >
                <div style="padding: 1px; text-align: center">
                  <span>{{ img.img_name }}</span>
                </div>
              </el-card>
            </el-col>
          </div>
          <el-divider/>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchDetail } from '@/api/goods'
export default {
  name: 'GoodsDetail',
  filters: {
    businessPatternFilter(status) {
      const businessPatternMap = {
        '-1': '委托代销',
        '0': '受托代销',
        '1': '货品联营'
      }
      return businessPatternMap[status]
    },
    filterListingDate(val) {
      if (val) {
        return val.toString().substring(0, 10)
      }
    }
  },
  data() {
    return {
      query: { productCode: null },
      // pcode: { productCode: null },
      seriesOptions: [],
      skudatalength: null,
      tempData: {},
      loading: false,
      total: 0,
      defaultImg: 'this.src = "' + require('@/assets/404_images/404.png') + '"',
      tempRoute: {},
      skudata: null,
      tableHeader: [
        { prop: 'color_value', label: '颜色' },
        { prop: 'sizeTypeValue', label: '尺码类别' },
        { prop: 'sizeDetailValue', label: '尺码' },
        { prop: 'barCode', label: '条码' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'resourceCode'
    ])
  },
  mounted() {
    const product_code = this.$route.params && this.$route.params.id
    this.query.productCode = decodeURIComponent(product_code)
    this.tempRoute = Object.assign({}, this.$route)
    // 请求数据
    this.fetchData(this.query)
  },
  methods: {
    // title 中添加orderNo
    setTagsViewTitle() {
      const title = '货品详情'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.query.productCode}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    fetchData(data) {
      this.loading = true
      fetchDetail(data).then(response => {
        // 返回来的数据
        this.tempData = response.data
        var color = response.data.color_value
        var skudata = response.data.product_detail_list
        this.skudatalength = skudata.length
        // 添加color_value属性
        for (let i = 0; i < skudata.length; i++) {
          var item = skudata[i]
          item['color_value'] = color
        }
        this.skudata = skudata
        // console.log(this.tempData)
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)
        this.setTagsViewTitle()
      }).catch(error => {
        console.log(error, 'getDetailError')
        this.loading = false
      }).finally(() => {
        this.loading = false
      })
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      var length = this.skudatalength + 1
      if (columnIndex === 0) {
        if (rowIndex % length === 0) {
          return {
            rowspan: length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .image-goods-div{
    display: inline-block;
  }
  .goods-image{
    display: inline-block;
    width: 8em;
  }
  .item{
    font-size: 12px;
    padding-bottom: 4px;
  }
  .createPost-container{
     display: block;
     width:100%;
  }
</style>
