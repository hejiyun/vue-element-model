<template>
  <el-checkbox :disabled="item.disabled" v-model="value"> {{ item.placeholder }}</el-checkbox>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin]
}
</script>
