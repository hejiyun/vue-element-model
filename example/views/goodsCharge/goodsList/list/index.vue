<template>
  <div class="GoodsChargeList">
    <!-- 搜索框 -->
    <Form :form="form" :selectData="SelectData" @EventType="searchBtn(arguments)" />
    <!-- 导入弹框 -->
    <ImporDialog :dialog-visible="dialogVisible" @EventDialog="DialogEvent(arguments)" />
    <!-- 监听弹框 -->
    <WatchDialog
      :watchform="watchform"
      :dialog-visible="dialogVisible"
      @EventDialog="DialogEvent(arguments)"
    />
    <!-- 结果弹框 -->
    <ResultDialog :dialog-visible="dialogVisible" :resultmsg="resultmsg" @EventDialog="DialogEvent(arguments)" />
    <!-- 列表 -->
    <Table :tableObj="tableObj" @cellClick="cellClick(arguments)" />
    <!-- 分页器 -->
    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="form.page_num"
      :limit.sync="form.page_size"
      @pagination="getList"
    />
    <!-- cell点击dialog弹窗 -->
  </div>
</template>
<script>
import { goodsListTableConfig } from '../../goodsCommon/goodsConfig.js'
import Table from '../../common/table.vue'
import Pagination from './../../common/Pagination.vue'
import Form from './form.vue'
import ImporDialog from './importDialog.vue'
import WatchDialog from './watchDialog.vue'
import ResultDialog from './resultDialog.vue'
import ApiConfig from '../../goodsCommon/api.js'
import { downloadFunPost } from '../../goodsCommon/tool.js'
import { fetchSelectOptions } from '@/api/goods'
export default {
  name: 'GoodsChargeList',
  components: {
    Pagination,
    WatchDialog,
    Table,
    ImporDialog,
    ResultDialog,
    Form },
  data() {
    return {
      tableObj: {// 表格数据
        dataList: goodsListTableConfig.dataList,
        labelArr: goodsListTableConfig.labelArr,
        selection: false
      },
      form: {
        hk_product_code: '', // 恒康货号
        short_name: '', // 货品简称
        listing_date_start: '', // 上市开始日期
        listing_date_end: '', // 上市结束日期
        listingdate: '', // 上市日期
        brand_key: '', // 品牌
        develop_season_key: '', // 季节
        sex_key: '', // 性别
        is_monitor: false, // 控制变量
        is_monitor_setting: false, // 单品设置监控 'N'未设置，'Y'已设置
        page_num: 1, // 默认页码
        page_size: 50 // 默认每页结果数,
      }, // form搜索
      SelectData: null, // 下拉框的所有数据
      total: 0, // 数据总条数
      loading: false, // loading加载
      dialogVisible: 0, // 0关闭 1导入 2监听 3：导入成功 4 导入失败 弹窗控制
      watchform: {
        biz_type: 'MONITOR', // 业务类型：monitor监控设置
        hk_product_code: '', // 恒康货号,-1为全局监控配置
        monitor_flag: 'N', // Y开启，N关闭
        monitor_threshold: '', // 阈值
        monitor_threshold_upgrade: '' // 阈值升级
      },
      resultmsg: '' // 提交结果信息
    }
  },
  created() {
    this.getList()
    this.getSelect()
  },
  mounted() {
  },
  beforeDestroy() {
    this.form = null
    this.tableObj = null
  },
  methods: {
    async getList() {
      this.loading = true
      let res
      try {
        this.form.is_monitor_setting = this.form.is_monitor ? 'Y' : 'N'
        res = await ApiConfig.manage(this.form)
        this.loading = false
        if (res && res.data.code === '0') {
          this.tableObj.dataList = res.data.data.list
          if (this.tableObj.dataList.length) {
            this.tableObj.dataList.forEach((item, index) => {
              item.guide_price_ratio = item.guide_price_ratio + '%'
            })
          }
          this.form.page_num = res.data.data.current
          this.total = res.data.data.total
        }
        console.log(this.tableObj, 666)
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
    getSelect() {
      fetchSelectOptions().then(res => {
        this.SelectData = res.data.data
        console.log(this.SelectData, 6789)
      })
    },
    searchBtn(arg) {
      const that = this
      const mtype = arg[0]// 按钮类型 1.查询 2.导出，3.数据导入 4.全局价格监控
      const mData = arg[1]// 按钮传递值
      switch (mtype) {
        case 1:
          // 搜索
          this.form = Object.assign(this.form, mData)
          this.getList()
          console.log(11)
          break
        case 2:
          // 导出
          console.log(2222, 1111)
          downloadFunPost(ApiConfig.export, this.form)
          break
        case 3:
          // 数据导入
          this.dialogVisible = 2
          break
        case 4:
          // 全局价格监控
          that.watchform.hk_product_code = '-1'
          that.dialogVisible = 4
          console.log(that.watchform, 33333)
          ApiConfig.lookConfig({
            biz_type: 'MONITOR',
            hk_product_code: that.watchform.hk_product_code
          }).then(res => {
            console.log(res, 7777777)
            if (res && res.data.code === '0') {
              that.watchform.monitor_flag = res.data.data.monitor_flag
              that.watchform.monitor_threshold = res.data.data.monitor_threshold
              that.watchform.monitor_threshold_upgrade = res.data.data.monitor_threshold_upgrade
            }
          })
          break

        default:
          break
      }
    },
    DialogEvent(arg) {
      console.log(arg, 999)
      const data = arg[1]
      const type = arg[0]
      switch (type) {
        case 0:
          this.dialogVisible = type
          break
        case 1:
          this.dialogVisible = type
          break
        case 2:
          this.dialogVisible = type
          break
        case 5:
          this.dialogVisible = type
          this.resultmsg = data
          break
        case 6:
          this.dialogVisible = type
          this.resultmsg = data
          break
        default:
          break
      }
    },
    cellClick(arg) {
      const that = this
      console.log(arg, __filename)
      const data = arg[0]
      const type = arg[1]
      switch (type) {
        case 'cellType4':
          console.log(data, 1111)
          this.$router.push({ path: '/GoodsCharge/detail', query: { id: encodeURIComponent(data.hk_product_code) }})
          break
        case 'cellType5':
          this.dialogVisible = 4
          this.watchform.hk_product_code = data.hk_product_code
          console.log(data, 1111)
          ApiConfig.lookConfig({
            biz_type: 'MONITOR',
            hk_product_code: that.watchform.hk_product_code
          }).then(res => {
            console.log(res, 7777777)
            if (res && res.data.code === '0') {
              that.watchform.monitor_flag = res.data.data.monitor_flag
              that.watchform.monitor_threshold = res.data.data.monitor_threshold
              that.watchform.monitor_threshold_upgrade = res.data.data.monitor_threshold_upgrade
            }
          })
          break

        default:
          break
      }
    }
  }
}
</script>
