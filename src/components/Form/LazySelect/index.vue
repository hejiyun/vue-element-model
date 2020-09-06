<template>
  <el-col class="p-box">
    <el-input ref="lazyInput" v-model="value" @focus="showDrap = true;count++;" @blur="shouldHide" />
    <div v-show="showDrap" class="select-drap-box" @click="focusInput" @mouseenter="count++" @mouseleave="shouldHide">
      <el-row class="select-drap-header">
        <el-col :span="8"><span @click="allSelect"><i class="el-icon-finished"/>全选</span></el-col>
        <el-col :span="8"><span @click="reset"><i class="el-icon-full-screen p-i"><span class="p-aX">×</span></i>清空</span></el-col>
        <el-col :span="8"><span @click="showSelect"><i class="el-icon-view"/>已选</span></el-col>
      </el-row>
      <el-row class="select-drap-search">
        <el-input
          v-model="searchValue"
          clearable
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          @focus="cFocus"
          @blur="count--; $refs.lazyInput.focus()"
          @input="reRenderLi"/>
      </el-row>
      <el-row class="select-drap-list">
        <el-row class="select-drap-list-header">
          <el-col :span="8">仓库代码</el-col>
          <el-col :span="8">仓库名称</el-col>
          <el-col :span="8">仓库类型</el-col>
        </el-row>
        <ul>
          <li v-for="o in 7" :key="o">
            <el-row class="select-drap-list-header p-li">
              <el-checkbox v-model="checked" class="p-li-check"/>
              <el-col :span="8"><span title="仓库代码qweqwewqewqewqewqeqweqweqwewqe">仓库代码qweqwewqewqewqewqeqweqweqwewqe</span></el-col>
              <el-col :span="8">仓库名称</el-col>
              <el-col :span="8">仓库类型</el-col>
            </el-row>
          </li>
        </ul>
      </el-row>
    </div>
  </el-col>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      searchValue: '',
      showDrap: false,
      count: 0,
      checked: false,
      noFocus: true
    }
  },
  methods: {
    stopPropagation(e) {
      e = e || window.event;
      if (e.stopPropagation) { // W3C阻止冒泡方法
        e.stopPropagation();
      } else {
        e.cancelBubble = true; // IE阻止冒泡方法
      }
    },
    cFocus() {
      this.count++
      this.noFocus = false
    },
    focusInput() {
      if (this.noFocus) {
        this.$refs.lazyInput.focus()
      } else {
        this.noFocus = true
      }
    },
    shouldHide() {
      this.count--
      if (this.count === 0) {
        this.showDrap = false
      }
    },
    allSelect() {
      console.log('全选')
    },
    reset() {
      // 给出二次确认提示框
      console.log('全部清空')
    },
    showSelect() {
      console.log('展示已选选项, 并提供清除功能')
    },
    reRenderLi(value) {
      console.log('重新渲染li列表', value)
    }
  }
}
</script>
<style lang="scss" scoped>
.p-box {
  position: relative;
  width: 100%;
  height: 30px;
  .select-drap-box {
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow:0 0 0 2px rgba(51,153,255,.2)
  }
  .select-drap-header {
    margin: 10px 0;
    height: 30px;
    font-size: 18px;
    text-align: center;
    line-height: 30px;
    color: #999;
    .el-col >span {
      cursor: pointer;
    }
   i {
    margin-right: 10px;
   }
    .p-i {
    position: relative;
      .p-aX {
        position: absolute;
        top:0;
        left: 15%;
      }
    }
  }
  .select-drap-search {
     padding: 0 25px
  }
  .select-drap-list > ul {
    height: 200px;
    padding-left:8px;
    overflow-y: auto;
    overflow-x: hidden;
    li {
      list-style-type:none;
    }
  }
  .select-drap-list-header {
    text-align: center;
    .el-col {
      cursor: context-menu;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden
    }
  }
  .p-li {
    position: relative;
    .el-col:nth-child(2) {
      padding-left: 20px
    }
    .p-li-check {
      position: absolute;
      top:0;
      left: 0;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
