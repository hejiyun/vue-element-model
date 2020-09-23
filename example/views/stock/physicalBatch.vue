<template>
  <div class="phy-bat">
    <el-button size="mini" type="primary" @click="dialogVisible = true">批量上架导入</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="批量导入文件进行库存上架"
      width="40%">
      <el-row>
        <el-col :span="8">
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
        </el-col>
        <el-col :span="8">
          <el-button v-preventReClick type="primary" icon="el-icon-download" size="mini" @click="downloadMode">导入模板下载</el-button>
        </el-col>
        <el-col :span="8">
          <el-button v-preventReClick type="primary" icon="el-icon-download" size="mini" @click="downloadWareToChannel">仓库与渠道关系下载</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :offset="8" class="phy-tips">
          <p class="remark">备注:</p>
          <p>1. 一次只能上传一个excel文件，仅限格式xlsx、xls、xlsm;</p>
          <p class="remark-two">2. 条码、数量、上架仓库代码、上架渠道代码为必填项;</p>
          <p>3. 一次导入条码不超过5000条。</p>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" size="mini" @click="uploadData">确 定</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddPurchase',
  data() {
    return {
      fileList: [], // 选取的文件List
      formData: [], // 保存选择的文件
      discount: 0, // 控制刷新次数
      dialogVisible: false // 选取文件弹窗 默认不显示
    }
  },
  methods: {
    // 导入模板下载
    async downloadMode() {
      this.$axios({
        method: 'get',
        url: '/bff/api/v1/channel_inventory/download/template?operType=UP_SHELF',
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
    // 仓库与渠道关系下载
    async downloadWareToChannel() {
      this.$axios({
        method: 'get',
        url: '/bff/api/v1/channel_inventory/download/warehouse_channel_relation',
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
        this.formData.append('uploadFile', file)
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
    // 选取文件之后点击确定按钮
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
        const request = new FormData()
        request.append('uploadFile', that.formData.get('uploadFile'))
        request.append('operType', 'UP_SHELF')
        request.append('pushAllocation', true)
        request.append('shortAllocate', true)
        // 调用接口,请求数据
        const res = await this.$axios.post('/bff/api/v1/channel_inventory/import/batch_inventory_change', request)
        this.$alert(`${res.data.data}`, '', {
          confirmButtonText: '关闭页面',
          type: 'success',
          center: true,
          showClose: false
        }).then(() => {
          this.dialogVisible = false
        })
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
        // this.$notify({
        //   title: '成功',
        //   message: '导入成功',
        //   type: 'success',
        //   duration: 2000
        // })
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

<style lang="scss" scoped>
* {
    font-size: 11px;
    font-family: tahoma, arial, 宋体, sans-serif;
  }
.phy-bat {
  display: inline-block;
  margin-left: 10px;
  text-align: left;
}
.phy-tips {
  margin-top: 15px;
}
.remark {
  font-size: 14px;
}
.remark-two {
  margin: 5px 0 5px 0;
}
</style>
