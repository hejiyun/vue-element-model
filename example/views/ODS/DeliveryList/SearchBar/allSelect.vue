<template>
  <el-select
    :class="value1.length > 2 && xianshi ? 'changafter' : ''"
    v-model="value1"
    multiple
    style="width:100%"
    placeholder="全部"
    @change="selectAll($event, options)">
    <el-option label="全部" value="选项0"/>
    <el-option
      v-for="(item,index) in options"
      :key="index"
      :label="item.label"
      :value="item.value"/>
  </el-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: function() {
        return []
      }
    },
    name: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: null
    },
    isReset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value1: [],
      oldOptions: ['选项0'],
      xianshi: true
    }
  },
  watch: {
    value1: function(newVal) {
      if (newVal.length === (this.options.length + 1)) {
        const res = document.getElementsByClassName('el-select__tags')[this.index]
        const res1 = res.childNodes[1]
        res1.className = 'haohaoxuexi'
        this.xianshi = false
      } else {
        const res = document.getElementsByClassName('el-select__tags')[this.index]
        const res1 = res.childNodes[1]
        res1.className = ''
        this.xianshi = true
      }
      this.$emit('getNewVal', newVal, this.name)
    },
    isReset: function(newVal) {
      this.reset()
    }
  },
  mounted() {
    const re = document.getElementsByClassName('el-select__tags')
    for (let i = 0; i < re.length; i++) {
      if (i === 0 || i === 4) {
        re[i].style = 'max-height:30px;overflow:hidden'
      }
    }
  },
  methods: {
    // 多选下拉实现全选功能
    selectAll(val, options) {
      const allValues = ['选项0']
      // 保留所有值
      for (const item of options) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions[1]
      // 若是全部选择
      if (val.includes('选项0')) this.value1 = allValues
      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('选项0') && !val.includes('选项0')) this.value1 = []
      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('选项0') && val.includes('选项0')) {
        const index = val.indexOf('选项0')
        val.splice(index, 1) // 排除全选选项
        this.value1 = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('选项0') && !val.includes('选项0')) {
        if (val.length === allValues.length - 1) this.value1 = ['选项0'].concat(val)
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldOptions[1] = this.value1
      console.log(this.oldOptions)
    },
    reset() {
      this.value1 = ''
    }
  }
}
</script>
<style scoped>
  .changafter::after {
    content: '...';
    color: #000;
    position: absolute;
    left: 83%;
    top: 5px;
    z-index: 999
  }
  .el-input__inner {
    max-height: 40px;
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
    content: ''
  }
</style>
<style>
.haohaoxuexi > span {
  display: none
}
.haohaoxuexi > span:nth-child(1) {
  display: block
}
</style>
