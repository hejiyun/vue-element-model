<template>
  <el-dialog
    :visible="dialogVisible==2?true:false"
    :before-close="closeDialog"
    title="数据导入"
    width="40%"
    @open="open">
    <div class="pbtn">
      <el-upload
        ref="upload"
        :on-change="handleChange"
        :file-list="fileList"
        :limit="1"
        :on-exceed="onexceed"
        :auto-upload="false"
        action=""
        accept=".xls,.csv,.xlsx,.xlsm"
        class="upload-demo">
        <el-button
          slot="trigger"
          type="primary"
          icon="el-icon-folder-add">选取文件</el-button>
        <el-button
          type="primary"
          icon="el-icon-folder-add"
          @click="download()">下载模板</el-button>
        <div slot="tip" class="el-upload__tip">一次只能上传一个excel文件，仅限格式xlsx、xls、xlsm，单个文件不超过20000条数据
        带*的为必填项，不填则表格无法导入</div>
      </el-upload>

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit()">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ApiConfig from '../../goodsCommon/api.js'
import { downloadFun } from '../../goodsCommon/tool.js'
export default {
  props: {
    dialogVisible: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      fileList: [], // 选中文件提示
      formData: new FormData() // 提交文件
    }
  },
  methods: {
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的csv文件
      }
      this.formData.set('uploadFile', file.raw)
    },
    download() {
      // 下载模板
      downloadFun(ApiConfig.templateDownload, {})
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    async submit() {
      let res
      try {
        res = await ApiConfig.importPrice(this.formData)
        this.loading = false
        if (res && res.data.code === '0') {
          this.$emit('EventDialog', 5, res.data.msg)
        }
      } catch (error) {
        this.$emit('EventDialog', 6, error.response.data.msg)
      }
      this.$refs['upload'].clearFiles() // 清除文件
    },
    closeDialog() {
      this.$emit('EventDialog', 0, 0)
    },
    open() {
      this.formData = new FormData()
    },
    onexceed(files, fileList) {
      this.$refs['upload'].clearFiles() // 清除文件
      this.$refs['upload'].handleStart(files[0]) // 选择文件后的赋值方法
    }
  }
}
</script>
