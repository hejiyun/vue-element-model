<template>
  <el-dialog
    :visible="dialogVisible==2?true:false"
    title="编辑"
    @open="mopen"
    @close="closeDialog()">
    <el-form :model="form">
      <el-form-item :required="true">
        <el-input v-model="form.feedback" :maxlength="50"/>
      </el-form-item>
      <el-form-item>
        <p>可输入50个字</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ApiConfig from '../goodsCommon/api.js'
export default {
  props: {
    dialogVisible: {
      type: Number,
      default: 0
    },
    dialogdata: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        feedback: '' // 描述
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    mopen(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
      this.form.feedback = ''
    },
    closeDialog() {
      this.$emit('EventDialog', 0, 0)
    },
    async submit() {
      if (!this.form.feedback) {
        return
      }
      let res
      try {
        res = await ApiConfig.warnConfig(Object.assign(this.form, { id: this.dialogdata.id }))
        this.$emit('EventDialog', 0, 1)
      } catch (error) {
        console.log(error)
        this.$emit('EventDialog', 0, 0)
      }
      console.log(res, 999)
    }
  }}
</script>
