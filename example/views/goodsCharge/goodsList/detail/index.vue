<template>
  <div v-loading="loading" class="GoodsChargeDetail">
    <DetailInfo :detaildata="detaildata"/>
    <p class="detailTitle">定价记录</p>
    <Table :tableObj="tableObj" :height="400"/>
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page_num" :limit.sync="listQuery.page_size" @pagination="getList"/>
  </div>
</template>
<script>
import { goodsDetailTableConfig } from '../../goodsCommon/goodsConfig.js'
import DetailInfo from './../../common/DetailInfo.vue'
import Table from './../../common/table.vue'
import Pagination from './../../common/Pagination.vue'
import { fetchDetail } from '@/api/goods'
import ApiConfig from '../../goodsCommon/api.js'
export default {
  name: 'GoodsChargeDetail',
  components: { DetailInfo, Table, Pagination },
  data() {
    return {
      tableObj: {
        dataList: goodsDetailTableConfig.dataList,
        labelArr: goodsDetailTableConfig.labelArr,
        selection: false
      },
      searchParam: {}, // 查询条件
      detaildata: {},
      loading: false,
      listQuery: {
        hk_product_code: decodeURIComponent(this.$route.query.id),
        page_num: 1,
        page_size: 50
      },
      total: 0
    }
  },
  created() {
    const product_code = this.$route.query && this.$route.query.id
    this.searchParam.productCode = decodeURIComponent(product_code)
    console.log(this.$route, 777777)
    this.fetchData(this.searchParam)
    this.getList()
  },
  mounted() {

  },
  methods: {
    getList() {
      const that = this
      ApiConfig.priceDetail(this.listQuery).then(res => {
        that.tableObj.dataList = res.data.data.list
        if (that.tableObj.dataList.length) {
          that.tableObj.dataList.forEach((item, index) => {
            item.price_execution_cycle_start += '-' + item.price_execution_cycle_end
            item.guide_price_ratio = item.guide_price_ratio + '%'
          })
        }

        that.listQuery.page_num = res.data.data.current
        that.total = res.data.data.total
        console.log(res, 8888)
      })
    },
    fetchData(data) {
      const that = this
      that.loading = true
      fetchDetail(data).then(response => {
        // 返回来的数据
        that.detaildata = response.data
        that.loading = false
        // 添加color_value属性
      })
    }
  }
}
</script>
