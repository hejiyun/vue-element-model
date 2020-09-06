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
      :width="item.width || ''"
      align="center">
      <template slot-scope="scope">
        <slot v-if="item.operation" :row="scope.row" :name="item.prop"/>
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
      handler: function(v, o) {
        console.log(v, o)
        this.getData()
      }
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
      // 合并行, 判断的变量值, 需要提供针对合并的属性
      if (this.Config.mergeTable) {
        this.dealTable(this.Config.tableData)
      }
    },
    changeCellStyle(data) {
      const arr = this.Config.changeCell
      let color = ''
      if (this.Config.changeCellColor && data.row[data.column.property] > 0) {
        color = `${this.Config.changeCellType}:` + this.Config.changeCellColor
      }
      // 如果需要改变的是列的颜色, 传入changeCellType: background,   默认为color模式.
      for (let i = 0; i < arr.length; i++) {
        if (data.columnIndex === arr[i]) {
          return color
        }
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
            if (i === typeData.length - 1) {
              typeIndex.push(typeData.length) // 类型循环完成后把数据长度存起来
            }
            for (var k in v) {
              if (k !== this.mergeTable) {
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
      this.Config.tableData = getDate
    },
    // 表格合并方法,
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 设置判断条件columnIndex ,用于指定合并列数的开始位置和结束位置
      if (this.Config.mergeTableColumnIndex.length === 1) {
        if (columnIndex > this.Config.mergeTableColumnIndex[0]) {
          if (row.nameIndex) {
            return [row.nameIndex, 1]
          } else return [0, 0]
        }
      } else {
        if (columnIndex < this.Config.mergeTableColumnIndex[1] && columnIndex > this.Config.mergeTableColumnIndex[0]) {
          if (row.nameIndex) {
            return [row.nameIndex, 1]
          } else return [0, 0]
        }
      }
    }
  }
}
</script>
