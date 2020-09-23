<template>
  <el-input :disabled="item.disabled" v-model="value" type="textarea"/>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin]
}
</script>
