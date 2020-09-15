import { InputC, TextArea } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/addRole';

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 200,
    tableHeader: [
      {
        label: '权限名',
        prop: 'resourceName'
      },
      {
        label: 'ResourceCode',
        prop: 'resourceCode'
      },
      {
        label: '权限等级',
        prop: 'resourceType'
      },
      {
        label: 'URL',
        prop: 'url'
      },
      {
        label: 'ID',
        prop: 'id'
      },
      {
        label: 'parentID',
        prop: 'parentId'
      },
      {
        label: '资源描述',
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
const searchOptions = {
  placeholder: '全部',
  prop: 'resourceType',
  options: [
    {
      label: '菜单级',
      value: 'MENU'
    },
    {
      label: '接口级',
      value: 'LINK'
    }
  ]
}

export { config, DialogConfig, addRoleConfig, searchOptions }
