<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="55%"
    @close="handleClose">
    <el-row class="select-drap-list">
      <el-table
        :data="selectList"
        border
        height="400px"
        style="width: 100%">
        <el-table-column
          v-for="(item,index) in header"
          :prop="item.split('/')[1]"
          :label="item.split('/')[0]"
          :key="index"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="!scope.row['del']" style="color:red" type="text" size="small" @click="handleClick(scope.row, 'D')">删除</el-button>
            <el-button v-if="scope.row['del']" type="text" size="small" @click="handleClick(scope.row, 'R')">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <span style="textAlign:right; color:red;">当前删除项：{{ leng }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="comfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    header: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog,
      selectList: []
    };
  },
  computed: {
    leng: function() {
      return this.selectList.filter(e => e['del'] === true).length
    },
    delList: function() {
      return this.selectList.filter(e => e['del'] === true)
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    },
    data: {
      handler(v, o) {
        console.log(v, '123')
        this.selectList = JSON.parse(JSON.stringify(v))
      },
      deep: true
    }
  },
  methods: {
    handleClick(row, str) {
      this.$set(row, 'del', str === 'D')
    },
    handleClose(done) {
      this.$emit('update:showDialog', false)
    },
    cancel() {
      this.dialogVisible = false
      this.$emit('close')
    },
    comfirm() {
      this.dialogVisible = false
      this.$emit('close', this.delList)
    }
  }
};
</script>
