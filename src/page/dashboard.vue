<template>
  <div class="dashboard-style">
    <el-row>欢迎您 {{ sysUserName }}</el-row>
    <dialog-box
      ref="dbtn"
      :dialog-config="DialogConfig"
      :show-dialog.sync="showDialog"
      @open="showDialog = true"
      @DialogConfirm="addRoleConfirm($event)"/>
    <el-row class="footer-div">copyright @ 昆山宝唯信息科技有限公司上海分公司</el-row>
  </div>
</template>
<script>
import DialogBox from 'common/DialogBox'
import { InputC, SelectC, CheckBox, DateC, NumberInput, Radio, Switch, TextArea, Upload, DownLoad } from '@component/Form/ExportItem.js'
export default {
  components: {
    DialogBox
  },
  data() {
    return {
      sysUserName: '',
      showDialog: false,
      DialogConfig: {
        options: [
          {
            label: '输入框',
            prop: 'password',
            setDefaultValue: '12312313',
            cmp: InputC
          },
          {
            label: '下拉框',
            prop: 'username',
            multiple: true,
            setDefaultValue: ['选项2'],
            options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }],
            cmp: SelectC
          },
          {
            label: '输入框2',
            prop: 'password2',
            cmp: NumberInput
          },
          {
            label: '日期选择',
            setDefaultValue: ['2020-08-08 00:00:00', '2020-09-19 23:59:59'], // 默认初始日期
            prop: 'username1',
            cmp: DateC
          },
          {
            label: '差异',
            prop: 'password3',
            placeholder: '是否有差异',
            cmp: CheckBox
          },
          {
            label: '文本域',
            prop: 'password81',
            cmp: TextArea
          },
          {
            label: '按月缴费',
            prop: 'password8',
            cmp: Switch
          },
          {
            label: '选择',
            prop: 'password4',
            list: [{
              label: '男',
              value: '12'
            }, {
              label: '女',
              value: '123'
            }],
            cmp: Radio
          },
          {
            label: '上传',
            prop: 'file23',
            FileTypeList: ['JPG', 'xlsx'],
            multiple: false,
            cmp: Upload
          },
          {
            label: '下载',
            prop: 'file232',
            btntype: 'text',
            btnText: '导出群文件',
            url: '/bff/common/no_route/api/v1/template/r/download?templateId=POS_SALES_INVENTORY_OFFLINE_IMPORT',
            cmp: DownLoad
          }
        ]
      }
    }
  },
  mounted() {
    var user = sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.userName || '';
    }
  },
  methods: {
    addRoleConfirm(e) {
      console.log(e)
    }
  }
}
</script>
