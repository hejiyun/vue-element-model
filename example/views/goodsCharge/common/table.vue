<template>
  <!--表格-->
  <el-table
    :data="tableObj.dataList"
    :height="height?height:'calc(100vh - 220px)'"
    border
    fit
    class="bwtable"
    @selection-change="handleSelectionChange">
    <el-table-column v-if="tableObj.selection" type="selection"/>
    <el-table-column
      v-for="(item, index) in tableObj.labelArr"
      :key="index"
      :show-overflow-tooltip="true"
      :label="item.label"
      :width="item.width?item.width:'auto'"
      :min-width="150"
      align="center">
      {{ item }}
      <template
        slot-scope="scope">
        <p v-if="item.type==1">
          <span>{{ scope.row[item.key] }}</span>
        </p>
        <p v-if="item.type==2">
          <el-button
            type="text"
            size="small"
            @click="dealOption(scope.row,'cellType1')">{{ item.btnName1 }}</el-button>
        </p>
        <p v-if="item.type==3">
          <el-button
            type="text"
            size="small"
            @click="dealOption(scope.row,'cellType2')">{{ item.btnName1 }}</el-button>
          <el-button
            type="text"
            size="small"
            @click="dealOption(scope.row,'cellType3')">{{ item.btnName2 }}</el-button>
        </p>
        <p v-if="item.type==4">
          <el-button
            type="text"
            size="small"
            @click="dealOption(scope.row,'cellType4')">{{ item.btnName1 }}</el-button>
          <br>
          <el-button
            type="text"
            size="small"
            @click="dealOption(scope.row,'cellType5')">{{ item.btnName2 }}</el-button>
        </p>
        <p v-if="item.type==5">
          <el-button
            type="text"
            size="small"
            @click="dealOption(scope.row,'cellType6')">{{ scope.row[item.key] }}</el-button>
        </p>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
// import tableConfig from './config.js'
export default {
  props: {
    tableObj: {
      type: Object,
      default: () => {}
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      multipleSelection: []
    }
  },
  mounted() {
    console.log(this.tableObj, this.height, 888)
  },
  methods: {
    dealOption(data, type) {
      this.$emit('cellClick', data, type)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('rowCheckBox', val)
    }
  }
}
</script>
