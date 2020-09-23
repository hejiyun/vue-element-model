<template>
  <div class="add-role">
    <HtmlPage ref="targetPage" :page-config="config">
      <template v-slot:searchBar>
        <el-button type="primary" @click="dialogVisible = true">新增资源</el-button>
        <SelectC :item="searchOptions" @updateValue="updateValue($event, searchOptions.prop)"/>
        <el-button type="primary" @click="search">查询</el-button>
      </template>
      <template v-slot:table-btn="scope">
        <el-button type="text" @click="openSetRoleDialog(scope.row)">编辑</el-button>
        <el-popconfirm
          title="确定要删除吗？"
          @onConfirm="del(scope.row)"
        >
          <el-button slot="reference" type="text">删除</el-button>
        </el-popconfirm>
      </template>
    </HtmlPage>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="编辑新增资源"
      width="80%">
      <el-radio-group v-model="radio">
        <el-radio :label="6">菜单级</el-radio>
        <el-radio :label="9">接口级</el-radio>
      </el-radio-group>
      <div class="relative">
        <el-table
          ref="muTable"
          :data="channelData"
          :header-cell-style="{ background: '#204060', color: 'white' }"
          stripe
          border
          height="auto"
          class="wh80">
          <el-table-column
            prop="resourceName"
            label="权限名">
            <template slot-scope="scope">
              <el-input v-model="scope.row.resourceName" placeholder="请输入内容"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="resourceCode"
            label="ResourceCode">
            <template slot-scope="scope">
              <el-input v-model="scope.row.resourceCode" placeholder="请输入内容"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="radio === 9"
            prop="url"
            label="URL">
            <template slot-scope="scope">
              <el-input v-model="scope.row.url" placeholder="请输入内容"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="parentID"
            label="ParentID">
            <template slot-scope="scope">
              <el-input v-model="scope.row.parentId" placeholder="请输入内容"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="资源描述">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" type="textarea" placeholder="请输入内容" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button v-if="channelData.length !== 1" type="text" size="small" @click="delRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" class="absolute" icon="el-icon-circle-plus-outline" @click="addRow"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfim">确 定</el-button>
      </span>
    </el-dialog>
    <DialogBox
      :dialog-config="DialogConfig"
      :show-dialog.sync="showDialog"
      @DialogConfirm="editSubmit"/>
  </div>
</template>
<script>
import HtmlPage from '@component/pageModule/listCommon'
import { config, DialogConfig, searchOptions } from '@base/module_role/addRole'
import { setResource, editRole } from '@/axios/module_role/addRole'
import { SelectC } from '@component/Form/ExportItem.js'
import DialogBox from '@common/DialogBox'
export default {
  name: 'AddRole',
  components: {
    HtmlPage,
    DialogBox,
    SelectC
  },
  data() {
    return {
      config: config, // 页面配置
      DialogConfig: DialogConfig, // 设置角色弹窗
      showDialog: false,
      form: {},
      searchOptions: searchOptions,
      radio: 6,
      currentRow: {},
      dialogVisible: false,
      creator: this.$store.getters.name,
      channelData: [{ // 指定渠道table表格变量
        id: 1,
        resourceName: '',
        resourceCode: '',
        url: '',
        parentId: '',
        remark: '',
        systemId: 10
      }]
    }
  },
  beforeUpdate() {
    if (this.dialogVisible) {
      this.$nextTick(() => {
        // 在数据加载完，重新渲染表格,去除因重新计算高度导致的上下抖动问题
        this.$refs['muTable'].doLayout()
      })
    }
  },
  methods: {
    updateValue(event, name) {
      this.$set(this.form, name, event)
    },
    search() {
      this.$refs.targetPage.getList(this.form)
    },
    async del(row) {
      const params = JSON.parse(JSON.stringify(row))
      params['disable'] = true
      await editRole(params)
      this.$message.success('删除资源成功')
      this.$refs.targetPage.getList(this.form)
    },
    openSetRoleDialog(row) {
      this.showDialog = true
      this.DialogConfig.options.forEach(item => {
        if (row.hasOwnProperty(item.prop)) {
          this.$set(item, 'setDefaultValue', row[item.prop])
        }
      })
      this.currentRow = row
    },
    async editSubmit(event) {
      console.log(event)
      const params = { ...this.currentRow, ...event }
      await editRole(params)
      this.$message.success('修改资源成功')
      this.showDialog = false
      this.$refs.targetPage.getList(this.form)
    },
    // 增加关闭指定渠道占库弹窗方法
    handleClose(done) {
      const that = this
      this.$confirm('确认关闭？')
        .then(_ => {
          that.channelData = [{
            id: 1,
            reamrk: '',
            resourceCode: '',
            url: '',
            parentId: '',
            resourceName: '',
            systemId: 10
          }]
          done()
        })
        .catch(_ => {})
    },
    addRow() {
      this.channelData.map((item, index) => {
        item.id = index + 1
      })
      const newRow = {
        id: this.channelData.length + 1,
        reamrk: '',
        resourceCode: '',
        url: '',
        parentId: '',
        resourceName: '',
        systemId: 10
      }
      this.channelData.push(newRow)
    },
    delRow(row) {
      this.channelData = this.channelData.filter(item => item.id !== row.id)
    },
    async submitConfim() {
      const params = {
        userCode: this.creator,
        list: this.channelData
      }
      await setResource(params)
      this.$message({
        message: '新增成功',
        type: 'success'
      })
      this.dialogVisible = false
      this.channelData = [{
        id: 1,
        reamrk: '',
        resourceCode: '',
        url: '',
        parentId: '',
        resourceName: '',
        systemId: 10
      }]
      this.$refs.targetPage.getList(this.form)
    }
  }
}
</script>
<style scoped>
  .absolute{
    position: absolute;
    bottom: 10px;
    right: 10px
  }
  .relative{
    position: relative;
  }
</style>
