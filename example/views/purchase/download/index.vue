<template>
  <div class="download">
    {{ downloadMsg }}
  </div>
</template>
<script>
import { getQueryString } from '@/utils/tool.js'
export default {
  data() {
    return {
      downloadMsg: '采购到货单下载'
    }
  },
  mounted() {
    console.log(this.downloadMsg, location.href, getQueryString('id'), 888)
    const that = this
    that.undisable = true
    const downUrl = '/bff/api/v1/purchase/arrive/detail/_export'
    this.$axios({
      method: 'get',
      url: downUrl,
      params: {
        billNo: getQueryString('id')
      },
      responseType: 'blob'
    }).then((res) => {
      that.undisable = false
      if (res.data.code) {
        this.$notify({
          title: '错误',
          message: res.data.msg,
          type: 'error',
          duration: 2000
        })
        return
      }
      const blob = new Blob([res.data], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      // 通过创建a标签实现
      const link = document.createElement('a')
      link.href = url
      // 对下载的文件命名
      link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '采购到货单明细.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log(res)
    })
  }
}
</script>
