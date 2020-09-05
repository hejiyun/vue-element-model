<template>
  <div class="dashboard-style">
    <el-row>欢迎您 {{ sysUserName }}</el-row>
    <SearchForm :options="row"/>
    <detail-view :options="detailOptions" :data="baseText" />
    <el-row class="footer-div">copyright @ 昆山宝唯信息科技有限公司上海分公司</el-row>
  </div>
</template>
<script>
import SearchForm from '@component/Form'
import DetailView from '@component/common/DetailView'
import { InputC, SelectC, CheckBox, DateC, NumberInput, Radio, Switch, TextArea, Upload, DownLoad } from '@component/Form/ExportItem.js'
export default {
  components: {
    SearchForm,
    DetailView
  },
  data() {
    return {
      sysUserName: '',
      detailOptions: [{
        label: '发货单号',
        key: 'billNo' // data中对应的字段
      }, {
        label: '订单号',
        key: 'orderNo',
        type: 'link',
        to: '/TradingPlatform/List/ListDetail'
      }, {
        label: '来源单号',
        key: 'sourceBillNo'
      },
      {
        label: '网店交易单号',
        key: 'shopBillNo'
      }, {
        label: '发货单状态',
        key: 'billStatusName'
      }, {
        label: '发货单生成时间',
        key: 'createTime'
      }, {
        label: '发货单下发时间',
        key: 'billDate'
      }, {
        label: '发货时间',
        key: 'deliveryTime'
      }, {
        label: '业务类型',
        key: 'bizTypeName'
      }, {
        label: '客商编码',
        key: 'vendCustCode'
      },
      {
        label: '客商名称',
        key: 'vendCustName'
      }, {
        label: '调拨类型',
        key: 'allocateType'
      }, {
        label: '调拨方式名称',
        key: 'allocateModeName'
      }, {
        label: '调拨优先级',
        key: 'allocatePriority'
      }, { // 增加详情信息展示
        label: '发运方式',
        key: 'transportMethodName'
      }, {
        label: '所属批次',
        key: 'batchMark'
      }, {
        label: '预计到货时间',
        key: 'expectArrivalTime'
      }, {
        label: '其他单号',
        key: 'otherBillNo' // 修改结束
      }, {
        label: '发货仓代码',
        key: 'fromExternalWarehouseCode'
      }, {
        label: '发货仓名称',
        key: 'fromExternalWarehouseName'
      }, {
        label: '目的仓代码',
        key: 'toExternalWarehouseCode'
      }, {
        label: '目的仓名称',
        key: 'toExternalWarehouseName'
      },
      {
        label: '收件人省市区',
        key: 'provinceCityArea'
      }, {
        label: '收件人地址',
        key: 'address'
      }, {
        label: '收件人姓名',
        key: 'contact'
      }, {
        label: '收件人电话',
        key: 'phone'
      }, {
        label: '是否打印发票',
        key: 'PrintInvoiceFlag',
        type: 'radio'
      }, {
        label: '是否货票同行',
        key: 'WithInvoiceFlag',
        type: 'radio'
      }, {
        label: '备注',
        key: 'remark'
      }],
      baseText: {
        billNo: '1991224198210519096-D001',
        orderNo: 'SO3951991224198210519096',
        orderSource: '',
        bwOrderNo: 'SO3951991224198210519096',
        sourceBillNo: '',
        shopBillNo: '2057',
        billStatus: '20',
        billStatusName: '待下发',
        createTime: '2020-09-03 17:43:40',
        billDate: '2020-09-03 17:43:40',
        deliveryTime: null,
        bizType: 'JITX_DISPATCH',
        bizTypeName: 'JITX发货',
        vendCustCode: '47001257',
        vendCustName: '唯品会',
        allocateModeCode: '',
        allocateModeName: '',
        allocatePriority: '',
        allocateType: '',
        fromExternalWarehouseCode: 'WH190JIT',
        fromExternalWarehouseName: 'JIT测试仓HK',
        toExternalWarehouseCode: '',
        toExternalWarehouseName: '',
        provinceCityArea: '福建省 宁德市 古田县',
        address: '鹤塘镇坊下烟酒行',
        contact: '李*婷',
        phone: '01000009999',
        printInvoiceFlag: 0,
        withInvoiceFlag: 0,
        remark: '',
        totalBoxNo: null,
        totalSkuCount: 0,
        totalExpectQty: 2,
        totalActualQty: null,
        transportMethodCode: '',
        transportMethodName: '',
        expectArrivalTime: null,
        otherBillNo: '',
        batchNo: '',
        batchMark: '' }, // 详情数据来源变量
      row: [
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
          setDefaultValue: '选项2',
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
  },
  mounted() {
    var user = sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.userName || '';
    }
  }
}
</script>
