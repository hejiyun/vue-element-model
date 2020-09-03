export default {
  props: {
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: this.defaultValue || ''
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
