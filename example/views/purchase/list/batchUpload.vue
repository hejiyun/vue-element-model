<template>
  <!-- 列表页批量导入 -->
  <el-dialog v-loading="loading" :visible.sync="showDialog" :close-on-click-modal="false" width="66%" @close="handleClose">
    <el-row>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-button size="mini" icon="el-icon-folder-add" type="primary" @click="dialogVisible = true">导入采购到货清单</el-button>
        <el-dialog
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          title="导入采购到货清单"
          width="30%"
          append-to-body>
          <el-upload
            ref="uploadExcel"
            :limit="1"
            :visible.sync="dialogVisible"
            :before-upload="onBeforeUpload"
            :auto-upload="false"
            name="file"
            accept=".xls,.xlsx,.xlsm"
            class="upload-demo"
            action= "">
            <el-button size="mini" icon="el-icon-folder-add" type="primary">选取文件</el-button>
          </el-upload>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="dialogVisible = false">取消</el-button>
            <el-button v-preventReClick type="primary" size="mini" @click="uploadData">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-button v-preventReClick type="primary" icon="el-icon-download" size="mini" @click="downloadTable">导入模板下载</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="12" :xl="12">
        <el-button v-preventReClick type="primary" size="mini" @click="downloadSupplier">下载供应商代码及名称</el-button>
        <el-button v-preventReClick type="primary" size="mini" @click="downloadtransferMode">下载发运方式代码及名称</el-button>
        <el-button v-preventReClick type="primary" size="mini" @click="downloadWarehouseCode">下载仓库代码及名称</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12" :md="8" :lg="14" :xl="14" style="margin-top: 20px">
        <p>备注:</p>
        <p>1.一次只能上传一个excel文件，仅限格式xlsx、xls、xlsm；</p>
        <p>2.<span class="tips">带 * 的字段为必填项；</span></p>
        <p>3.<span class="tips">发运方式为货主转移，关联公司账套和来源单号是必填项。</span></p>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button v-preventReClick type="primary" size="mini" @click="submit">提交</el-button>
      <el-button size="mini" @click="showDialog = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    batchUploadVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: this.batchUploadVisible, // dialog显隐
      dialogVisible: false, // 导入文件弹框
      fileId: '', // 导入文件id
      formData: null, // 保存选择的文件
      discount: 0, // 控制刷新次数
      loading: false // 批量导入loading
    }
  },
  watch: {
    batchUploadVisible(val) {
      this.showDialog = val
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:batchUploadVisible', false)
    },
    // 移除文件前触发函数
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传前触发函数
    onBeforeUpload(file) {
      // 过滤格式不正确的文件
      const str = file.name.split('.')[file.name.split('.').length - 1]
      if (str.indexOf('xlsx') !== -1 || str.indexOf('.xls') !== -1 || str.indexOf('xlsm') !== -1) {
        this.formData.append('uploadFile', file)
        this.formData.append('fileType', 'BATCH_PURCHASE_INCOMING_EXCEL')
        this.discount = 0
        return false
      } else {
        this.$notify({
          title: '错误',
          message: '上传文件格式错误',
          type: 'error',
          duration: 2000
        })
        this.discount = 1
        return
      }
    },
    // 上传文件
    async uploadData() {
      const that = this
      that.formData = new FormData()
      that.$refs['uploadExcel'].submit()
      if (this.discount === 1) {
        this.discount = 0
        return
      }
      // 给formData对象中添加用户当前选择的对应信息
      that.formData.append('needValid', false)
      // 如果没有文件属性 则报错
      if (!that.formData.get('uploadFile')) {
        this.$notify({
          title: '错误',
          message: '文件不能为空',
          type: 'error',
          duration: 2000
        })
        return
      }
      try {
        // 调用接口,请求数据
        const res = await this.$axios.post('/bff/api/v1/file/upload', that.formData)
        this.fileId = res.data.data
        // 不成功提示
        if (res.data.code !== '0') {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        // 重置状态控制变量
        this.discount = 0
        this.$notify({
          title: '成功',
          message: '导入成功',
          type: 'success',
          duration: 2000
        })
        // 清除表单数据
        that.$refs['uploadExcel'].clearFiles()
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '上传文件失败',
          type: 'error',
          duration: 2000
        })
      }
      this.dialogVisible = false
    },
    // 提交
    async submit() {
      if (!this.formData) {
        this.$notify({
          title: '错误',
          message: '文件不能为空',
          type: 'error',
          duration: 2000
        })
        return
      }
      const request = {
        fileId: this.fileId
      }
      this.loading = true
      let res
      try {
        res = await this.$axios.post('/bff/api/v1/purchase/batchArrive', request, { timeout: 300000 })
      } catch (error) {
        this.loading = false
      }
      if (res.data.code === '0') {
        this.loading = false
        this.$alert('已提交成功！系统校验结果会以钉钉消息通知给您，请您留意查收。谢谢！', '提交成功', {
          confirmButtonText: '关闭',
          type: 'success',
          center: true,
          showClose: false,
          closeOnClickModal: false
        }).then(() => {
          this.showDialog = false
          // 刷新主页面(table)
          this.$emit('refreshTable')
        })
      } else {
        this.loading = false
      }
      this.fileId = '' // 提交后清空文件id
    },
    // 导入模板下载
    async downloadTable() {
      this.$axios({
        method: 'get',
        url: '/bff/api/v1/file/download/1',
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
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '采购模板.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 供应商代码及名称下载
    downloadSupplier() {
      this.$axios({
        method: 'get',
        url: '/bff/api/v1/purchase/download/supplier',
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
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '采购模板.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 发运方式代码及名称下载
    downloadtransferMode() {
      this.$axios({
        method: 'get',
        url: '/bff/api/v1/purchase/download/transportMethodCode',
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
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '采购模板.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 下载仓库代码及名称
    downloadWarehouseCode() {
      this.$axios({
        method: 'get',
        url: '/bff/api/v1/purchase/download/warehouseCodes',
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
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '采购模板.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  }
}
</script>
