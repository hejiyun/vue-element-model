<template>
  <div class="SeachItem">
    <Form @EventType="searchBtn(arguments)"/>
    <ImporDialog :dialog-visible="dialogVisible" @EventDialog="DialogEvent"/>
    <WatchDialog :dialog-visible="dialogVisible" @EventDialog="DialogEvent"/>
    <ResultDialog :dialog-visible="dialogVisible" @EventDialog="DialogEvent"/>
  </div>
</template>
<script>
import Form from './form.vue'
import ImporDialog from './importDialog.vue'
import WatchDialog from './watchDialog.vue'
import ResultDialog from './resultDialog.vue'
export default {
  components: { Form, ImporDialog, WatchDialog, ResultDialog },
  data() {
    return {
      dialogVisible: 0
    }
  },

  methods: {
    searchBtn(arg) {
      const mtype = arg[0]// 按钮类型 1.查询 2.导出，3.数据导入 4.全局价格监控
      // const mData = arg[1]// 按钮传递值
      switch (mtype) {
        case 1:
          console.log(11)
          break
        case 2:

          break
        case 3:
          this.dialogVisible = 1
          break
        case 4:
          this.dialogVisible = 2
          break

        default:
          break
      }
    },
    DialogEvent(data) {
      console.log(data, 999)
      this.dialogVisible = data
    }
  }
}
</script>
