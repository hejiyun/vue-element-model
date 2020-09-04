<template>
  <div>
    <el-upload
      v-if="Titem.FileType === 'picfile'"
      ref="fileUp"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :limit="Titem.limit"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :file-list="Titem.fileList"
      class="upload-demo"
      action=""
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传
        <span v-for="(e, index) in Titem.FileTypeList" :key="index">
          {{ `${e}${index !== Titem.FileTypeList.length - 1 ? '/' : ''}` }}</span>
        文件，且不超过500kb</div>
    </el-upload>
    <!--    上传图片,图片以列表的形式显示-->
    <el-upload
      v-if="Titem.FileType === 'picview'"
      ref="fileUp"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :limit="Titem.limit"
      :on-exceed="onExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="Titem.fileList"
      :before-upload="beforeAvatarUpload"
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
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="Titem.fileList"
      :on-change="handleChange"
      :before-upload="beforeAvatarUpload"
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
      :on-success="onSuccess"
      :on-error="onError"
      :limit="Titem.limit"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="Titem.fileList"
      :before-upload="beforeAvatarUpload"
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
      formData: new FormData(),
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
        fileList: []
      }, this.item)
    }
  },
  mounted() {
    console.log(this.Titem)
  },
  methods: {
    reset() {
      this.$refs.fileUp.clearFiles()
    },
    handleChange(file, fileList) {
      // // 当多余一个的时候替换文件
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    fnOSSUpload(options) {
      this.formData.set('file', options.file)
      this.$emit('updateValue', this.formData.get('file'))
    },
    onSuccess(res, file, fileList) {
    },
    onRemove(file, fileList) {
      this.formData.delete('file')
      this.flag = true
    },
    onError(err) {
      this.$message.error(err)
    },
    onExceed(files, fileList) {
      this.Titem.fileList = files
    },
    beforeRemove(file, fileList) {
      if (this.flag) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
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
          return isFile && isFileLimit
        } else {
          // 如果文件大小不符合
          this.$message.warning(`${this.Titem.FileTypeErrorText[1]}`)
          this.flag = false
          return isFileLimit
        }
      } else {
        // 如果文件类型不符合, FileTypeErrorText 文件提示内容
        this.$message.warning(`${this.Titem.FileTypeErrorText[0]}`)
        this.flag = false
        return isFile
      }
    }
  }
}
</script>
