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
