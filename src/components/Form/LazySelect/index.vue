<template>
  <el-col class="p-box">
    <el-input ref="lazyInput" v-model="value" readonly @focus="showDrap = true;count++;" @blur="shouldHide" />
    <div v-show="showDrap" :style="`width:${Titem.width}px`" class="select-drap-box" @click="focusInput" @mouseenter="count++" @mouseleave="shouldHide">
      <el-row class="select-drap-header">
        <el-col :span="6"><span @click="allSelect"><i class="el-icon-finished"/>全选</span></el-col>
        <el-col :span="6"><span @click="allCancel"><i class="el-icon-refresh-left"/>反选</span></el-col>
        <el-popover
          v-model="visible"
          placement="bottom"
          width="160"
          @show="count++"
          @hide="hideTest">
          <p>确定要清空已选择选项吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="reset">确定</el-button>
          </div>
          <el-col slot="reference" :span="6">
            <span><i class="el-icon-full-screen p-i"><span class="p-aX">×</span></i>清空</span>
          </el-col>
        </el-popover>
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
              <el-checkbox v-model="child['checked']" class="p-li-check" @change="checkChange($event, child)"/>
              <el-col v-for="e in Titem.optionHeader" :span="24 / Titem.optionHeader.length" :key="child[e.split('/')[1]]">
                <span :title="child[e.split('/')[1]]">
                  {{ child[e.split('/')[1]] || '无' }}
                </span>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-row>
      <Dialog :showDialog.sync="dialog" :header="Titem.optionHeader" :data="selectList" @close="dialogClose"/>
    </div>
  </el-col>
</template>
<script>
import jsMixin from './index'
import Dialog from './Dialog'
export default {
  components: {
    Dialog
  },
  mixins: [jsMixin]
}
</script>
<style lang="scss" scoped>
 @import "./index.scss";
</style>
