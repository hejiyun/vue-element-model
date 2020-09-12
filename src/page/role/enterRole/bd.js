import { InputC, SelectC} from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/enterRole';

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 200,
    tableHeader: [
      {
        label: '序号',
        prop: 'id'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '角色',
        prop: 'roleNames',
        operate: true
      },
      {
        label: '创建时间',
        prop: 'createTime'
      },
      {
        label: '操作',
        prop: 'btn',
        operate: true
      }
    ],
    tableData: []
  },
  pageConfig: {
    request: getTableList
  }
}

const DialogConfig = {
 options:[ 
   {
    label: '用户',
    prop:'userName',
    cmp: InputC,
    disabled: true,
    setDefaultValue: ''
  },
  {
    label: '账户属性',
    prop:'id',
    cmp: InputC,
    disabled: true,
    setDefaultValue: ''
  },
  {
    label: '角色',
    prop: 'roleCodes',
    cmp: SelectC,
    multiple: true,
    options: [],
    mapping: ['roleName', 'roleCode'],
    setDefaultValue: ''
  }
]
}

export { config, DialogConfig }
