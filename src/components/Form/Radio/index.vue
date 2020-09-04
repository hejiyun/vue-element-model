<template>
  <el-radio-group v-model="value">
    <el-radio v-for="(item, index) in item.list" :disabled="item.disabled" :key="index" :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin]
}
</script>
