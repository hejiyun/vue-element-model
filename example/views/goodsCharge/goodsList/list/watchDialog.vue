<template>
  <el-dialog
    :visible="dialogVisible==4?true:false"
    :before-close="handleClose"
    title="监控配置">
    <el-form ref="form" :model="watchform">
      <el-form-item :label-width="formLabelWidth" label="监控开关：">
        <el-switch
          v-model="watchform.monitor_flag"
          active-color="#13ce66"
          inactive-color="grey"
          active-value="Y"
          inactive-value="N"
          @change="switchChange"/>
      </el-form-item>
      <el-form-item :required="true" :label-width="formLabelWidth" label="触发阈值：">
        <el-input v-model="watchform.monitor_threshold">
          <i slot="suffix" class="">%</i>
        </el-input>
      </el-form-item>
      <el-form-item :required="true" :label-width="formLabelWidth" label="升级预警：">
        <el-input v-model="watchform.monitor_threshold_upgrade">
          <i slot="suffix" class="">%</i>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ApiConfig from '../../goodsCommon/api.js'
export default {
  props: {
    dialogVisible: {
      type: Number,
      default: 0
    },
    watchform: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formLabelWidth: '120px'
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    switchChange(val) {
      console.log(val)
    },
    handleClose(done) {
      this.$emit('EventDialog', 0, 0)
    },
    closeDialog() {
      console.log(88990)
      this.$emit('EventDialog', 0, 0)
    },
    submit() {
      const that = this
      if (this.watchform.monitor_flag === 'N') {
        if (this.watchform.monitor_threshold || this.watchform.monitor_threshold_upgrade) {
        //        this.$message({
        //   showClose: true,
        //   message: '请输入正整数',
        //   type: 'error'
        // })

          console.log(12344)
          this.$confirm('开关关闭，数值将置空')
            .then(_ => {
              this.watchform.monitor_threshold = ''
              this.watchform.monitor_threshold_upgrade = ''
              console.log(12345)
              ApiConfig.totalConfig(this.watchform).then(res => {
                console.log(1234, res)
                if (res && res.data.code === '0') {
                  that.$emit('EventDialog', 0, 0)
                } else {
                  that.$emit('EventDialog', 0, 0)
                }
              }).catch(error => {
                that.$emit('EventDialog', 0, 0)
                console.log(error, 7890)
              })
            })
            .catch(_ => {
              that.$emit('EventDialog', 0)
              return
            })
        }
      } else {
        console.log(that.watchform)
        if (parseInt(this.watchform.monitor_threshold) > parseInt(this.watchform.monitor_threshold_upgrade)) {
          this.$alert('', `升级阈值必须大于触发阈值`, { // 修改结束
            confirmButtonText: '关闭',
            type: 'error',
            center: true,
            showClose: false
          }).then(() => {
            console.log(123456)
          })
        } else {
          ApiConfig.totalConfig(this.watchform).then(res => {
            console.log(1234, res)
            if (res && res.data.code === '0') {
              that.$emit('EventDialog', 0)
            } else {
              that.$emit('EventDialog', 0)
            }
          }).catch(error => {
            that.$emit('EventDialog', 0)
            console.log(error, 7890)
          })
        }
      }
    }
  }
}
</script>
