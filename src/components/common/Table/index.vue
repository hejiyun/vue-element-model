<template>
  <el-table
    ref="multipleTable"
    :data="Config.tableData"
    :cell-style="Config.changeCell ? changeCellStyle : ''"
    :height="`calc(100vh - ${Config.height}px)`"
    :header-cell-style="{ background: '#204060', color: 'white' }"
    :span-method="Config.mergeTable && Config.mergeTableColumnIndex.length ? arraySpanMethod : function() {}"
    border
    @sort-change="getSortList"
    @selection-change="handleSelectionChange">
    <el-table-column v-if="Config.expand" type="expand">
      <template slot-scope="scope">
        <slot :row="scope.row" name="expand"/>
      </template>
    </el-table-column>
    <el-table-column
      v-if="Config.checkFlag"
      type="selection"
      width="55"/>
    <el-table-column
      v-for="(item, index) in Config.tableHeader"
      :prop="item.prop"
      :label="item.label"
      :key="index"
      :fixed="item.fixed"
      :sortable="item.sort"
      :width="item.width || null"
      show-overflow-tooltip
      align="center">
      <template slot-scope="scope">
        <slot v-if="item.operate" :row="scope.row" :name="item.prop"/>
        <span v-else>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'TableCommon',
  props: {
    tableCofig: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      multipleSelection: []
    }
  },
  computed: {
    Config() {
      return Object.assign({
        tableHeader: [],
        expand: false,
        mergeTable: '',
        mergeTableColumnIndex: [],
        tableData: [],
        checkFlag: false,
        height: 0,
        changeCell: [],
        changeCellColor: 'red',
        changeCellType: 'color'
      }, this.tableCofig)
    }
  },
  watch: {
    'Config.tableData': {
      handler: function() {
        this.getData()
      }
    }
  },
  created() {
    this.getData()
  },
  beforeUpdate() {
    this.$nextTick(() => {
      // 在数据加载完，重新渲染表格,去除因重新计算高度导致的上下抖动问题
      this.$refs['multipleTable'].doLayout();
    })
  },
  methods: {
    getSortList(column) {
      this.$emit('getSortList', column)
    },
    getData() {
      // 合并行, 判断的变量值, 需要提供针对合并的属性
      this.Config.mergeTable && this.dealTable(this.Config.tableData)
    },
    changeCellStyle(data) {
      const arr = this.Config.changeCell
      let color = ''
      if (this.Config.changeCellColor && data.row[data.column.property] > 0) {
        color = `${this.Config.changeCellType}:` + this.Config.changeCellColor
      }
      // 如果需要改变的是列的颜色, 传入changeCellType: background,   默认为color模式.
      for (let i = 0; i < arr.length; i++) {
        return data.columnIndex === arr[i] && color
      }
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
        if (v[this.Config.mergeTable] && v[this.Config.mergeTable].length) {
          v[this.Config.mergeTable].forEach((subV, i, typeData) => {
            i === typeData.length - 1 && typeIndex.push(typeData.length) // 类型循环完成后把数据长度存起来
            for (var k in v) {
              k !== this.Config.mergeTable && (subV[k] = v[k])
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
      this.Config.tableData = getDate
    },
    // 表格合并方法,
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 设置判断条件columnIndex ,用于指定合并列数的开始位置和结束位置
      if (this.Config.mergeTableColumnIndex.length === 1) {
        if (columnIndex > this.Config.mergeTableColumnIndex[0]) {
          if (row.nameIndex) {
            return [row.nameIndex, 1]
          } else {
            return [0, 0]
          }
        }
      } else {
        if (columnIndex < this.Config.mergeTableColumnIndex[1] && columnIndex > this.Config.mergeTableColumnIndex[0]) {
          if (row.nameIndex) {
            return [row.nameIndex, 1]
          } else {
            return [0, 0]
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
.el-table th.is-left {
  background: rgb(81,187,248);
  color:#fff
}
.el-table__body-wrapper {
  height: 400px;
  overflow-y: auto;
}
.el-table td, .el-table th {
  padding:12px !important;
}
.el-table__body-wrapper::-webkit-scrollbar {
  width:6px;
  background: #ebeef5;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #ccc;
  height:120px;
}
.el-table__body-wrapper::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: rgba(255,255,255, 1);
}
body .el-table th.gutter{   /*解决el-table加了gutter后 边框出现白边*/
    display: table-cell!important;
}
.slot::-webkit-scrollbar{
    width: 2px;
}
.slot::-webkit-scrollbar-thumb{
    border-radius: 2px;
    height: 50px;
    background: #eee;
}
.slot::-webkit-scrollbar-track{
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    background: rgba(0,0,0,0.4);
}
body .el-table th.gutter{
  display: table-cell!important;
}
</style>
