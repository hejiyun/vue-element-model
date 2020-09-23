<template>
  <div class="order-box clearfix auth-inner">
    <!-- <p class="mr"><span class="blue-line">|</span>查询条件</p> -->
    <div class="filter-container searchBox">
      <!-- <el-checkbox-group v-model="listQuery.userAddr">
        <el-checkbox v-for="(item, k) in userAddrOptions" :key="item" :label="k" :value="k"/>
      </el-checkbox-group> -->
      <div>
        <el-input :placeholder="$t('table.userName')" v-model.trim="listQuery.name" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-select :placeholder="$t('table.roleName')" v-model.trim="listQuery.roleCode" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
          <el-option v-for="(item) in roleNameCodeOptions" :key="item.roleCode" :label="item.roleName" :value="item.roleCode"/>
        </el-select>
        <el-button v-waves :disabled="isDisable" class="filter-item" type="primary" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
        <el-button v-waves class="filter-item" type="primary" @click="handleReset">
          {{ $t('table.reset') }}
        </el-button>
      </div>
    </div>
    <!-- <p class="mr"><span class="blue-line">|</span>查询结果</p> -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :header-cell-style="{background: '#204060', color: 'white'}"
      border
      fit
      highlight-current-row
      height="calc(100vh - 140px)"
      style="min-width:100%"
      @sort-change="sortChange">
      <el-table-column :label="$t('table.id')" prop="id" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }} </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.userName')" prop="userName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }} </span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.accountProperty')" prop="roleName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountProperty | accountPropertyFilter }} </span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('table.roleName')" prop="roleName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleNames | roleNamesFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialogFunction(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" style="text-align:right">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-col>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.userName')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('table.accountProperty')" prop="accountProperty">
          <el-checkbox-group v-model="temp.accountProperty">
            <el-checkbox v-for="(item, k) in userAddrOptions" :key="item" :label="k" :value="k"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('table.roleName')" prop="roleName">
          <el-checkbox-group v-model="temp.roleCodes">
            <el-checkbox v-for="(item, k) in userAddrOptions" :key="item" :label="k" :value="k"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('table.available')" prop="available">
          <el-switch v-model="temp.available" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="openDialog">
      <el-form :model="form">
        <el-form-item label-width="120px" label="用户名">
          {{ form.name }}
        </el-form-item>
        <el-form-item label-width="120px" label="账户属性">
          {{ form.accountProperty }}
        </el-form-item>
        <el-form-item label-width="120px" label="角色">
          <el-select :placeholder="$t('table.roleName')" v-model.trim="form.roleCode" multiple clearable style="width: 200px;" class="filter-item">
            <el-option v-for="(item) in roleNameCodeOptions" :key="item.roleCode" :label="item.roleName" :value="item.roleCode"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDialog = false, form.name = '', form.accountProperty = '', form.roleCode = []">取 消</el-button>
        <el-button type="primary" @click="openDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, createUser, updateUser, deleteUser } from '@/api/user'
// import { fetchAllRoleList } from '@/api/role'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: 'danger',
        true: 'success'
      }
      return statusMap[status]
    },
    dateFilter(time) {
      // const d = new Date(time)
      // const times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      // return times
      return time.replace('T', ' ').replace('.000+0800', '').replace('.000+0000', '')
    },
    accountPropertyFilter(status) {
      const accountPropertyMap = {
        'ADMIN_ACCOUNT': '管理员账户',
        'BUSINESS_ACCOUNT': '业务人员账户',
        'NO_ATTRIBUTE_ACCOUNT': '无属性账户'
      }
      return accountPropertyMap[status]
    },
    roleNamesFilter(roleNames) {
      if (roleNames) {
        return roleNames.filter((v) => {
          if (v != null) {
            return v
          }
        }).join(',')
      }
    },
    statusZhFilter(status) {
      const statusZhMap = {
        false: '禁用',
        true: '启用'
      }
      return statusZhMap[status]
    }
  },
  data() {
    return {
      form: {
        name: '',
        accountProperty: '',
        roleCode: [],
        userCode: '',
        roleName: '',
        systemId: 10
      },
      openDialog: false,
      tableKey: 0,
      listLoading: false,
      isDisable: false,
      list: null,
      total: 0,
      listQuery: (() => {
        return localStorage.getItem('internalUserListQuery') ? JSON.parse(localStorage.getItem('internalUserListQuery')) : {
          page: 1,
          limit: 20,
          userCode: '',
          name: '',
          customCode: '',
          available: '',
          roleName: '',
          accountProperty: []
        }
      })(),
      availableOptions: { '启用': true, '禁用': false },
      roleNameCodeOptions: [],
      // roleNameCodeOptions: {
      //   '超级管理员': 'SUPER_ADMIN',
      //   '管理员': 'ADMIN',
      //   '销售': 'SELL',
      //   '运营': 'OPERATION',
      //   '营运规划': 'PLANNING',
      //   '财务': 'FINANCIAL'
      // },
      userAddrOptions: {
        '管理员账户': 'ADMIN_ACCOUNT',
        '业务人员账户': 'BUSINESS_ACCOUNT',
        '无属性账户': 'NO_ATTRIBUTE_ACCOUNT'
      },
      temp: {
        id: undefined,
        name: '',
        accountProperty: [],
        roleCodes: '',
        available: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [{ required: true, message: '用户名为必填项', trigger: 'change' }],
        roleCodes: [{ required: true, message: '用户角色为必选项', trigger: 'change' }]
      },
      visibleDel: false
    }
  },
  watch: {
    listQuery: {
      handler: (val) => {
        if (window.localStorage) {
          localStorage.setItem('internalUserListQuery', JSON.stringify(val))
        }
      },
      deep: true
    }
  },
  created() {
    // 获取所有角色
    this.getAllRole()
    // 获取数据
    this.getList()
  },
  methods: {
    openDialogFunction(row) {
      this.form.name = row.userName
      this.form.userCode = row.userCode
      this.form.roleCode = row.roleCodes
      this.form.accountProperty = row.accountProperty
      this.openDialog = true
    },
    async openDialogConfirm() {
      console.log(this.form, 'jinruzheli')
      const params = {
        userCode: this.form.userCode,
        roleCode: this.form.roleCode,
        systemId: this.form.systemId
      }
      try {
        await this.$api.setROle1(params)
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.openDialog = false
        this.form = {
          name: '',
          accountProperty: '',
          roleCode: [],
          userCode: '',
          roleName: '',
          systemId: 10
        }
        this.getList()
      } catch (e) {
        this.$message.error('操作失败')
      }

      // const params = JSON.stringify(this.form)s
    },
    // 获取所有角色信息
    async getAllRole() {
      if (!localStorage.getItem('internalUserListAllRoleList')) {
        const res = await this.$api.fetchAllRoleList()
        if (res.data.list) {
          res.data.list.forEach((v) => {
            this.roleNameCodeOptions.push({ roleName: v.roleName, roleCode: v.roleCode })
          })
          localStorage.setItem('internalUserListAllRoleList', JSON.stringify(this.roleNameCodeOptions))
        }
      } else {
        this.roleNameCodeOptions = JSON.parse(localStorage.getItem('internalUserListAllRoleList'))
      }
    },
    // 获取列表
    async getList() {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 500)
      this.listLoading = true
      // this.getProperty(this.listQuery.userAddr)
      delete this.listQuery['userAddr']
      this.listQuery.accountProperty = ['NO_ATTRIBUTE_ACCOUNT', 'BUSINESS_ACCOUNT', 'ADMIN_ACCOUNT']
      try {
        const res = await this.$api.userFetchList(this.listQuery)
        this.list = res.data.list
        this.total = res.data.total
        console.log(res)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      } catch (e) {
        console.log(e, 'getListError')
        this.listLoading = false
      } finally {
        this.listLoading = false
      }
    },
    // getProperty(attr) {
    //   this.listQuery.accountProperty = []
    //   if (attr.length === 0) {
    //     return
    //   }
    //   for (const a of attr) {
    //     this.listQuery.accountProperty.push(this.userAddrOptions[a])
    //   }
    // },
    // 重新刷新页面
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置
    handleReset() {
      this.resetSearchItem()
      // this.getList()
    },
    // 排序
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    // 情况搜索项
    resetSearchItem() {
      this.listQuery.page = 1
      this.listQuery.name = undefined
      this.listQuery.roleName = undefined
      this.listQuery.roleCode = undefined
      this.listQuery.accountProperty = []
    },
    // 新建数据模板
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        roleCode: undefined,
        roleName: undefined,
        createTime: undefined,
        available: true
      }
    },
    // 隐藏新建
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log(this.$refs['dataForm'])
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新建数据
    createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          await this.$api.createUser(this.temp)
          // 直接在页面显示插入的数据
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 更新数据
    updateData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          console.log('update')
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          await this.$api.updateUser(tempData)
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    // 更新数据
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 删除数据
    handleDelete(row) {
      this.$confirm(
        '确定要删除吗',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        const requestData = {
          id: row.id
        }
        const res = await this.$api.deleteUser(requestData)
        console.log(res.data.code)
        if (res.data.code === 200) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          // clear item
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        } else {
          this.$message({
            type: 'info',
            message: res.message || '删除失败'
          })
        }
      })
    },

    // 更新状态
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    }
  }
}
</script>

<style scoped>
.order-box {
  display: block;
  width:100%;
  padding: 15px 40px;
}
.el-divider{
  margin: 15px 0
}
 .blue-line{
    width: 15px;
    font-weight: 900;
    color: blue;
    display: inline-block;
  }
  .mr{
    margin: 10px 0;
  }
</style>
