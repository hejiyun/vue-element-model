<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="数据导入日志" name="first"/>
    <el-tab-pane label="监控设置日志" name="second"/>
    <el-tab-pane label="预警操作日志" name="third"/>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.$emit('tabclick', tab.name)
      console.log(tab, event, 1111122)
    }
  }
}
</script>
