<template>
  <el-input :disabled="item.disabled" v-model="value" placeholder="请输入内容" @input="value=value.replace(/[^\d]/g,'')"/>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin]
}
</script>
