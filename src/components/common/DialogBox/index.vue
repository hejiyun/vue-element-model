<template>
  <div class="dialog-box">
    <!-- 弹窗 -->
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeClose"
      :width="`${Config.WidthPercent}%`"
      :title="Config.dialogText"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @open="open"
      center
      @close="handleClose">
      <el-form ref="dialogBoxForm" :model="form" class="dialog-bar" label-width="80px">
        <el-form-item v-for="(x, idx) in Config.options" :label="x.label" :prop="x.prop" :rules="x.rules" :key="idx">
          <component v-if="!x.operate" ref="dialogFormItem" :item="x" :is="x.cmp" @updateValue="updateValue($event, x.prop)"/>
          <slot v-else :params="x" :name="x.prop"/>
        </el-form-item>
      </el-form>
      <span v-if="Config.hasFooter" slot="footer" class="dialog-footer">
        <el-button v-if="Config.confirmText" type="primary" @click="DialogConfirm">{{ Config.confirmText }}</el-button>
        <el-button v-if="Config.cancelText" type="primary" @click="reset">{{ Config.cancelText }}</el-button>
        <slot :params="form" name="btn"/>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'DialogBox',
  props: {
    DialogConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data: function() { // 初始化数据
    return {
      form: {},
      dialogVisible: this.showDialog
    }
  },
  computed: {
    Config() {
      return Object.assign({
        options: [],
        cancelText: '取消',
        confirmText: '提交',
        widthPercent: 30,
        dialogText: '',
        hasFooter: true
      }, this.DialogConfig)
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  methods: { // 方法
    // 在控件值发生变化时, 更新父组件中对应的值
    updateValue(e, prop) {
      this.$set(this.form, prop, typeof e === 'string' ? e.trim() : e)
    },
    // 初始化同步设置默认值
    setDefaultValue() {
      // 在页面渲染完成之后,使用ref获取元素节点, 避免元素未渲染报错
      this.$nextTick(() => {
        const arr = this.$refs.dialogFormItem
        this.Config.options.forEach((item, index) => {
          if (!this.form[item.prop] || !this.form[item.prop].length) {
            if (item.setDefaultValue) {
              // 因为各子组件使用value与form无model双向绑定关系, 所以需要在更新form值时,同步更新子组件value值
              this.form[item.prop] = item.setDefaultValue
              arr[index].value = item.setDefaultValue
            }
          }
        });
      })
    },
    reset() {
      this.dialogVisible = false
      this.$refs['dialogBoxForm'].resetFields()
      // 重置时, 调取各子组件本身reset方法
      this.$refs.dialogFormItem && this.$refs.dialogFormItem.forEach(item => {
        item.reset()
      })
    },
    handleBeforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.reset()
          done()
        })
        .catch(_ => {})
    },
    handleClose(done) {
      this.$emit('update:showDialog', false)
    },
    open() {
      this.setDefaultValue()
    },
    // 点击查询调用函数
    DialogConfirm() {
       this.$refs['dialogBoxForm'].validate((valid) => {
          if (valid) {
            this.$emit('DialogConfirm', this.form)
          } else {
            return false;
          }
        });
      
    }
  }
}
</script>
<style lang="scss">
.dialog-box {
  display:inline-block;
  .dialog-bar {
    padding-right: 10px;
    background: #FFFFFF;
  }
}
</style>
