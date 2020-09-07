<template>
  <el-col class="p-box">
    <el-input ref="lazyInput" v-model="value" @focus="showDrap = true;count++;" @blur="shouldHide" />
    <div v-show="showDrap" :style="`width:${Titem.width}px`" class="select-drap-box" @click="focusInput" @mouseenter="count++" @mouseleave="shouldHide">
      <el-row class="select-drap-header">
        <el-col :span="6"><span @click="allSelect"><i class="el-icon-finished"/>全选</span></el-col>
        <el-col :span="6"><span @click="allCancel"><i class="el-icon-refresh-left"/>反选</span></el-col>
        <el-col :span="6"><span @click="reset"><i class="el-icon-full-screen p-i"><span class="p-aX">×</span></i>清空</span></el-col>
        <el-col :span="6"><span @click="showSelect"><i class="el-icon-view"/>已选</span></el-col>
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
          <el-col v-for="child in Titem.optionHeader" :span="24 / Titem.optionHeader.length" :key="child">{{ child.split('/')[0] || '' }}</el-col>
        </el-row>
        <ul v-loading="loading">
          <p v-if="fileterList.length === 0" class="text-center">未搜索到数据</p>
          <li v-for="(child, index) in fileterList" v-else :key="index">
            <el-row class="select-drap-list-header p-li">
              <el-checkbox v-model="child['checked']" class="p-li-check"/>
              <el-col v-for="e in Titem.optionHeader" :span="24 / Titem.optionHeader.length" :key="child[e.split('/')[1]]">
                <span :title="child[e.split('/')[1]]">
                  {{ child[e.split('/')[1]] || '无' }}
                </span>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-row>
    </div>
  </el-col>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      value: '',
      searchValue: '',
      showDrap: false,
      count: 0,
      checked: false,
      noFocus: true,
      fileterList: []
    }
  },
  computed: {
    Titem() {
      return Object.assign({
        optionHeader: ['仓库代码/code', '仓库名称/name', '仓库类型/type'],
        width: 350,
        AllList: []
      }, this.item)
    }
  },
  watch: {
    'Titem.AllList': {
      handler: function(v, o) {
        this.Titem.AllList.forEach(e => {
          this.$set(e, 'checked', false)
        })
        this.fileterList = v
      }
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
      // 需要考虑连续点击全选时的动作
      // 使用$set
      console.log('全选')
    },
    allCancel() {
      // 需要考虑连续点击全取消时的动作
      // 使用$set
      console.log('全取消')
    },
    reset() {
      // 给出二次确认提示框,需要考虑连续点击清空时的动作
      console.log('全部清空')
    },
    showSelect() {
      // 使用$set
      console.log('展示已选选项, 并提供清除功能')
    },
    reRenderLi(value) {
      this.loading = true
      if (value.trim() !== '') {
        setTimeout(() => {
          this.loading = false
          this.fileterList = this.Titem.AllList.filter(item => {
            for (var i = 0; i < this.Titem.optionHeader.length; i++) {
              if (item[(this.Titem.optionHeader[i].split('/')[1])].toLowerCase().indexOf(value.toLowerCase()) > -1) {
                return item
              }
            }
          })
        }, 200)
      } else {
        this.loading = false
        this.fileterList = this.Titem.AllList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.p-box {
  position: relative;
  width: 100%;
  height: 30px;
  z-index:100;
  .select-drap-box {
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color:white;
    box-shadow:0 0 0 2px rgba(51,153,255,.2);
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
    .el-col > span:hover {
      color: #409EFF
    }
   i {
    margin-right: 10px;
   }
    .p-i {
    position: relative;
      .p-aX {
        position: absolute;
        top:-1px;
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
    .text-center {
      text-align: center;
    }
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
