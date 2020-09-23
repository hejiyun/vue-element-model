import { InputC, TextArea, Tree } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_role/setRole'

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 140,
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
    baseList: ['page', 'limit'],
    request: getTableList
  }
}
const addRoleConfig = {
  WidthPercent: 30,
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
  hasFooter: false,
  options: [
    {
      label: '角色名称',
      prop: 'roleName',
      cmp: InputC,
      disabled: true
    },
    {
      label: '角色英文名',
      prop: 'roleCode',
      cmp: InputC,
      disabled: true
    },
    {
      label: '角色描述',
      prop: 'remark',
      cmp: TextArea,
      disabled: true
    },
    {
      label: '权限',
      prop: 'permissionResponseVo',
      defaultProps: {
        children: 'childNodes',
        label: 'resourceName'
      },
      data: [],
      cmp: Tree
    },
    {
      label: '用户',
      prop: 'userName',
      cmp: TextArea,
      disabled: true
    }

  ]
}
export { config, DialogConfig, addRoleConfig }
