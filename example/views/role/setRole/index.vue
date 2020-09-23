<template>
  <div class="set-role">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:searchBar>
        <el-button type="primary" @click="addDialog = true">新建角色</el-button>
      </template>
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="view(scope.row)">查询</el-button>
        <el-button type="text" @click="openSetRoleDialog(scope.row)">设置权限</el-button>
        <el-popconfirm
          title="确定要删除吗？"
          @onConfirm="del(scope.row)"
        >
          <el-button slot="reference" type="text">删除</el-button>
        </el-popconfirm>
      </template>
    </HtmlPage>
    <DialogBox
      :dialog-config="addRoleConfig"
      :show-dialog.sync="addDialog"
      @DialogConfirm="addRole"/>
    <DialogBox
      :dialog-config="DialogConfig"
      :show-dialog.sync="showDialog"/>
    <el-dialog
      :visible.sync="setRolDialog"
      title="提示"
      width="70%"
      @close="handleClose">
      <el-row class="text-center">
        <el-col :span="6">角色名称:  </el-col>
        <el-col :span="3"> {{ row.roleName }} </el-col>
      </el-row>
      <tree-transfer
        :title="options.title"
        :from_data="fromData"
        :to_data="toData"
        :default-props="{label:'resourceName'}"
        :default-checked-keys="defaultData"
        :mode="mode"
        default-transfer
        height="540px"
        filter
        @addBtn="add"
        @removeBtn="remove"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config, DialogConfig, addRoleConfig } from '@base/module_role/setRole'
import { getallResuorce, getUserResuorce, setRoleFuction, getUserList, getResource, addNewRole, delRole } from '@/axios/module_role/setRole'
import treeTransfer from 'el-tree-transfer'
import DialogBox from '@common/DialogBox'
export default {
  name: 'SetRole',
  components: {
    HtmlPage,
    DialogBox,
    treeTransfer
  },
  data() {
    return {
      addDialog: false,
      config: config, // 页面配置
      DialogConfig: DialogConfig, // 设置角色弹窗
      addRoleConfig: addRoleConfig, // 新建角色弹窗
      showDialog: false,
      userResuorceList: [],
      defaultData: [],
      TargetData: [],
      row: {},
      setRolDialog: false,
      fromData: [],
      options: {
        title: [
          '待选权限',
          '已选权限'
        ]
      },
      toData: [],
      mode: 'transfer', // transfer addressList
      defaultPa: {
        roleName: '',
        roleCode: '',
        permissionResponseVo: [],
        userName: []
      },
      curow: {},
      sendList: []
    }
  },
  methods: {
    async view(row) {
      this.showDialog = true
      this.$set(this.DialogConfig.options[0], 'setDefaultValue', row.roleName)
      this.$set(this.DialogConfig.options[1], 'setDefaultValue', row.roleCode)
      this.$set(this.DialogConfig.options[2], 'setDefaultValue', row.remark)
      const res = await getUserList(row.roleCode)
      const arr = res.data.data.map(item => {
        return item.userName
      })
      const str = arr.join(',')
      console.log(this.DialogConfig.options[4])
      this.$set(this.DialogConfig.options[4], 'setDefaultValue', str)
      // 赋值给用户
      const res1 = await getResource(row.roleCode)
      const ReData = res1.data.data
      this.$set(this.DialogConfig.options[3], 'data', ReData)
    },
    async del(row) {
      const params = [{
        roleCode: row.roleCode,
        systemId: 10
      }]
      await delRole(params)
      this.$message.success('删除角色成功')
      this.$refs.targetPage.getList()
    },
    // 发送新建角色请求
    async addRole(event) {
      console.log(event)
      event['creator'] = this.$store.getters.code
      event['systemId'] = '10'
      const params = {
        list: [event]
      }
      await addNewRole(params)
      this.$message.success('新建角色成功')
      this.addDialog = false
      this.$refs.targetPage.getList()
    },
    setChidlren(item) {
      const that = this
      if (item.childNodes) {
        item['children'] = item.childNodes
        delete item['childNodes']
        item.children.map(e => {
          that.setChidlren(e)
        })
      } else {
        return false
      }
    },
    // 使用递归为请求到的后台数据的每一项添加一个对应树形结构的pid
    setPid(item) {
      const that = this
      if (item.children) {
        item.children.map(e => {
          // 子级中的pid等于其父级中的id
          e['pid'] = item.id
          that.setPid(e)
        })
      } else {
        return false
      }
    },
    // 使用递归,设置所有id,保留最底层id不变
    setId(item) {
      const that = this
      if (item.children) {
        item.children.map((e, index) => {
          // 子级中的pid等于其父级中的id
          e.id = item.id + '-' + (index + 1)
          that.setId(e)
        })
      } else {
        return false
      }
    },
    // 使用递归查找最终子元素
    getTarget(item, arr) {
      const that = this
      // 如果内部还有children,那么反复递归当前函数, arr为存储所有符合条件值的数组
      if (item.children) {
        item.children.map(e => {
          that.getTarget(e, arr)
        })
      } else {
        // 如果没有, 那么证明当前这个子元素就是最小子节点的元素, 即,
        arr.push(item)
      }
    },
    // 使用递归,获取到每一次添加或移除后toData中的最终子元素(没有children的元素)的集合
    getTbs(toData) {
      const arr = []
      toData.map(item => {
        if (item.children) {
          this.getTarget(item, arr)
        } else {
          arr.push(item)
          return false
        }
      })
      return arr
    },
    handleClose() {
      this.fromData = []
      this.toData = []
    },
    async setRole() {
      // 在这里判断一下是否是所有里面包含的权限
      const arr = []
      console.log(this.sendList.length)
      this.sendList.forEach(item => {
        arr.push({
          roleCode: this.row.roleCode,
          resourceCode: item.resourceCode,
          creator: this.$store.getters.name,
          option: item.option,
          parentId: item.parentId,
          systemId: 10
        })
      })
      const params = {
        list: arr
      }
      console.log(arr, '传递的数组')
      const res = await setRoleFuction(params)
      if (res) {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '设置权限成功',
          duration: 2000
        })
        this.setRolDialog = false
        this.sendList = []
        this.handleClose()
        this.$refs.targetPage.getList()
      }
    },
    async openSetRoleDialog(row) {
      this.setRolDialog = true
      this.row = row
      const res = await getallResuorce()
      const arr = res.data.data
      arr.map((item, index) => {
        item['pid'] = 0
        item.id = `${index + 1}`
        item['children'] = item.childNodes
        this.setChidlren(item)
        this.setId(item)
        this.setPid(item)
      })
      const currentList = this.getTbs(arr)
      // 用户当前的权限
      const res2 = await getUserResuorce(row.roleCode, '10')
      const arr2 = res2.data.data
      arr2.map((item, index) => {
        item['children'] = item.childNodes
        this.setChidlren(item)
      })
      // 先筛选出没有子元素的
      const arr3 = this.getTbs(arr2)
      const targetList = []
      arr3.forEach(item => {
        // 遍历去比较这个相同的地方, 提取出相同项的id,
        currentList.forEach(e => {
          if (e.uniqueKey === item.uniqueKey) {
            targetList.push(e.id)
          }
        })
      })
      // 保存用户所有权限列表
      this.userResuorceList = arr3
      // 保存所有列表
      this.fromData = arr
      // 保存默认选中列表
      this.defaultData = targetList
    },
    add(fromData, toData, obj) {
      // 增加, 增加所有层级
      const arr = [...obj.halfNodes, ...obj.nodes]
      console.log(arr, '增加的东西')
      arr.forEach(item => {
        item['option'] = '1'
        this.sendList = this.sendList.filter(e => e.id !== item.id)
        this.sendList.push(item)
      })
    },
    remove(fromData, toData, obj) {
      // 移除, 移动单个
      const arr = []
      console.log(obj, '移动的数组')
      obj.nodes.forEach(item => {
        arr.push(item)
      })
      // const arr = this.getTbs(obj.nodes)
      console.log(arr, '减少的数组')
      arr.forEach(item => {
        item['option'] = '0'
        this.sendList = this.sendList.filter(e => e.id !== item.id)
        this.sendList.push(item)
      })
    }
  }
}
</script>
