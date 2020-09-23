<template>
  <div class="store-shelves-result">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="$router.push(`/ODS/ReceiveList/ReceiveDetail/${scope.row.billNo}`)">查看</el-button>
        <el-button type="text" @click="Send(scope.row.billNo)">导出</el-button>
      </template>
      <template v-slot:table-billNo="scope">
        <router-link :to="{path: `/ODS/ReceiveList/ReceiveDetail/${scope.row.billNo}`}" style="border-bottom: 1px solid">{{ scope.row.billNo }}</router-link>
      </template>
      <template v-slot:table-orderNo="scope">
        <router-link
          v-if="(scope.row['bizType'] === 'B2B_RECEIVE' || scope.row['bizType'] === 'B2B_DISPATCH')"
          :to="{path: `/TradingPlatform/returnList/creditDetail/${scope.row.orderNo}`}"
          style="border-bottom: 1px solid">
          {{ scope.row.orderNo }}
        </router-link>
        <router-link
          v-else-if="(scope.row['bizType'] === 'ALLOCATE_RECEIVE' || scope.row['bizType'] === 'ALLOCATE_DISPATCH')"
          :to="{path: `/scm/detail/${scope.row.orderNo}`}"
          style="border-bottom: 1px solid">
          {{ scope.row.orderNo }}
        </router-link>
        <span v-else>{{ scope.row.orderNo }}</span>
      </template>
    </HtmlPage>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config } from '@base/module_ods/receive_order'
import { getCurrentTime } from '@/utils/globalFunction'
import { getMessage, getCustorm, getwarehouseList, getwarehouseType, ExportExcel } from '@/axios/module_ods/receive_order'
export default {
  name: 'ODSReceiveOrder',
  components: {
    HtmlPage
  },
  data() {
    return {
      config: config, // 页面配置
      MessageArr: []
    }
  },
  async created() {
    const params = ['dispatch_bill_status', 'dispatch_bill_biz_type', 'warehouse_type', 'receive_bill_status', 'receive_bil_biz_type']
    const res = await getMessage(params)
    this.MessageArr = res.data.data
    const StaArr = this.MessageArr.filter(item => item.typeCode === 'receive_bill_status')[0].dictCodes
    const Bizarr = this.MessageArr.filter(item => item.typeCode === 'receive_bil_biz_type')[0].dictCodes
    this.$set(this.config.searchBar[1], 'options', StaArr)
    this.$set(this.config.searchBar[5], 'options', Bizarr)
    // 获取客商信息
    const Cusres = await getCustorm()
    this.$set(this.config.searchBar[4], 'options', Cusres.data.data)
    const wareRes = await getwarehouseType()
    const arr = wareRes.data.data.map(item => {
      return item.dictCode
    })
    const str = arr.join(',')
    const wareListRes = await getwarehouseList('', str)
    const list = wareListRes.data.data.warehouseList
    this.$set(this.config.searchBar[2], 'AllList', list)
    this.$set(this.config.searchBar[3], 'AllList', list)
  },
  async mounted() {
    const arr = getCurrentTime()
    const params = {
      fromCreateTime: arr[0],
      toCreateTime: arr[1]
    }
    this.$refs.targetPage.getList(params)
    // 为店铺赋值
  },
  methods: {
    Send(billNo) {
      const params = {
        billNoList: [billNo]
      }
      ExportExcel(params)
    }
  }
}
</script>
