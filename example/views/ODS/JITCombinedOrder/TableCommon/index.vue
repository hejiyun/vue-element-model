<template>
  <el-table
    ref="multipleTable"
    :data="tableList"
    :cell-style="changeCell ? changeCellStyle : ''"
    :height="`calc(100vh - ${height}px)`"
    :header-cell-style="{background: '#204060', color: 'white', padding: '6px 0'}"
    :span-method="hasChild ? arraySpanMethod : function() {}"
    border
    tooltip-effect="dark"
    style="width: 100%; box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1);"
    @sort-change="getSortList"
    @selection-change="handleSelectionChange">
    <el-table-column
      v-if="checkFlag"
      type="selection"
      width="55"/>
    <el-table-column
      v-for="(item, index) in tableHeader"
      :prop="item.prop"
      :label="item.label"
      :show-overflow-tooltip="item.showOverFlowTooltip"
      :key="index"
      :fixed="item.fixed"
      :sortable="item.sort"
      :width="item.width || null"
      align="center">
      <template slot-scope="scope">
        <router-link v-if="item.link && (scope.row['bizType'] === 'B2B_RECEIVE' || scope.row['bizType'] === 'B2B_DISPATCH')" :to="{path: `${item.to}/${scope.row[item.prop]}`}" style="margin-left: 10px; border-bottom: 1px solid">{{ scope.row[item.prop] }}</router-link>
        <router-link v-else-if="item.link && (scope.row['bizType'] !== 'B2B_RECEIVE' || scope.row['bizType'] !== 'B2B_DISPATCH') && item.prop !== 'orderNo'" :to="{path: `${item.to}/${scope.row[item.prop]}`}" style="margin-left: 10px; border-bottom: 1px solid">{{ scope.row[item.prop] }}</router-link>
        <router-link v-else-if="item.link && (scope.row['bizType'] === 'ALLOCATE_RECEIVE' || scope.row['bizType'] === 'ALLOCATE_DISPATCH') && item.prop === 'orderNo'" :to="{path: `${item.to1}/${scope.row[item.prop]}`}" style="margin-left: 10px; border-bottom: 1px solid">{{ scope.row[item.prop] }}</router-link>
        <span v-else style="margin-left: 10px">{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="tableButton" :width="tableButtonWidth" fixed="right" align="center" label="操作">
      <template slot-scope="scope">
        <slot :rowData="scope" name="btn"/>
        <el-button
          v-if="hasChild"
          size="mini"
          type="danger"
          @click="removeOrder(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column
      v-if="remark"
      prop="remark"
      label="备注"
      width="140"/>
  </el-table>
</template>

<script>
export default {
  name: 'TableCommon',
  props: {
    tableHeader: {
      type: Array,
      default: function() {
        return []
      }
    },
    tableButton: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    checkFlag: {
      type: Boolean,
      default: false
    },
    remark: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: null
    },
    tableButtonFixed: {
      type: String,
      default: null
    },
    tableButtonWidth: {
      type: Number,
      default: 240
    },
    showOverFlowTooltip: {
      type: Boolean,
      default: false
    },
    changeCell: {
      type: Array,
      default: function() {
        return []
      }
    },
    changeCellColor: {
      type: String,
      default: 'red'
    },
    changeCellType: {
      type: String,
      default: 'color'
    },
    changeRowColor: {
      type: String,
      default: ''
    },
    changeRow: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      multipleSelection: [],
      saveTable: [],
      tableList: this.tableData,
      hasChild: false
    }
  },
  watch: {
    tableData: {
      handler(newVal) {
        this.tableList = newVal
        this.getData()
      },
      deep: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getSortList(column) {
      this.$emit('getSortList', column)
    },
    getData() {
      this.tableList.map(item => {
        for (var k in item) {
          if (item[k] instanceof Array && item[k].length) {
            item['productIdList'] = item[k]
            delete item[k]
            this.hasChild = true
          }
        }
      })
      if (this.hasChild) {
        this.saveTable = this.tableList
        this.dealTable(this.tableList)
      }
    },
    changeCellStyle(data) {
      const arr = this.changeCell
      let color = ''
      if (this.changeCellColor && (data.row[data.column.property] === '是' || data.row[data.column.property] > 0)) {
        color = `${this.changeCellType}:` + this.changeCellColor
      }
      // 如果需要改变的是列的颜色, 传入changeCellType: background,   默认为color模式.
      for (let i = 0; i < arr.length; i++) {
        if (data.columnIndex === arr[i]) {
          return color
        }
      }
    },
    changeRowStyle(data) {
      const arr = this.changeRow
      let color = ''
      if (this.changeRowColor) {
        color = 'background:' + this.changeRowColor
      } else {
        color = 'background:#e6a23c'
      }
      for (let i = 0; i < arr.length; i++) {
        if (data.rowIndex === arr[i]) {
          return color
        }
      }
    },
    handleEdit(index, row) {
      this.$emit('handleEdit', index, row)
    },
    handleDelete(index, row) {
      this.$emit('handleDelete', index, row)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('selectionChange', this.multipleSelection)
    },
    // 处理表格数据
    dealTable(table) {
      const getDate = [] // 存储新表格数据
      const typeIndex = [0] // 保存id,订单需要合并的值
      table.forEach((v, index) => {
        if (v.productIdList && v.productIdList.length) {
          v.productIdList.forEach((subV, i, typeData) => {
            if (i === typeData.length - 1) {
              typeIndex.push(typeData.length) // 类型循环完成后把数据长度存起来
            }
            for (var k in v) {
              if (k !== 'productIdList') {
                subV[k] = v[k]
              }
            }
            getDate.push(subV)
          })
        }
      })
      let t = 0
      typeIndex.forEach((v, i, typeArr) => {
        if (typeArr[i + 1]) {
          getDate[t].nameIndex = typeArr[i + 1]
          t += typeArr[i + 1]
        }
      })
      this.tableList = getDate
    },
    // 表格合并方法
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 设置判断条件columnIndex ,用于指定合并列数
      if (columnIndex !== 11 && columnIndex !== 12 && columnIndex !== 13) {
        if (row.nameIndex) {
          return [row.nameIndex, 1]
        } else return [0, 0]
      }
    },
    // 移除
    removeOrder(rowIndex, row) {
      // 在原始数据中删除
      this.saveTable.some((item, index, arr) => {
        if (item.productIdList && item.productIdList.length) {
          item.productIdList.some((subItem, subIndex) => {
            if (subItem.productId === row.productId) {
              arr[index].productIdList.splice(subIndex, 1)
              // 删除后重新处理数据
              this.dealTable(arr)
              return true
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .headerClass {
    background-color: red;
    height: 80px;
    color: red
  }
  .tableColor{
    color: black
  }
</style>
