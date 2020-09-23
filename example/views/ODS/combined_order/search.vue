<template>
  <el-form ref="SearchRuleForm" :model="form" class="form-flex-Box" label-width="100px">
    <el-form-item v-for="(x, idx) in searchOptions" :label="x.label" :prop="x.prop" :rules="x.rules" :key="idx">
      <component v-if="!x.operate" ref="formItem" :item="x" :is="x.cmp" @updateValue="updateValue($event, x)"/>
    </el-form-item>
    <span v-show="disabled" style="color:red; lineHeight: 30px"> *当前禁用项为无效搜索条件</span>
    <el-button size="mini" type="primary" @click="submit">查询</el-button>
    <el-button size="mini" type="primary" @click="reset">重置</el-button>
  </el-form>
</template>
<script>
import { searchOptions } from '@base/module_ods/combined_order'
import { getMessage, getwarehouseList, getwarehouseType } from '@/axios/module_ods/combined_order'
import { getCurrentTime } from '@/utils/globalFunction'
export default {
  data() {
    return {
      searchOptions: searchOptions,
      form: {},
      disabled: false
    }
  },
  async created() {
    const params = ['merge_dispatch_bill_status', 'dest_vip_warehouse_code']
    const res = await getMessage(params)
    this.MessageArr = res.data.data
    const StaArr = this.MessageArr.filter(item => item.typeCode === 'merge_dispatch_bill_status')[0].dictCodes
    const Bizarr = this.MessageArr.filter(item => item.typeCode === 'dest_vip_warehouse_code')[0].dictCodes
    this.$set(this.searchOptions[1], 'options', StaArr)
    this.$set(this.searchOptions[3], 'options', Bizarr)
    const wareRes = await getwarehouseType()
    const arr = wareRes.data.data.map(item => {
      return item.dictCode
    })
    const str = arr.join(',')
    const wareListRes = await getwarehouseList('', str)
    const list = wareListRes.data.data.warehouseList
    this.$set(this.searchOptions[2], 'AllList', list)
  },
  async mounted() {
    let params = {}
    if (sessionStorage.getItem('JITBillNo')) {
      const str = sessionStorage.getItem('JITBillNo')
      this.$set(this.searchOptions[6], 'setDefaultValue', str)
      params = {
        dispatchNo: sessionStorage.getItem('JITBillNo')
      }
      sessionStorage.removeItem('JITBillNo')
    } else {
      const arr = getCurrentTime()
      params = {
        fromCreateTime: arr[0],
        toCreateTime: arr[1]
      }
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
      // 判断是否是快递单号或者发货单号, 如果是, 则其他搜索项禁用
      if (e && (x.prop === 'dispatchNo' || x.prop === 'expressBillNo')) {
        this.searchOptions.forEach(item => {
          if (item.prop !== x.prop) {
            this.$set(item, 'disabled', true)
          }
        })
        this.disabled = true
      } else if (!e && !this.form['dispatchNo'] && !this.form['expressBillNo']) {
        this.searchOptions.forEach(item => {
          this.$set(item, 'disabled', false)
        })
        this.disabled = false
      }
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
          let params = JSON.parse(JSON.stringify(this.form))
          if (this.disabled) {
            params = {
              dispatchNo: this.form.dispatchNo,
              expressBillNo: this.form.expressBillNo
            }
          }
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
