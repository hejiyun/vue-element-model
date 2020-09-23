<template>
  <el-tree :data="item.data" :props="item.defaultProps"/>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin]
}
</script>
