<!--详情-->
<template>
  <div class="flex-box detail-view">
    <div v-for="(element,index) in options" :key="index" class="flex-box">
      <!--第一个span,显示字段标题label-->
      <div class="information-title text-left" >
        <span> {{ element.label + ':' }}</span>
      </div>
      <!--第二个span,显示字段key对应传入对象的字段, 并且加判断语句,判断显示时需要修改字段状态的情况-->
      <div class="information-title">
        <!-- 插槽, 允许自定义插入内容, name为父组件中定义插入template名称 使用slot属性插入 -->
        <el-tooltip :content="data[element.key]" class="item" effect="light" placement="bottom-start">
          <slot v-if="element.operation" :item="element" :name="element.key"/>
          <span v-else-if="element.radio">{{ data[element.key] ? '是' :'否' }}</span>
          <span v-else>{{ data[element.key] }}</span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DetailView',
  props: {
    options: {
      type: Array,
      default: function() {
        return []
      }
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  }
}
</script>
<style lang="scss">
.flex-box.detail-view {
  display: flex;
  flex-wrap: wrap;
  .flex-box {
    margin-right: 3px;
    display: flex;
    flex-wrap: wrap;
    font-weight: 500;
  }
  .text-left {
    text-align: left;
  }
  .information-title {
    color: black;
    width: 130px;
    font-size: 16px;  /*一定要设置宽度，或者元素内含的百分比*/
    overflow: hidden; /*溢出的部分隐藏*/
    white-space: nowrap; /*文本不换行*/
    text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/
    }
}
</style>
