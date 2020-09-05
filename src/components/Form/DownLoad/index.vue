<template>
  <el-button :type="Titem.btntype" @click="exportXls">{{ Titem.btnText }}</el-button>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    Titem() {
      return Object.assign({
        btntype: 'primary',
        btnText: '导出',
        method: 'get',
        url: '',
        timeout: 60000
      }, this.item)
    }
  },
  methods: {
    reset() {
      return false
    },
    // 点击批量导出模板按钮
    exportXls() {
      this.$axios({
        method: this.Titem.method,
        timeout: this.Titem.timeout,
        url: this.Titem.url,
        responseType: 'blob'
      }).then(res => {
        if (res.data.code) {
          this.$message.warning(`${res.data.msg}`)
          return
        }
        const blob = new Blob([res.data], { type: 'text/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  }
}
</script>
