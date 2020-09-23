<template>
  <div>
    <!-- 采购单新增页上传文件组件 -->
    <el-row class="upload-box">
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <el-button size="mini" icon="el-icon-folder-add" type="primary" @click="dialogVisible = true">导入采购到货清单</el-button>
        <el-dialog
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          title="导入采购到货清单"
          width="30%">
          <el-upload
            ref="uploadExcel"
            :limit="1"
            :before-upload="onBeforeUpload"
            :auto-upload="false"
            name="file"
            accept=".xls,.xlsx,.xlsm"
            class="upload-demo"
            action= "">
            <el-button size="mini" icon="el-icon-folder-add" type="primary">选取文件</el-button>
          </el-upload>
          <span slot="footer" class="dialog-footer">
            <el-button v-preventReClick type="primary" size="mini" @click="uploadData">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <el-button type="primary" icon="el-icon-download" size="mini" @click="downloadTable">导入模板下载</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <p>备注:</p>
        <p>1.一次只能上传一个excel文件，仅限格式xlsx、xls、xlsm;</p>
        <span>2.</span><span class="tips">货号、尺码、数量、折扣率为必填项。</span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AddPurchase',
  data() {
    return {
      fileList: [], // 选取的文件List
      objData: {
        formData: [], // 保存选择的文件
        discount: 0 // 控制刷新次数
      },
      fileId: '', // 文件id
      dialogVisible: false // 选取文件弹窗 默认不显示
    }
  },
  methods: {
    async downloadTable() {
      this.$axios({
        method: 'get',
        url: '/bff/api/v1/file/download/0',
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
    // 移除文件前触发函数
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传前触发函数
    onBeforeUpload(file) {
      // 过滤格式不正确的文件
      const str = file.name.split('.')[file.name.split('.').length - 1]
      if (str.indexOf('xlsx') !== -1 || str.indexOf('.xls') !== -1 || str.indexOf('xlsm') !== -1) {
        this.objData.formData.append('uploadFile', file)
        this.objData.formData.append('fileType', 'PURCHASE_INCOMING_EXCEL')
        this.$emit('getFile', file)
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
    // 导入模板下载
    async uploadData() {
      const that = this
      that.objData.formData = new FormData()
      that.$refs['uploadExcel'].submit()
      if (this.discount === 1) {
        this.discount = 0
        return
      }
      // 给formData对象中添加用户当前选择的对应信息
      that.objData.formData.append('needValid', false)
      // 如果没有文件属性 则报错
      if (!that.objData.formData.get('uploadFile')) {
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
        const res = await this.$axios.post('/bff/api/v1/file/upload', that.objData.formData)
        this.fileId = res.data.data
        this.$emit('childFn', this.fileId, that.objData.formData)
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
    }
  }
}
</script>
