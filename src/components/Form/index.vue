<template>
  <el-form ref="SearchRuleForm" :inline="true" :model="form" class="form-flex-Box" label-width="100px">
    <el-form-item v-for="(x, idx) in options" :label="x.label" :prop="x.prop" :rules="x.rules" :key="idx">
      <component v-if="!x.operate" ref="formItem" :item="x" :is="x.cmp" @updateValue="updateValue($event, x)"/>
      <slot v-else :params="form" :name="x.prop"/>
    </el-form-item>
    <el-button size="mini" type="primary" @click="submit">查询</el-button>
    <el-button size="mini" type="primary" @click="reset">重置</el-button>
    <slot :params="form" name="btn"/>
  </el-form>
</template>
<script>
export default {
  name: 'DynamicForm',
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
      if (x['splitKey'] && x['splitKey'].length) {
        if (e) {
          this.$set(this.form, x.splitKey[0], e[0])
          this.$set(this.form, x.splitKey[1], e[1])
          delete this.form[x.prop]
        } else {
          delete this.form[x.splitKey[0]]
          delete this.form[x.splitKey[1]]
        }
      } else {
        this.$set(this.form, x.prop, typeof e === 'string' ? e.trim() : e)
      }
    },
    // 重置表单值属性
    reset() {
      this.$refs['SearchRuleForm'].resetFields()
      this.$refs.formItem.forEach(item => {
        item.reset()
      })
    },
    submit() {
      this.$refs['SearchRuleForm'].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          for (const k in params) {
            if (!params[k] || params[k].length === 0) {
              delete params[k]
            }
          }
          console.log(params)
          this.$emit('search', params)
        } else {
          return false
        }
      })
    },
    // 初始化同步设置默认值
    setDefaultValue() {
      this.options.forEach((item) => {
        if (this.form[item.prop] === undefined || this.form[item.prop] === null) {
          if (item.setDefaultValue) {
            this.form[item.prop] = item.setDefaultValue
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.form-flex-Box {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    height: 30px !important;
    margin-bottom: 3px;
  }
  .el-input__inner, label, input {
    width: 150px;
    height: 30px !important;
  }
  .el-date-editor--datetimerange {
    input {
      width: 80px;
      height: 28px !important;
    }
    i, span {
      line-height: 23px;
    }
  }
  .el-button {
    height: 30px;
    margin-top: 6px;
    margin-left: 10px;
    padding: 7px 15px
  }
 .el-form-item__content {
   text-align: left;
   height: 30px;
 }
}
</style>

