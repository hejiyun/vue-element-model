<template>
  <el-select
    :disabled="item.disabled"
    :multiple="item.multiple"
    v-model="value"
    :placeholder="item.placeholder||'全部'"
    :filterable="item.filterable"
    collapse-tags
    clearable
    @change="item.multiple ? selectAll($event, item.options, item.prop) : function(){}"
  >
    <el-option v-show="item.multiple && item.options.length > 0" label="全部" value="选项0"/>
    <el-option
      v-for="(e, index) in item.options"
      :label="e.label"
      :value="e.value"
      :key="index"/>
  </el-select>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin],
  watch: {
    value(v, o) {
      let Arr = JSON.parse(JSON.stringify(v))
      if (Array.isArray(Arr)) {
        Arr = Arr.filter(item => item !== '选项0')
      }
      this.$emit('updateValue', Arr)
    }
  },
  methods: {
    // Select多选下拉实现全选功能
    selectAll(val, options, name) {
      if (!options.oldOptions) {
        options['oldOptions'] = ['选项0']
      }
      const allValues = ['选项0']
      // 保留所有值
      for (const item of options) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = options.oldOptions.length === 1 ? [] : options.oldOptions[1]
      // 若是全部选择
      if (val.includes('选项0')) this.value = allValues
      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('选项0') && !val.includes('选项0')) this.value = []
      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('选项0') && val.includes('选项0')) {
        const index = val.indexOf('选项0')
        val.splice(index, 1) // 排除全选选项
        this.value = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('选项0') && !val.includes('选项0')) {
        if (val.length === allValues.length - 1) {
          this.value = ['选项0'].concat(val)
        }
      }
      // 储存当前最后的结果 作为下次的老数据
      options.oldOptions[1] = this.value
    }
  }
}
</script>
