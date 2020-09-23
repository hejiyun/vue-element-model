<template>
  <el-select
    :disabled="item.disabled"
    :multiple="item.multiple"
    v-model="value"
    :loading="loading"
    :remote-method="remoteMethod"
    :placeholder="item.placeholder||'全部'"
    :filterable="item.filterable"
    remote
    reserve-keyword
    collapse-tags
    clearable
  >
    <el-option :disabled="true" value="选项0" style="300px">
      <el-col v-for="(e, index) in (item.optionHeader ? item.optionHeader : ['代码', '名称'])" :span="item.HeaderWidth || 12" :key="index" class="hide-over">
        <span>{{ e }}</span>
      </el-col>
    </el-option>
    <el-option
      v-for="(e, index) in list"
      :label="e.label || e[item.mapping[1]]"
      :value="e.value || e[item.mapping[0]]"
      :key="index">
      <el-col v-for="(Field, index) in (item.mapping && item.mapping.length ? item.mapping : ['value', 'label'])" :span="item.HeaderWidth || 12" :key="index" class="hide-over">
        <el-tooltip :content="e[Field]" class="item" effect="light" placement="top">
          <span>{{ e[Field] }}</span>
        </el-tooltip>
      </el-col>
    </el-option>
  </el-select>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin],
  data() {
    return {
      allList: [],
      loading: false,
      list: []
    }
  },
  watch: {
    value(v, o) {
      this.$emit('updateValue', v)
    },
    'item.options': {
      handler(v, o) {
        this.allList = v
        const arr = JSON.parse(JSON.stringify(v))
        this.list = arr
      },
      immediate: true
    }
  },
  methods: {
    remoteMethod(query) {
      if (query.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.list = this.allList.filter(e => {
            if (this.item.mapping && this.item.mapping.length) {
              if (e[this.item.mapping[1]].toLowerCase().indexOf(query.toLowerCase()) > -1 || e[this.item.mapping[0]].toLowerCase().indexOf(query.toLowerCase()) > -1) {
                return e
              }
            } else {
              if (e.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || e.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                return e
              }
            }
          })
        }, 200)
      } else {
        this.list = this.allList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.hide-over {
  display:inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden
}
</style>
