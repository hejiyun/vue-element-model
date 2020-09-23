<template>
  <el-form ref="SearchRuleForm" :inline="true" :model="form" class="form-flex-Box" label-width="100px">
    <el-form-item v-for="(x, idx) in searchOptions" :label="x.label" :prop="x.prop" :rules="x.rules" :key="idx">
      <component v-if="!x.operate" ref="formItem" :item="x" :is="x.cmp" @updateValue="updateValue($event, x)"/>
    </el-form-item>
    <el-button size="mini" type="primary" @click="submit">查询</el-button>
    <el-button size="mini" type="primary" @click="reset">重置</el-button>
    <el-button size="mini" type="primary" @click="exportExcel">导出</el-button>
  </el-form>
</template>
<script>
import { searchOptions } from '@base/module_oms/transaction_order'
import { getOmsSearchType, getCustorm, ExportExcel } from '@/axios/module_oms/transaction_order'
import { getCurrentTime } from '@/utils/globalFunction'
export default {
  data() {
    return {
      searchOptions: searchOptions,
      form: {}
    }
  },
  async created() {
    // 获取用户信息
    const res1 = await getCustorm()
    this.$set(this.searchOptions[8], 'options', res1.data.data)
    // 客商信息全部数据源
    this.optionsCopy = res1.data.data
    // 获取搜索类型
    const res = await getOmsSearchType()
    const lest = res.data.data
    // 更改数据格式以适应下拉框
    this.$set(this.searchOptions[3], 'options', lest.bizType)
    this.$set(this.searchOptions[4], 'options', lest.orderType)
    this.$set(this.searchOptions[5], 'options', lest.orderStatus)
    this.$set(this.searchOptions[9], 'options', lest.orderSourceCode || [])
  },
  async mounted() {
    const arr = getCurrentTime()
    const params = {
      orderTransactTimeStart: arr[0],
      orderTransactTimeEnd: arr[1]
    }
    this.$emit('search', params)
    // 为店铺赋值
  },
  methods: {
    updateValue(e, x) {
      if (x['splitKey'] && x['splitKey'].length) {
        if (e) {
          this.$set(this.form, x.splitKey[0], e[0])
          this.$set(this.form, x.splitKey[1], e[1])
          delete this.form[x.prop]
        } else {
          delete this.form[x.splitKey[0]]
          delete this.form[x.splitKey[1]]
        }
      } else {
        this.$set(this.form, x.prop, typeof e === 'string' ? e.trim() : e)
      }
    },
    exportExcel() {
      ExportExcel(this.form)
    },
    // 重置表单值属性
    reset() {
      this.$refs['SearchRuleForm'].resetFields()
      this.$refs.formItem.forEach(item => {
        item.reset()
      })
    },
    submit() {
      this.$refs['SearchRuleForm'].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          for (const k in params) {
            if (!params[k] || params[k].length === 0) {
              delete params[k]
            }
          }
          this.$emit('search', params)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.form-flex-Box {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    height: 30px !important;
    margin-bottom: 3px;
  }
  .el-input__inner, label, input {
    width: 150px;
    height: 30px !important;
  }
  .el-date-editor--datetimerange {
    input {
      width: 80px;
      height: 28px !important;
    }
    i, span {
      line-height: 23px;
    }
  }
  .el-button {
    height: 30px;
    margin-top: 6px;
    margin-left: 10px;
    padding: 7px 15px
  }
 .el-form-item__content {
   text-align: left;
   height: 30px;
 }
}
</style>
