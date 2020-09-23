<template>
  <div class="GoodsChargeOption">
    <Taps @tabclick="tabclick"/>
    <Table v-show="tabType===1" :tableObj="tableObjImport" @cellClick="cellClick(arguments)" />
    <Table v-show="tabType===2" :tableObj="tableObjMonitor" @cellClick="cellClick(arguments)" />
    <Table v-show="tabType===3" :tableObj="tableObjWarn" @cellClick="cellClick(arguments)" />
    <Pagination
      v-show="currentParam.total>0"
      :total="currentParam.total"
      :page.sync="currentParam.page_num"
      :limit.sync="currentParam.page_size"
      @pagination="getList" />
  </div>
</template>
<script>
import Taps from './taps.vue'
import Pagination from '../common/Pagination.vue'
import ApiConfig from '../goodsCommon/api.js'
import Table from '../common/table.vue'
import {
  goodsOptionDataTableConfig,
  goodsOptionWarningTableConfig,
  goodsOptionWatchTableConfig
} from '../goodsCommon/goodsConfig.js'
import { downloadFun } from '../goodsCommon/tool.js'
export default {
  name: 'GoodsChargeOption',
  components: {
    Taps,
    Pagination,
    Table
  },
  data() {
    return {
      tabType: 1, // 切换tab,1:数据导入日志 2:监控设置日志 3:预警操作日志
      importParam: {
        biz_code: 'IMPORT',
        page_num: 0,
        page_size: 50 },
      monitorParam: {
        biz_code: 'MONITOR',
        page_num: 0,
        page_size: 50
      },
      warnParam: {
        biz_code: 'WARN',
        page_num: 0,
        page_size: 50
      },
      tableObjWarn: {
        dataList: goodsOptionDataTableConfig.dataList,
        LabelArr: goodsOptionDataTableConfig.labelArr,
        selection: false
      },
      tableObjImport: {
        dataList: goodsOptionDataTableConfig.dataList,
        LabelArr: goodsOptionDataTableConfig.labelArr,
        selection: false
      },
      tableObjMonitor: {
        dataList: goodsOptionDataTableConfig.dataList,
        LabelArr: goodsOptionDataTableConfig.labelArr,
        selection: false
      },
      currentParam: {
        biz_code: 'IMPORT',
        page_num: 0,
        page_size: 50,
        total: 0 } // 存储已下载的数据

    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    async getList() {
      let res
      try {
        switch (this.tabType) {
          case 1:
            this.currentParam = Object.assign(this.currentParam, this.importParam)
            res = await ApiConfig.operateLog(this.currentParam)
            this.tableObjImport = goodsOptionDataTableConfig
            if (res && res.data.code === '0') {
              this.tableObjImport.dataList = res.data.data.list
              if (this.tableObjImport.dataList.length) {
                this.tableObjImport.dataList.forEach((item, index) => {
                  item.import_count = item.import_validate + '/' + item.import_count
                })
              }
              this.importParam.page_num = res.data.data.current
              this.currentParam.total = res.data.data.total
            } else {
              console.log('error', 111)
            }
            break
          case 2:
            this.currentParam = Object.assign(this.currentParam, this.monitorParam)
            res = await ApiConfig.operateLog(this.currentParam)
            this.tableObjMonitor = goodsOptionWatchTableConfig
            if (res && res.data.code === '0') {
              this.tableObjMonitor.dataList = res.data.data.list
              if (this.tableObjMonitor.dataList.length) {
                this.tableObjMonitor.dataList.forEach((item, index) => {
                  // 触发阈值：0  升级阈值：5%
                  item.source_code = item.source_code === '-1' ? '全局监控' : item.source_code
                  item.monitor_threshold = '触发阈值：' + item.monitor_threshold + ' 升级阈值：' + item.monitor_threshold_upgrade
                })
              }
              this.monitorParam.page_num = res.data.data.current
              this.currentParam.total = res.data.data.total
            } else {
              console.log('error', 111)
            }
            break
          case 3:
            this.currentParam = Object.assign(this.currentParam, this.warnParam)
            res = await ApiConfig.operateLog(this.currentParam)
            this.tableObjWarn = goodsOptionWarningTableConfig
            if (res && res.data.code === '0') {
              this.tableObjWarn.dataList = res.data.data.list
              this.warnParam.page_num = res.data.data.current
              this.currentParam.total = res.data.data.total
            } else {
              console.log('error', 111)
            }
            break

          default:
            break
        }
      } catch (error) {
        console.log(error, 6666)
      }
    },
    tabclick(type) {
      switch (type) {
        case 'first':
          this.tabType = 1
          this.getList()
          break
        case 'second':
          this.tabType = 2
          this.getList()
          break
        case 'third':
          this.tabType = 3
          this.getList()
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
        case 'cellType1':
          console.log(data, type, that, 7777)
          downloadFun(data.import_url, {})
          break
        case 'cellType5':
          console.log(data, type, that, 7777)

          break
        case 'cellType6':
          console.log(data, type, that, 7777)

          break

        default:
          break
      }
    }
  }
}
</script>
