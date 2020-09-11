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
        operate: true,
        width: '390'
      }
    ],
    tableData: []
  },
  pageConfig: {
    url: '/api/internal/user/list?page=1&limit=20',
    method: 'post'
  }
}

export { config }
