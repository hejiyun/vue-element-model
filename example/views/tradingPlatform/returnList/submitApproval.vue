<template>
  <el-container class="order-box clearfix">
    <el-col :span="22" :offset="1" class="bord-box">
      <el-col :span="24">
        <h2>B2B客退申请</h2>
      </el-col>
      <el-col :span="12" :offset="4">
        <el-form ref="dataform" v-model="form" label-width="180">
          <el-form-item label="销售退货单号">
            <span>{{ currentInfomation.retOrderNo }}</span>
          </el-form-item>
          <el-form-item label="客户简称">
            <span>{{ currentInfomation.shortNameValue }}</span>
          </el-form-item>
          <el-form-item label="提交人">
            <span>{{ $store.getters.name }}</span>
          </el-form-item>
          <el-form-item label="其他说明">
            <el-input v-model="form.applicationNote" :rows="form.applicationNote ? 6 : 2 " type="textarea"/>
          </el-form-item>
          <el-form-item>
            <span class="dingwei">∗</span>
            <el-upload
              ref="uploadx1"
              :on-change="changeFile"
              :on-preview="handlePreview11"
              :on-remove="handleRemove"
              :before-upload="beforeUpload1"
              :file-list="fileList"
              :http-request="handlePost"
              :limit="5"
              accept=".jpeg,.png,.jpg"
              class="upload-demo"
              action=""
              list-type="picture"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件，且不超过10M</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible123" append-to-body>
              <img :src="dialogImageUrl" width="100%" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item>
            <span class="dingwei">∗</span>
            <el-upload
              ref="uploadx"
              :on-change="changeFile1"
              :on-remove="handleRemove1"
              :before-upload="beforeUpload"
              :limit="5"
              :http-request="handlePost1"
              :file-list="fileList1"
              class="upload-demo"
              list-type="text"
              accept=".xls,.xlsx,.xlsm,.pdf"
              action=""
              multiple>
              <el-button size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">点击上传excel文件，仅限格式xlsx、xls、xlsm，.pdf单个文件不超过10MB</div>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="选择审批流">
            <el-select v-model="form.approvalType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button v-preventReClick :disabled="fileList.length === 0 || fileList1.length === 0" type="primary" @click="onSubmit('dataform')">提交</el-button>
            <el-button type="primary" @click="changeVa(1)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </el-container>
</template>

<script>
import { get } from '@/utils/request'
// 权限菜单请求接口
const getRole = () => get('/bff/b2b/api/v2/auth/approveRetOrder')
export default {
  name: 'SubmitApproval',
  props: {
    submitApprovalVa: {
      type: Boolean,
      default: false
    },
    currentInfomation: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      options: [{
        value: '1',
        label: '政策内'
      }, {
        value: '2',
        label: '政策外'
      }],
      temp: {
        id: undefined,
        customerCode: undefined,
        attachName: undefined,
        file: undefined,
        bizType: undefined
      },
      fileList: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      form: {
        applicationNote: '',
        approvalType: '1',
        fileAnnexes: [],
        fileImage: [],
        retOrderNo: this.$route.params.id,
        submitter: 'nignyuan.yao'
      },
      userInfo: '',
      picListName: ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG'],
      fileName: ['xlsx', 'xls', 'xlsm', 'pdf'],
      olderForme: '',
      count: 0,
      dialogImageUrl: '',
      dialogVisible123: false
    }
  },
  async created() {
    this.form.submitter = this.$store.getters.name
    this.formData = new FormData()
  },
  methods: {
    handlePreview11(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible123 = true
    },
    changeVa(index) {
      this.submitApprovalVa = false
      this.$emit('changeVa', false, index)
    },
    async onSubmit(formName) {
      this.formData.delete('retOrderNo')
      this.formData.delete('cusName')
      // this.formData.delete('approvalType')
      this.formData.delete('remark')
      this.formData.append('retOrderNo', this.$route.params.id)
      this.formData.append('cusName', this.currentInfomation.shortNameValue)
      // this.formData.append('approvalType', this.form.approvalType)
      this.formData.append('remark', this.form.applicationNote)
      await getRole()
      try {
        // const formList = this.count === 0 ? this.formData : this.olderForme
        const res = await this.$api.retSubmitApproval(this.formData)
        // this.olderForme = this.formData
        if (res.data.code !== '0') {
          if (res.code === '3000029') {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 2000
            })
            this.changeVa(1)
          } else {
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
            return
          }
        } else {
          this.$notify({
            title: '成功',
            message: '提交审批成功',
            type: 'success',
            duration: 2000
          })
          // console.log(this.olderForme)
          this.changeVa(2)
        }
      } catch (e) {
        this.$notify({
          title: '错误',
          message: '上传失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeUpload(file) {
      const str1 = file.name
      const arr = str1.split('.')
      const str = arr[arr.length - 1]
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
        this.$refs['uploadx'].handleRemove(file)
        return
      }
      if (this.fileName.filter(item => item.indexOf(str) > -1).length === 0) {
        this.$notify({
          title: '错误',
          message: '上传文件格式错误',
          type: 'error',
          duration: 2000
        })
        this.$refs['uploadx'].handleRemove(file)
        return
      } else {
        this.formData.append('form', file)
      }
    },
    handleRemove1(file, fileList) {
      // 文件
      // console.log(fileList)
      this.formData.delete('form')
      // this.fileList2 = fileList
      this.fileList1 = fileList
      fileList.map(item => {
        this.formData.append('form', item.raw)
      })
      console.log(this.fileList1)
    },
    handleRemove(file, fileList) {
      console.log(file, 123123)
      // 图片
      this.formData.delete('images')
      this.fileList = fileList
      this.fileList = fileList
      fileList.map(item => {
        this.formData.append('images', item.raw)
      })
      console.log(this.fileList)
    },
    handlePreview(res, file, fileList) {
      this.fileList1 = fileList
      console.log(this.fileList1)
    },
    beforeUpload1(file) {
      const str1 = file.name
      const arr = str1.split('.')
      const str = arr[arr.length - 1]
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        this.$refs['uploadx1'].handleRemove(file)
        return
      }
      if (this.picListName.filter(item => item.indexOf(str) > -1).length !== 0) {
        this.formData.append('images', file)
      } else {
        this.$notify({
          title: '错误',
          message: '上传文件格式错误',
          type: 'error',
          duration: 2000
        })
        this.$refs['uploadx1'].handleRemove(file)
        return
      }
    },
    handlePost(file) {
      console.log(file, '上传的图片')
      return
    },
    changeFile(file, fileList) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        return
      }
      this.fileList = fileList
    },
    handlePost1(file) {
      console.log(file, '上传的图片')
      return
    },
    changeFile1(file, fileList) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        return
      }
      this.fileList1 = fileList
    }
  }
}
</script>

<style scoped>
  .order-box {
    display: block;
    width:100%;
    padding: 15px 40px;
    /* margin: 0 auto; */
    z-index: 3
  }
  .bord-box {
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 15px;
  }
  .dingwei {
    position:absolute;
    top:0;
    left:0;
    color:red
  }
</style>
