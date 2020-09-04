// mixin中相同对象中的属性会合并起来, 方法同名会覆盖,
// 所以可以在mixin中写入需要被很多地方通用的结构
export default {
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      value: this.item.setDefaultValue || ''
    };
  },
  watch: {
    value(v, o) {
      this.$emit('updateValue', this.value)
    }
  },
  methods: {
    reset() {
      this.value = ''
    }
  }
};
