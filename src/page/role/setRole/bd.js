import { InputC, TextArea } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/setRole';

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 200,
    tableHeader: [
      {
        label: '角色名称',
        prop: 'roleName'
      },
      {
        label: '角色描述',
        prop: 'remark'
      },
      {
        label: '创建人',
        prop: 'creator'
      },
      {
        label: '创建时间',
        prop: 'createTime'
      },
      {
        label: '最后修改时间',
        prop: 'lastUpdateTime'
      },
      {
        label: '操作',
        prop: 'btn',
        width: '220',
        operate: true
      }
    ],
    tableData: []
  },
  pageConfig: {
    request: getTableList
  }
}
const addRoleConfig = {
  options: [
    {
      label: '角色名称',
      prop: 'roleName',
      cmp: InputC,
      rules: {
        required: true, message: '请输入角色名称', trigger: 'blur'
      }
    },
    {
      label: '角色英文名',
      prop: 'roleCode',
      cmp: InputC,
      rules: {
        required: true, message: '请输入角色英文名', trigger: 'blur'
      }
    },
    {
      label: '角色描述',
      prop: 'remark',
      cmp: TextArea,
      rules: {
        required: true, message: '请填写角色描述', trigger: 'blur'
      }
    }
  ]

}
const DialogConfig = {
  options: [
    {
      label: '角色名称',
      prop: 'roleName',
      cmp: InputC,
      disabled: true,
      setDefaultValue: ''
    },
    {
      label: '账户属性',
      prop: 'id',
      cmp: InputC,
      disabled: true,
      setDefaultValue: ''
    }
  ]
}

export { config, DialogConfig, addRoleConfig }
