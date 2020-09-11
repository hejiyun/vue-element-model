<template>
  <el-input :disabled="item.disabled" v-model="value" clearable placeholder="请输入内容"/>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin]
}
</script>
