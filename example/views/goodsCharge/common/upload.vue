<template>
  <div>
    <el-upload
      v-if="FileType === 'picfile'"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      class="upload-demo"
      action=""
      list-type="picture">
      <el-button v-if="itemList" size="small" type="primary" @click="getindex(item, itemList, id)">点击上传</el-button>
      <el-button v-if="!itemList && item" size="small" type="primary" @click="getItem(item)">点击上传</el-button>
      <el-button v-if="!itemList && !item" size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <!--    上传图片,图片以列表的形式显示-->
    <el-upload
      v-if="FileType === 'picview'"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-preview="handlePictureCardPreview"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      action=""
      list-type="picture"
    >
      <el-button v-if="itemList" size="small" type="primary" @click="getindex(item, itemList, id)">点击上传</el-button>
      <el-button v-if="!itemList && item" size="small" type="primary" @click="getItem(item)">点击上传</el-button>
      <el-button v-if="!itemList && !item" size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
    <!--    上传文件,文件类型显示-->
    <el-upload
      v-if="FileType === 'file'"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      class="upload-demo"
      action=""
    >
      <el-button v-if="itemList" size="small" type="primary" @click="getindex(item, itemList, id)">点击上传</el-button>
      <el-button v-if="!itemList" size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">支持扩展名：rar.zip.doc.docx</div>
    </el-upload>
    <el-upload
      v-if="FileType === 'fileDrag'"
      :show-file-list="true"
      :http-request="fnOSSUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      class="upload-demo"
      drag
      action=""
      multiple>
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    fileName: {
      type: String,
      default: 'file'
    },
    FileTypeList: {
      type: Array,
      default: () => []
    },
    FileType: { // 判断构建上传文件类型
      type: String,
      default: 'file'
    },
    FileTypeErrorText: {
      type: Array,
      default: () => []
    },
    FileLimit: {
      type: Number,
      default: 10
    },
    fileList: {
      type: Array,
      default: () => []
    },
    item: {
      type: Object,
      default: () => {}
    },
    itemList: {
      type: Array,
      default: () => []
    },
    id: {
      type: Number,
      default: 1
    },
    category: {
      type: String,
      default: 'task'
    }
  },
  data() {
    return {
      flag: true,
      dialogImageUrl: '',
      dialogVisible: false,
      formData: new FormData()
    }
  },
  methods: {
    fnOSSUpload(options) {
      console.log(this.fileName)
      this.formData.append(this.fileName, options.file)
      this.$emit('success', this.formData)
    },
    onSuccess(res, file, fileList) {
    },
    getindex(item, itemList, id) {
      /*  item: 遍历数组集合的对应item项
      *  itemList : 遍历实现增加表单项的数组,
      * 思路: 以数组的方式 v-for循环一个数组,需要增加时,往数组中push子对象, 删除时,找到对应项在数组的位置,直接删除,或者
      * 使用绑定传入唯一值参数key,再将Key值发射到外面,父组件通过key值寻找对应元素删除.
      * id: 传入为分辨是哪个数组进行增加或删除操作, 这个属性适用于同组件中,多个增加表单的数组.
      * */
      const index = itemList.indexOf(item)
      this.$emit('getindex', index, id)
    },
    getItem(item) {
      this.$emit('getItem', item)
    },
    onRemove(file, fileList) {
      this.$emit('remove', file)
      this.flag = true
    },
    onError(err) {
      this.$message.error(err)
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
      const isFile = this.FileTypeList.filter(item => item.indexOf(str) > -1).length > 0
      // 先判断文件类型符不符合
      if (isFile) {
        // 再判断文件大小符不符合
        // 设置文件最大限制  , 以M为单位
        const isFileLimit = file.size / 1024 / 1024 < this.FileLimit
        if (isFileLimit) {
          return isFile && isFileLimit
        } else {
          // 如果文件大小不符合
          this.$message.warning(`${this.FileTypeErrorText[1]}`)
          this.flag = false
          return isFileLimit
        }
      } else {
        // 如果文件类型不符合, FileTypeErrorText 文件提示内容
        this.$message.warning(`${this.FileTypeErrorText[0]}`)
        this.flag = false
        return isFile
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
