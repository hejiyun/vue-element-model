<template>
  <div class="GoodsChargeWarning">
    <!-- 搜索框 -->
    <Form :form="form" @EventType="searchBtn(arguments)"/>
    <!-- 弹窗 -->
    <EditDialog :dialog-visible="dialogVisible" :dialogdata="dialogdata" @EventDialog="DialogEvent(arguments)"/>
    <!-- 列表 -->
    <Table :tableObj="tableObj" @cellClick="cellClick(arguments)"/>
    <!-- 分页器 -->
    <Pagination v-show="total>0" :total="total" :page.sync="form.page_num" :limit.sync="form.page_size" @pagination="getList" />
  </div>
</template>
<script>
import Table from './../common/table.vue'
import Pagination from './../common/Pagination.vue'
import Form from './form.vue'
import EditDialog from './editDialog.vue'
import { goodsWarningTableConfig } from '../goodsCommon/goodsConfig.js'
import ApiConfig from '../goodsCommon/api.js'
export default {
  name: 'GoodsChargeWarning',
  components: { Pagination, Table, Form, EditDialog },
  data() {
    return {
      form: {
        warn_book_no: '', // 平台订单
        shop_code: '', // 所属店铺-code
        warn_hk_product_code: '', // 恒康货号
        create_time_start: '', // 预警开始时间
        create_time_end: '', // 预警结束时间
        creat_time: '', // 过度处理时间
        page_num: 1, // 页码，默认为1
        page_size: 50 // 每页大小，默认为50
      },
      tableObj: {
        dataList: goodsWarningTableConfig.dataList,
        labelArr: goodsWarningTableConfig.labelArr,
        selection: false
      },
      total: 0, // 总条数
      dialogdata: null, // 弹窗输入值
      dialogVisible: 0// 弹窗控制
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
    async getList() {
      let res
      try {
        res = await ApiConfig.warnInfo(this.form)
        if (res && res.data.code === '0') {
          this.tableObj.dataList = res.data.data.list
          if (this.tableObj.dataList.length) {
            this.tableObj.dataList.forEach((item, index) => {
              item.discount_diff = item.discount_diff + '%'
            })
          }
          this.total = res.data.data.total
        } else {
          console.log(res, 88888)
        }
      } catch (error) {
        console.log(error, 555)
      }
    },
    cellClick(arg) {
      const data = arg[0]
      const type = arg[1]
      console.log(arg, 1111)

      switch (type) {
        case 'cellType1':
          this.dialogVisible = 2
          this.dialogdata = data
          break
        case 'cellType6':
          this.$router.push({ path: '/OMS/OrderDetail/' + encodeURIComponent(data.warn_book_no) })
          break

        default:
          break
      }
    },
    DialogEvent(arg) {
      this.dialogVisible = 0
      const mtype = arg[0]// 按钮类型 1.查询 2.导出，3.数据导入 4.全局价格监控
      const mData = arg[1]// 按钮传递值

      if (mData) {
        this.getList()
      }

      console.log(2222, mtype)
    },
    searchBtn(arg) {
      const mtype = arg[0]// 按钮类型 1.查询 2.重置
      const mData = arg[1]// 按钮传递值
      console.log(arg, 1111)

      switch (mtype) {
        case 1:
          // 搜索
          this.form = Object.assign(this.form, mData)
          this.getList()
          console.log(11)
          break
        case 2:
          // 重置
          this.form = {
            warn_book_no: '', // 平台订单
            shop_code: '', // 所属店铺-code
            warn_hk_product_code: '', // 恒康货号
            create_time_start: '', // 预警开始时间
            create_time_end: '', // 预警结束时间
            creat_time: '', // 过度处理时间
            page_num: 1, // 页码，默认为1
            page_size: 50 // 每页大小，默认为50
          }
          break
        case 3:
          this.dialogVisible = 1
          break
        case 4:
          this.watchform.hk_product_code = '-1'
          this.dialogVisible = 2
          break

        default:
          break
      }
    }
  }
}
</script>
