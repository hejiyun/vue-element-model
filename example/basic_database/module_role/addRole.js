import { InputC, TextArea } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_role/addRole'

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 140,
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
        width: '140',
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

const DialogConfig = {
  options: [
    {
      label: '权限名',
      prop: 'resourceName',
      cmp: InputC
    },
    {
      label: 'ResourceCode',
      prop: 'resourceCode',
      cmp: InputC
    },
    {
      label: 'URL',
      prop: 'url',
      cmp: InputC
    },
    {
      label: 'ParentID',
      prop: 'parentId',
      cmp: InputC
    },
    {
      label: '资源描述',
      prop: 'remark',
      cmp: TextArea
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

export { config, DialogConfig, searchOptions }
