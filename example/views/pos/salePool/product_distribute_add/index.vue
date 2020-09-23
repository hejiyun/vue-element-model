<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="调入商品池">
        <HeadSelect ref="enterRoleSelectC" :item="searchOptions[0]" @updateValue="updateValue($event, searchOptions[0].prop, 1)"/>
      </el-form-item>
      <el-form-item label="调出商品池">
        <HeadSelect ref="enterRoleSelectC" :item="searchOptions[1]" @updateValue="updateValue($event, searchOptions[1].prop, 0)"/>
      </el-form-item>
    </el-form>
    <span v-show="showTips" style="color:red; margin-left:34px">*您选择的商品池无对应可分货调入/调出仓, 请重新选择*</span>
    <!-- 表格 -->
    <Table :getParams="getParams"/>
  </div>
</template>
<script>
import Table from './Table'
import { HeadSelect } from '@component/Form/ExportItem.js'
import { searchOptions } from '@base/module_pos/sale_pool_manage/product_distribute_add'
import { getWareHouseList } from '@/axios/module_pos/sale_pool_manage/product_distribute_add'
export default {
  name: 'SalePoolProductDistributeAdd',
  components: {
    Table,
    HeadSelect
  },
  data() {
    return {
      searchOptions: searchOptions,
      form: {},
      showTips: false,
      allList: []
    }
  },
  async created() {
    const res2 = await getWareHouseList({})
    this.$set(this.searchOptions[0], 'options', res2.data.data)
    this.$set(this.searchOptions[1], 'options', res2.data.data)
    this.allList = res2.data.data
    console.log(this.allList)
  },
  methods: {
    updateValue(event, name, index) {
      this.form[name] = event
      const str = name === 'sourceCode' ? 'destCode' : 'sourceCode'
      // 在这里判断, 如果当前值为空, 那么当前的list应该为allList,
      if (!event && !this.form[str]) {
        this.$set(this.searchOptions[0], 'options', this.allList)
        this.$set(this.searchOptions[1], 'options', this.allList)
        this.showTips = false
        return
      }
      if (event === this.form[str]) {
        this.$message.error('调入仓与调出仓不能相同')
        this.form[name] = ''
        return
      }
      if (event && !this.form[str]) {
        const FileList = []
        // 先选出当前项的downwardRelatedPoolCodes
        const target = this.allList.filter(e => e.poolCode === event)[0]
        const qudaoList = target.downwardRelatedPoolCodes
        if (target.downwardRelatedPoolCodes.length) {
          this.allList.forEach(e => {
            for (let index = 0; index < qudaoList.length; index++) {
              const element = qudaoList[index]
              const arr = e.downwardRelatedPoolCodes.filter(item => item === element)
              if (arr.length) {
                if (target.poolCode !== e.poolCode) {
                  FileList.push(e)
                  continue
                }
              }
            }
          })
        }
        this.$set(this.searchOptions[index], 'options', FileList)
        if (!FileList.length) {
          this.showTips = true
        }
      }
      // 如果这个不为空, 那么 另一个的集合要换成对应的filterlist, 如果filterList为空, 则提示
    },
    getParams() {
      return this.form
    }
  }
}
</script>

