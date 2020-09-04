<template>
  <el-date-picker
    :disabled="item.disabled"
    v-model="value"
    :picker-options="pickerOptions"
    :default-time="['00:00:00', '23:59:59']"
    :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
    style="width:100%"
    type="datetimerange"/>
</template>
<script>
import allFormItemMixin from '@component/Form/allFormItemMixin'
export default {
  mixins: [allFormItemMixin],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近三小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  }
}
</script>
