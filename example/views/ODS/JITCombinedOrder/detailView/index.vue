<!--详情-->
<template>
  <div>
    <el-row>
      <el-col v-for="(element,index) in options" :key="index" :span="element.span || widthSpan" class="detail-col det">
        <!--第一个span,显示字段标题label-->
        <el-col :span="element.span ? (8 / (element.span / widthSpan)): 8" class="information-title">
          <el-tooltip :content="element.label" class="item" effect="light" placement="bottom">
            <span style="font-size:14px;color:black;"> {{ element.label }}</span>
          </el-tooltip>
        </el-col>
        <!--第二个span,显示字段key对应传入对象的字段, 并且加判断语句,判断显示时需要修改字段状态的情况-->
        <el-col :span="element.span ? null : 16" style="color:black;" class="information-title">
          <el-tooltip v-if="!element.type" :disabled="data[element.key] && data[element.key].length < 11" :content="data[element.key]" class="item" effect="light" placement="top-start">
            <span> {{ data[element.key] }}</span>
          </el-tooltip>
          <span v-else-if="!element.type && !element.tooltip">{{ data[element.key] }}</span>
          <!--如果是时间, 截取掉时分秒-->
          <span v-else-if="element.type==='date'">{{ data[element.key] ? data[element.key].substring(0, 11) : '' }}</span>
          <!--如果是单选, 转为是否-->
          <span v-else-if="element.type==='radio'">{{ data[element.key] ? '是' : '否' }}</span>
          <!-- 如果是数组，显示第一个， 其他的以更多的形式显示-->
          <span v-else-if="element.type==='arr'">{{ data[element.key] ? data[element.key][0] : '' }}
            <el-tooltip v-if="data[element.key] && data[element.key].length > 1" :disabled="data[element.key].length === 1" placement="bottom" effect="light">
              <div slot="content">
                <p v-for="(item, index) in data[element.key]" :key="index"> {{ item }}</p>
              </div>
              <span style="text-decoration:underline; color: #1e6abc">更多</span>
            </el-tooltip>
          </span>
          <!--如果是带链接的数组-->
          <router-link v-else-if="element.type==='arrLink'" :to="{ path: `${element.to}/${data[element.key][0]}`}" style="text-decoration:underline">{{ data[element.key] ? data[element.key][0] : '' }}
            <el-tooltip v-if="data[element.key] && data[element.key].length > 1" :disabled="data[element.key].length === 1" placement="bottom" effect="light">
              <div slot="content">
                <router-link v-for="(item, index) in data[element.key]" v-show="index !== 0" :key="index" :to="{ path: `${element.to}/${item}`}" target="_blank" style="text-decoration:underline"> {{ item }}</router-link>
              </div>
              <span style="text-decoration:underline; color: #1e6abc">更多</span>
            </el-tooltip>
          </router-link>
          <!--如果是带链接的-->
          <span v-else-if="element.type==='link' && (data['bizType'] !== 'B2B_RECEIVE' && data['bizType'] !== 'B2B_DISPATCH') && !element.onlyLink"> {{ data[element.key] }}</span>
          <router-link v-else-if="element.type==='link'" :to="{ path: `${element.to}/${data[element.key]}`}" style="text-decoration:underline;color:blue">
            <span> {{ data[element.key] }}</span>
          </router-link>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'DetailView',
  components: { // 组件
  },
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
    },
    widthSpan: {
      type: Number,
      default: 6
    }
  },
  data: function() { // 初始化数据
    return {
      data1: {}
    }
  },
  watch: {
  },
  created() {
    this.options.forEach((item) => {
      this.$set(this.data, item.key, '')
    })
    for (const k in this.data) {
      if (this.data[k] === 0 || this.data[k]) {
        this.data[k] = this.data[k]
      } else {
        this.data[k] = ''
      }
    }
  },
  mounted() {
    this.options.map((v, i) => {
      if (v.defaultValue) {
        this.$set(this.data, v.key, v.defaultValue)
      }
    })
  },
  methods: { // 方法
  }
}
</script>
<style scoped>
.detail-col {
  margin: 0px 0 5px 0;
}
.detail-col span {
    font-size: 13px
  }
  a{
    font-size: 13px
  }

  .information-title {
  color: #19d3ea;
  font-size: 18px;  /*一定要设置宽度，或者元素内含的百分比*/
  overflow: hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/
  }
</style>
