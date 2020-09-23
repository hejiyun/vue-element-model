<template>
  <div class="store-setting">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:search-btn>
        <el-button type="primary" @click="newAdd">新增</el-button>
      </template>
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="setting(scope.row)">配置</el-button>
      </template>
    </HtmlPage>
    <DialogContent
      ref="dcont"
      :biz-mode-list="bizModeList"
      :row="currentRow"
      :reshow="currentShow"
      :show-dialog.sync="showDialog"
      @DialogConfirm="DialogConfirm" />
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import DialogContent from './DialogContent'
import { config } from '@base/module_pos/store_pool_manage/setting'
import { getTypeCode, getSaleInfo, createdPool, updataPool, getPoolList } from '@/axios/module_pos/store_pool_manage/setting'
export default {
  name: 'StorePoolSetting',
  components: {
    HtmlPage,
    DialogContent
  },
  data() {
    return {
      config: config, // 页面配置
      bizModeList: [],
      currentShow: false,
      showDialog: false, // 控制弹窗变量
      currentRow: {}
    }
  },
  async created() {
    const resPool = await getPoolList()
    this.$set(this.config.searchBar[0], 'options', resPool.data.data)
    const params = {
      dictCodes: ['BIZ_MODE', 'AVAILABLE_STATUS']
    }
    const res = await getTypeCode(params)
    this.bizModeList = res.data.data.BIZ_MODE.dictItems
    this.$set(this.config.searchBar[2], 'options', res.data.data.BIZ_MODE.dictItems)
    this.$set(this.config.searchBar[3], 'options', res.data.data.AVAILABLE_STATUS.dictItems)
  },
  methods: {
    newAdd() {
      this.currentRow = {}
      this.currentShow = false
      this.showDialog = true
    },
    async setting(row) {
      // 获取店铺商品池配置信息
      const params = {
        poolCode: row.poolCode,
        pushType: 'AUTO'
      }
      const res = await getSaleInfo(params)
      // 将返回得到的四个数组添加进 TOData类型数组中即可
      this.currentRow = res.data.data
      this.currentShow = true
      this.showDialog = true
    },
    async DialogConfirm(form) {
      const arr = [...form.brandToData, ...form.CodeToData, ...form.NoToData]
      const TargetArr = []
      arr.forEach(e => {
        if (e.brandCode) {
          const item = {
            poolCode: form.poolCode,
            safeQty: e.safeQty,
            brandCode: e.brandCode,
            brandName: e.brandName
          }
          TargetArr.push(item)
        } else if (e.productNo && !e.barcode) {
          const item = {
            poolCode: form.poolCode,
            safeQty: e.safeQty,
            productNo: e.productNo
          }
          TargetArr.push(item)
        } else if (e.productNo && e.barcode) {
          const item = {
            poolCode: form.poolCode,
            safeQty: e.safeQty,
            productNo: e.productNo,
            barcode: e.barcode
          }
          TargetArr.push(item)
        }
      })
      if (form.dianpuNum) {
        TargetArr.push({
          poolCode: form.poolCode,
          safeQty: form.dianpuNum
        })
      }
      const DOWNArr = []
      form.xiaoshouToData.forEach(e => {
        e['poolCode'] = form.poolCode
        e['poolTargetType'] = e.poolType
        e.sourceretriveDisabled = e.sourceretriveDisabled ? '0' : '1'
        const item = {
          poolCode: e.poolCode,
          targetValue: e.targetValue,
          targetType: e.targetType,
          sourceretriveDisabled: e.sourceretriveDisabled,
          sourceretrivePriority: e.sourceretrivePriority
        }
        DOWNArr.push(item)
      })
      const params = {
        vendor: form.vendor,
        poolBase: {
          poolCode: form.poolCode,
          poolName: form.poolName,
          bizMode: form.bizMode,
          pushType: form.pushType ? 'AUTO' : 'DISABLE'
        },
        poolSafeConfigs: TargetArr,
        poolDownwardConfigs: DOWNArr
      }
      let str
      let res
      if (JSON.stringify(this.currentRow) === '{}') {
        res = await createdPool(params)
        str = '店铺商品池创建成功!'
      } else {
        res = await updataPool(params)
        str = '店铺商品池修改成功!'
      }
      if (res.data.code !== '0') {
        this.$message(res.data.msg)
      } else {
        this.$message(str)
        this.showDialog = false
        this.$refs.targetPage.getList()
        // 清空
        this.$refs.dcont.reset()
      }
    }
  }
}
</script>
