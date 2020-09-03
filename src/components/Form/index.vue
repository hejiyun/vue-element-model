<template>
  <el-form ref="form" :model="form" class="form-flex-Box" label-width="80px">
    <el-form-item v-for="(x, idx) in options" :label="x.label" :prop="x.prop" :key="idx">
      <component ref="formItem" :default-value="x.setDefaultValue" :is="x.cmp" @updateValue="updateValue($event, x.prop)"/>
    </el-form-item>
    <el-button size="mini" type="primary" @click="reset">重置</el-button>
    <el-button size="mini" type="primary" @click="submit">查询</el-button>
  </el-form>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
      }
    }
  },
  mounted() {
    // 设定默认参数选项回显
    this.setDefaultValue()
  },
  methods: {
    // 在控件值发生变化时, 更新父组件中对应的值
    updateValue(e, x) {
      this.form[x] = e
    },
    // 重置表单值属性
    reset() {
      this.$refs.formItem.forEach(item => {
        item.reset()
      })
    },
    submit() {
      console.log(this.form)
    },
    // 初始化同步设置默认值
    setDefaultValue() {
      this.options.forEach((item) => {
        if (this.form[item.prop] === undefined || this.form[item.prop] === null) {
          if (item.setDefaultValue) {
            this.form[item.prop] = item.setDefaultValue
          }
        }
      });
    }
  }
}
</script>

