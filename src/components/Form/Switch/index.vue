<template>
  <el-switch
    :disabled="item.disabled"
    v-model="value"/>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin]
}
</script>
