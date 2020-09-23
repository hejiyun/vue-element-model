<template>
  <el-dialog
    :visible="dialogVisible>=5?true:false"
    :show-close="false"
    :title="dialogVisible==6?'提交失败':'提交成功'"
    width="40%">
    <span>{{ resultmsg }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Number,
      default: 0
    },
    resultmsg: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
    }
  },
  methods: {
    close() {
      this.$emit('EventDialog', 0, 0)
    }
  }
}
</script>
