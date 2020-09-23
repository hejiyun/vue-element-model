<template>
  <div>
    <!--    上传图片,图片以列表的形式显示-->
    <el-upload
      v-if="Titem.FileType === 'picview'"
      ref="fileUp"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :limit="Titem.limit"
      :on-exceed="onExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="Titem.fileList"
      action=""
      list-type="picture"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传
        <span v-for="(e, index) in Titem.FileTypeList" :key="index">
          {{ `${e}${index !== Titem.FileTypeList.length - 1 ? '/' : ''}` }}</span>
        文件，且不超过500kb</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
    <!--    上传文件,文件类型显示-->
    <el-upload
      v-if="Titem.FileType === 'file'"
      ref="fileUp"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="Titem.fileList"
      :on-change="handleChange"
      class="upload-demo"
      action=""
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">支持扩展名：
        <span v-for="(e, index) in Titem.FileTypeList" :key="index">
          {{ `${e}${index !== Titem.FileTypeList.length - 1 ? ',' : ''}` }}</span> </div>
    </el-upload>
    <el-upload
      v-if="Titem.FileType === 'fileDrag'"
      ref="fileUp"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :limit="Titem.limit"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="Titem.fileList"
      class="upload-demo"
      drag
      action=""
      multiple>
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传
        <span v-for="(e, index) in Titem.FileTypeList" :key="index">
          {{ `${e}${index !== Titem.FileTypeList.length - 1 ? '/' : ''}` }}</span>
        文件，且不超过500kb</div>
    </el-upload>
  </div>
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
      flag: true,
      dialogImageUrl: '',
      dialogVisible: false,
      testRemove: false
    }
  },
  computed: {
    Titem() {
      return Object.assign({
        FileTypeList: ['JPG', 'xlsx'],
        limit: 1,
        FileType: 'file',
        FileTypeErrorText: ['上传文件格式错误', '上传文件大小不能超过10M'],
        FileLimit: 10,
        fileList: [],
        multiple: false
      }, this.item)
    }
  },
  methods: {
    reset() {
      this.$refs.fileUp.clearFiles()
    },
    handleChange(file, fileList) {
      // 获取文件名后缀
      const arr = file.name.split('.')
      const str = arr[arr.length - 1]
      // this.FileTypeList 为传进来的自定义文件内容, 过滤数组长度大于0,则证明存在
      const isFile = this.Titem.FileTypeList.filter(item => item.indexOf(str) > -1).length > 0
      // 先判断文件类型符不符合
      if (isFile) {
        // 再判断文件大小符不符合
        // 设置文件最大限制  , 以M为单位
        const isFileLimit = file.size / 1024 / 1024 < this.Titem.FileLimit
        if (isFileLimit) {
          // 单个文件
          (!this.Titem.multiple && fileList.length > 1) && fileList.splice(0, 1)
          // 多个文件直接过
          this.testRemove = true
          return isFile && isFileLimit
        } else {
          // 如果文件大小不符合
          this.$message.warning(`${this.Titem.FileTypeErrorText[1]}`)
          fileList.splice(fileList.length - 1, 1)
          this.flag = false
          return isFileLimit
        }
      } else {
        // 如果文件类型不符合, FileTypeErrorText 文件提示内容
        this.$message.warning(`${this.Titem.FileTypeErrorText[0]}`)
        fileList.splice(fileList.length - 1, 1)
        this.flag = false
        return isFile
      }
    },
    fnOSSUpload(options) {
      // 通过change状态校验的文件才可以在http-request中保留
      if (this.testRemove) {
        // 判断多文件/单文件采用不同保留方式
        this.Titem.multiple && this.Titem.fileList.push(options.file)
        !this.Titem.multiple && this.Titem.fileList.splice(0, 1, options.file)
        // 将值传递给外部
        this.$emit('updateValue', this.Titem.fileList)
        // 重置是否允许文件保留变量
        this.testRemove = false
      }
    },
    onRemove(file, fileList) {
      // 移除文件则使用filter过滤
      this.Titem.fileList = this.Titem.fileList.filter(item => item.uid !== file.uid)
      // 过滤完成后,将结果传递给外部
      this.$emit('updateValue', this.Titem.fileList)
      // 重置flag
      this.flag = true
    },
    onExceed(files, fileList) {
      // this.Titem.fileList = fileList
    },
    beforeRemove(file, fileList) {
      if (this.flag) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
