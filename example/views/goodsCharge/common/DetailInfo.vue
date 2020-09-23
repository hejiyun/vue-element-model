<!--详情-->
<template>
  <div class="detailInfo">
    <p class="detailTitle">货品详情</p>
    <div class="detail-col">
      <p class="title"><span>宝唯货号:</span><span class="info">{{ detaildata.bw_product_code }}</span></p>
      <p class="title"><span>恒康货号:</span><span class="info">{{ detaildata.product_code }}</span></p>
      <p class="title"><span>货品简称:</span><span class="info">{{ detaildata.short_name }}</span></p>
      <p class="title"><span>上市日期:</span><span class="info">{{ detaildata.listing_date | filterListingDate }}</span></p>
    </div>
    <div class="detail-col">
      <p class="title"><span>品牌:</span><span class="info">{{ detaildata.brand_value }}</span></p>
      <p class="title"><span>吊牌价:</span><span class="info">{{ detaildata.retail_price }}</span></p>
      <p class="title"><span>年份:</span><span class="info">{{ detaildata.year }}</span></p>
      <p class="title"><span>季节:</span><span class="info">{{ detaildata.develop_season_value | filterListingDate }}</span></p>
    </div>
    <div class="detail-col">
      <p class="title"><span>产地:</span><span class="info">{{ detaildata.producing_area }}</span></p>
      <p class="title"><span>性别:</span><span class="info">{{ detaildata.sex_value }}</span></p>
      <p class="title"><span>类别:</span><span class="info">{{ detaildata.product_type_value }}</span></p>
      <p class="title"><span>款型:</span><span class="info">{{ detaildata.product_pattern_value }}</span></p>
    </div>
    <div class="detail-col">
      <p class="title"><span>项目:</span><span class="info">{{ detaildata.project_value }}</span></p>
      <p class="title"><span>系列:</span><span class="info">{{ detaildata.product_series_value }}</span></p>
      <p class="title"><span>主项目:</span><span class="info">{{ detaildata.main_project_value }}</span></p>
      <p class="title"><span>类目:</span><span class="info">{{ '  ' }}</span></p>
    </div>
    <div class="detail-col">
      <p class="title"><span>货品全称:</span><span class="info">{{ detaildata.full_name }}</span></p>
      <p class="title"><span>货品英文名称:</span><span class="info">{{ detaildata.foreign_name }}</span></p>
      <p class="title"><span>款号:</span><span class="info">{{ detaildata.product_pattern_code_value }}</span></p>
      <p class="title"><span>子款型:</span><span class="info">{{ detaildata.product_child_pattern_value }}</span></p>
    </div>
    <div class="detail-col">
      <p class="title"><span>子项目:</span><span class="info">{{ detaildata.child_project_value }}</span></p>
      <p class="title"><span>子系列:</span><span class="info">{{ detaildata.child_series_value }}</span></p>
      <p class="title"><span>供应商:</span><span class="info">{{ detaildata.supplier_value }}</span></p>
      <p class="title"><span>商业模式:</span><span class="info">{{ detaildata.business_pattern | businessPatternFilter }}</span></p>
    </div>
    <div class="detail-col">
      <p class="title"><span>面料:</span><span class="info">{{ detaildata.shell_fabric_value }}</span></p>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    // 组件
  },
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
  props: {
    detaildata: {
      type: Object,
      default: () => null
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    // 方法
  }
}
</script>
