<template>
  <div class="sale-setting">
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
import { config } from '@base/module_pos/sale_pool_manage/setting'
import { getTypeCode, PoolInfo, createdPool, updataPool, getPoolList } from '@/axios/module_pos/sale_pool_manage/setting'
export default {
  name: 'SalePoolSetting',
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
      dictCodes: ['AVAILABLE_STATUS', 'BIZ_MODE']
    }
    const res = await getTypeCode(params)
    this.bizModeList = res.data.data.BIZ_MODE.dictItems
    this.$set(this.config.searchBar[1], 'options', res.data.data.AVAILABLE_STATUS.dictItems)
  },
  methods: {
    newAdd() {
      this.currentRow = {}
      this.currentShow = false
      this.showDialog = true
    },
    async setting(row) {
      // 获取销售商品池配置信息
      const params = {
        poolCode: row.poolCode,
        pushType: 'AUTO'
      }
      const res = await PoolInfo(params)
      // 将返回得到的四个数组添加进 TOData类型数组中即可
      this.currentRow = res.data.data
      this.currentShow = true
      this.showDialog = true
    },
    async DialogConfirm(form) {
      const TargetArr = []
      form.dianpuToData.map(e => {
        const item = {
          poolCode: form.poolCode,
          targetType: 'STORE_POOL',
          targetValue: e.targetValue,
          spreadDisabled: e.spreadDisabled ? '0' : '1',
          spreadType: 'PERCENT',
          spreadValue: e.spreadValue
        }
        TargetArr.push(item)
      })
      const QuTargetArr = []
      form.qudaoToData.map(e => {
        const item = {
          poolCode: form.poolCode,
          targetType: 'CHANNEL_POOL',
          targetValue: e.targetValue,
          sourceretriveDisabled: e.sourceretriveDisabled ? '0' : '1',
          sourceretrivePriority: e.sourceretrivePriority,
          offlineDisabled: e.offlineDisabled ? '0' : '1'
        }
        QuTargetArr.push(item)
      })
      const params = {
        poolBase: {
          poolCode: form.poolCode,
          poolName: form.poolName,
          bizMode: form.bizMode,
          shareMode: form.shareMode ? '0' : '1'
        },
        poolUpwardConfigs: TargetArr,
        poolDownwardConfigs: QuTargetArr
      }
      let str
      let res
      if (JSON.stringify(this.currentRow) === '{}') {
        res = await createdPool(params)
        str = '销售商品池创建成功!'
      } else {
        res = await updataPool(params)
        str = '销售商品池修改成功!'
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
