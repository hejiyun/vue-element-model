<template>
  <div style="margin: 20px; border: 1px solid #ccc">
    <el-form ref="form" label-width="120px">
      <el-form-item label="批量导入模板:">
        <el-button type="text" @click="exportExcel">门店JITX选货.xlsx</el-button>
      </el-form-item>
      <el-form-item label="上传文件:">
        <uploadCommon
          ref="fileUp"
          file-name="file"
          file-type="file"
          @remove="removeFile"
          @success="appendFile"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import uploadCommon from './upload'
export default {
  name: 'SaleSettingExport',
  components: {
    uploadCommon
  },
  data() {
    return {
      formData: new FormData()
    }
  },
  beforeDestroy() {
  },
  methods: {
    exportExcel() {
      this.$axios({
        method: 'get',
        url: '/bff/common/no_route/api/v1/template/r/download?templateId=PDC_CHOSEN_PRODUCT_IMPORT',
        responseType: 'blob'
      }).then(res => {
        if (res.data.code) {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
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
    },
    // 获取上传的文件信息
    appendFile(formData) {
      this.formData.set('file', formData.get('file'))
    },
    removeFile(formData) {
      this.formData.delete('file')
    },
    submitForm() {
      if (!this.formData.get('file')) {
        return
      }
      this.$axios({
        method: 'post',
        url: '/bff/pdc_no_route/api/v1/chosenProduct/w/import',
        timeout: 60000,
        data: this.formData
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: 'success',
          duration: 1000
        })
      })
    }
  }
}
</script>
