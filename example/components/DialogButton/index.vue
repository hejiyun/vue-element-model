<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" @click="openDailog">{{ buttonText }}</el-button>
    <!-- 弹窗 -->
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeClose"
      :width="`${WidthPercent}%`"
      :title="dialogText"
      @close="handleClose">
      <div class="dialog-bar">
        <el-form ref="DialogRuleForm" :model="params" :label-width="`${labelWidth}px`" label-position="left">
          <el-row :gutter="20">
            <div
              v-for="(option, index) in options"
              :key="index"
              style="text-align:center">
              <el-col v-if="option.type==='text'" :span="option.span || 20" class="search-bar-col">
                <!--文本-->
                <el-form-item
                  :label="option.label"
                >
                  <span> {{ params[option.name] }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='select'" :span="option.span || 20" class="search-bar-col">
                <!--下拉选择-->
                <el-form-item
                  :label="option.label"
                  :prop="option.name"
                  :rules="option.rules ? {
                    required: true, message: option.rulesMsg || '请选择对应选项', trigger: 'change'
                } : []">
                  <el-select
                    :disabled="option.disabled"
                    :multiple="option.multiple"
                    v-model="params[option.name]"
                    :placeholder="option.placeholder||'全部'"
                    :filterable="option.filterable"
                    :class="option.className ? `${option.className} width-one-hundred-percent` : 'width-one-hundred-percent'"
                    collapse-tags
                    clearable
                    @change="option.multiple ? selectAll($event, option.options, option.name) : function(){}"
                  >
                    <el-option v-show="option.multiple && option.options.length > 0" label="全部" value="选项0"/>
                    <el-option
                      v-for="(item, index) in option.options"
                      v-if="index < 100"
                      :label="item.label"
                      :value="item.value"
                      :key="index"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='lazySelect'" :span="option.span || 20" class="search-bar-col">
                <!--下拉选择-->
                <el-form-item
                  :label="option.label"
                  :prop="option.name"
                  :rules="option.rules ? {
                    required: true, message: option.rulesMsg || '请选择对应选项', trigger: 'blur'
                } : []">
                  <el-select
                    :disabled="option.disabled"
                    v-model="params[option.name]"
                    :ref="`${option.name}-tags`"
                    :remote-method="(query)=>{remoteMethod(query, option)}"
                    :loading="loading"
                    :placeholder="option.placeholder||'全部'"
                    :class="option.className ? `${option.className} width-one-hundred-percent` : `width-one-hundred-percent`"
                    :multiple="option.multiple"
                    filterable
                    collapse-tags
                    remote
                    clearable
                    reserve-keyword
                    @visible-change="getChangePlaceholder($event, option)"
                    @change="(valueList)=>{valueChange(valueList, option)}">
                    <el-option v-if="!option.noHeader" :disabled="true" value="选项0">
                      <el-checkbox v-if="!option.noCheck" v-model="option.allCheck" class="position-checkBox" @change="(query)=>{ checkTotalSwitch(query, option)}"/>
                      <el-col v-for="(item, index) in (option.optionHeader ? option.optionHeader : ['值', '标题'])" :span="option.optionHeaderWidthSpan || 12" :key="index" class="information-title">
                        <span>{{ item }}</span>
                      </el-col>
                    </el-option>
                    <!-- 由于element-ui内部渲染机制包含动画过渡,在单线程的前提下, 每次的动画时间都会叠加, 当数据量过大时
                      动画时长叠加会比较长, 就会造成卡慢效果, 使用v-if限制渲染过多, 或者直接使用v-show,只渲染一次,通
                      过元素显示隐藏来达到效果 -->
                    <el-option
                      v-for="(item, Index) in option.optionFilterList"
                      v-if="Index < 100"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :class="option['noCheck'] ? `` : 'hidden-checkmark'">
                      <el-checkbox v-if="!option.noCheck" :rulses="''" v-model="item.isSelect" class="position-checkBox"/>
                      <el-col v-for="(Field, index) in (option.optionHeaderCode ? option.optionHeaderCode : ['value', 'label'])" :span="option.optionHeaderWidthSpan || 12" :key="index" class="information-title">
                        <span>{{ item[Field] }}</span>
                      </el-col>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='date'" :span="option.span || 20" class="search-bar-col">
                <!--时间单选-->
                <el-form-item
                  :label="option.label"
                  :prop="option.name"
                  :rules="option.rules ? {
                    required: true, message: option.rulesMsg || '请选择时间区段', trigger: 'blur'
                } : []">
                  <el-date-picker
                    :disabled="option.disabled"
                    v-model="params[option.name]"
                    :placeholder="option.placeholder||'选择日期'"
                    :value-format="option.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                    :class="option.className ? `${option.className} width-one-hundred-percent` : 'width-one-hundred-percent'"
                    :default-time="option.defaultTime ? option.defaultTime : ' 12:00:00'"
                    type="datetime"/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='daterange'" :span="option.span || 20" class="search-bar-col">
                <!--时间范围选择-->
                <el-form-item
                  :label="option.label"
                >
                  <el-date-picker
                    :disabled="option.disabled"
                    v-model="params[option.name]"
                    :picker-options="pickerOptions"
                    :default-value="option.defaultValue ? option.defaultValue : false"
                    :default-time="['00:00:00', '23:59:59']"
                    :value-format="option.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                    :class="option.className ? `${option.className} width-one-hundred-percent` : 'width-one-hundred-percent'"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='input'" :span="option.span || 20" class="search-bar-col" >
                <el-form-item
                  :label="option.label"
                  :prop="option.name"
                  :rules="option.rules ? {
                    required: true, message: option.rulesMsg || '请输入对应内容', trigger: 'blur'
                } : {}">
                  <el-input
                    :disabled="option.disabled"
                    v-model="params[option.name]"
                    :placeholder="option.placeholder||'请填写'"
                    clearable/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='checkbox'" :span="option.span || 20" class="search-bar-col" >
                <el-form-item
                  :label="option.label"
                  :prop="option.name"
                  :rules="option.rules ? {
                    required: true, message: option.rulesMsg || '请选择至少一项', trigger: 'blur'
                } : {}">
                  <el-checkbox :disabled="option.disabled" v-model="params[option.name]" :label="option.placeholder||'请填写'" class="move-left-50-percent"/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='radio'" :span="option.span || 20" class="search-bar-col" >
                <el-form-item
                  :label="option.label"
                  :prop="option.name"
                  :rules="option.rules ? {
                    required: true, message: option.rulesMsg || '请选择其中一项', trigger: 'blur'
                } : {}">
                  <el-radio-group v-model="params[option.name]">
                    <el-radio v-for="(item, index) in option.radioList" :key="index" :label="item.value">{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='operation'" :span="option.span || 20" class="search-bar-col" >
                <el-form-item
                  :label="option.label"
                  :prop="option.name"
                  :rules="option.rules ? {
                    required: true, message: option.rulesMsg || '请选择其中一项', trigger: 'blur'
                } : {}">
                  <slot :params="params" :name="option.name"/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='textArea'" :span="option.span || 20" class="search-bar-col" >
                <el-col :span="10" class="text-right">
                  <el-radio-group v-model="option['checkValue']">
                    <el-radio-button v-for="(item, index) in option.radioList" :key="index" :label="`${item.value}`" :style="`width:${100 / option.radioList.length}%`">{{ `${item.label}` }}</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    :prop="option.name"
                    :rules="option.rules ? {
                      required: true, message: option.rulesMsg || '请输入对应内容', trigger: 'blur'
                    } : {}"
                    label-width="0">
                    <el-input
                      :disabled="option.disabled"
                      :autosize="{ minRows: option.minRows || 1, maxRows: option.maxRows || 3 }"
                      v-model="params[option.name]"
                      :placeholder="option.placeholder || `可批量输入 以英文逗号隔开`"
                      class="searche-bar-showInput"
                      type="textarea"
                      @focus="changeTextZIndex"
                      @blur="changeTextZIndex"
                      @keyup.native="convertChineseComma(option)"/>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col v-if="option.type==='upload'" :span="option.span || 20" class="search-bar-col" >
                <el-form-item
                  :label="option.label">
                  <uploadCommon :file-name="option.name" :file-type="option.uploadType" @success="appendFile($event, option.name)"/>
                </el-form-item>
              </el-col>
              <el-col v-if="option.type==='textArea'" :span="option.span || 20" class="search-bar-col" >
                <el-col :span="10" class="text-right">
                  <el-radio-group v-model="option['checkValue']">
                    <el-radio-button v-for="(item, index) in option.radioList" :key="index" :label="`${item.value}`" :style="`width:${100 / option.radioList.length}%`">{{ `${item.label}` }}</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    :prop="option.name"
                    :rules="option.rules ? {
                      required: true, message: option.rulesMsg || '请输入对应内容', trigger: 'blur'
                    } : {}"
                    label-width="0">
                    <el-input
                      :disabled="option.disabled"
                      :autosize="{ minRows: option.minRows || 1, maxRows: option.maxRows || 3 }"
                      v-model="params[option.name]"
                      :placeholder="option.placeholder || `可批量输入 以英文逗号隔开`"
                      class="searche-bar-showInput"
                      type="textarea"
                      @focus="changeTextZIndex"
                      @blur="changeTextZIndex"
                      @keyup.native="convertChineseComma(option)"/>
                  </el-form-item>
                </el-col>
              </el-col>
            </div>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="DialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploadCommon from './upload'
export default {
  name: 'DialogButton',
  components: { // 组件
    uploadCommon
  },
  props: {
    buttonText: {
      type: String,
      default: '弹窗按钮'
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    helpOptionPush: {
      type: Object,
      default: () => {}
    },
    defaultParams: {
      type: Object,
      default: () => {}
    },
    WidthPercent: {
      type: Number,
      default: 30
    },
    dialogText: {
      type: String,
      default: '提示'
    },
    labelWidth: {
      type: Number,
      default: 110
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data: function() { // 初始化数据
    return {
      params: {},
      loading: false,
      dialogVisible: this.showDialog,
      pickerOptions: {
        shortcuts: [{
          text: '最近三小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      formData: new FormData()
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  created() {
    this.options.forEach((item) => {
      if ((item.type === 'lazySelect' && item.multiple) || (item.type === 'select' && item.multiple)) {
        this.$set(this.params, item.name, [])
      } else if (item.type === 'daterange' && item.defaultValue) {
        this.$set(this.params, item.name, item.defaultValue)
      } else if (item.type === 'text' || item.type === 'upload') {
        console.log(1)
      } else {
        this.$set(this.params, item.name, '')
      }
    })
  },
  mounted() {
    // 接收this.helpSelect, 将this.options进行遍历
    // 通过type类型判断, 将helpSelect中的对应值赋值到this.options中
    // 这里简单的使用一个延时器,让赋值操作放到队列最后, 这是因为vue对于对象数组无法实现深入式响应
    setTimeout(() => {
      for (var j in this.helpOptionPush) {
        this.options.map(item => {
        // 如果名称对应属性相同, 则将这个属性的值赋值给当前的项
          if (item.name === j) {
            if (item.type === 'select') {
              item.options = this.helpOptionPush[j]
            } else if (item.type === 'lazySelect') {
              item.optionFilterList = this.helpOptionPush[j]
              item.optionAllList = this.helpOptionPush[j]
            } else {
              return
            }
          }
        })
      }
    }, 500)
    for (var k in this.defaultParams) {
      for (var e in this.params) {
        if (k === e) {
          this.params[e] = this.defaultParams[k]
        }
      }
    }
  },
  methods: { // 方法
    // Select多选下拉实现全选功能
    selectAll(val, options, name) {
      if (!options.oldOptions) {
        options['oldOptions'] = ['选项0']
      }
      const allValues = ['选项0']
      // 保留所有值
      for (const item of options) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = options.oldOptions.length === 1 ? [] : options.oldOptions[1]
      // 若是全部选择
      if (val.includes('选项0')) this.params[name] = allValues
      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('选项0') && !val.includes('选项0')) this.params[name] = []
      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('选项0') && val.includes('选项0')) {
        const index = val.indexOf('选项0')
        val.splice(index, 1) // 排除全选选项
        this.params[name] = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('选项0') && !val.includes('选项0')) {
        if (val.length === allValues.length - 1) this.params[name] = ['选项0'].concat(val)
      }
      // 储存当前最后的结果 作为下次的老数据
      options.oldOptions[1] = this.params[name]
    },
    // 调整文本域层级样式
    changeTextZIndex($even) {
      // 调整文本域样式, 使其聚焦时,输入框层级最高, 失焦时层级正常
      if ($even.type === 'focus') {
        $even.path[1].className = 'searche-bar-showInput el-textarea el-input--mini'
      } else {
        $even.path[1].className = 'el-textarea el-input--mini'
      }
    },
    // 中文逗号转英文逗号
    convertChineseComma(option) {
      this.params[option.name] = this.params[option.name].replace(/，/g, ',')
    },
    // LazySelect输入时值改变
    getChangePlaceholder(flag, option) {
      if (flag) {
        if (!option.noCheck) {
          if (!this.params[option.name].length) {
            // 同理, 当打开下拉列表的时候, 如果是this.params[option.name]无值,代表啥也没选,
            // 那么 全选按钮, 每一项的isSelect和上一次记录的数组值都要回到初始设置
            option['allCheck'] = false
            option.optionFilterList.map(item => {
              item['isSelect'] = false
            })
            option.optionAllList.map(item => {
              item['isSelect'] = false
            })
            option['oldValueList'] = []
          }
        }
        // option.placeholder = '请输入客商名称或代码进行搜索'
        option.placeholder = option.changePlaceholder || '全部'
      } else {
        option.placeholder = '全部'
      }
    },
    // LazySelect函数change事件
    valueChange(valueList, option) {
      // 记录上一次的数组,
      if (!option.multiple) {
        return
      }
      if (!option.oldValueList) {
        option['oldValueList'] = valueList
      }
      // 如果当前数组长度大于上一次长度
      // 就把新增的元素提取出来,
      // 然后在option.optionFilterList中找出来,
      // 再给它的isSelect属性赋值为true
      if (valueList.length > option.oldValueList.length) {
        const arr3 = this.array_diff(option.oldValueList, valueList)
        arr3.map(item => {
          this.optionCommonFunctionMap(option.optionFilterList, item, true)
        })
      } else if (valueList.length < option.oldValueList.length) {
        const arr3 = this.array_diff(valueList, option.oldValueList)
        // 就把减少的元素提取出来
        // 然后在option.optionFilterList中找出来,
        // 再给它的isSelect属性赋值为false
        arr3.map(item => {
          // 当删除标签时, 需要考虑一种状况, 就是当下拉列表无选项,但又在进行删除操作时, 此时改变的isSelect属性
          // 应该是从全部数组中去改变, 因为过滤数组和全部数组是相互影响的
          if (option.optionFilterList.length) {
            this.optionCommonFunctionMap(option.optionFilterList, item, false)
          } else {
            this.optionCommonFunctionMap(option.optionAllList, item, false)
          }
        })
      } else {
        // 第一次选择或值未变, 那么直接把valueList中的元素
        // 在option.optionFilterList中找出来,
        // 再给它的isSelect属性赋值为true
        valueList.forEach(item => {
          this.optionCommonFunctionMap(option.optionFilterList, item, true)
        })
      }
      // 当多选状态时, 值为空或列表为空则全选按钮应该不激活
      if (!valueList.length || !option.optionFilterList.length) {
        option['allCheck'] = false
      } else {
        // 在跟新完数组每一项的状态之后, 判断当前option.optionFilterList列表中
        // 是否全都是true, 全是true,则把全选状态改为true
        let flag = true
        option.optionFilterList.forEach(item => {
          // 当有item.isSelect值为false或者空的时候
          if (!item['isSelect']) {
            flag = false
          }
        })
        // 如果所有的选项中isSelect属性都是true,那么激活全选按钮
        if (flag) {
          option['allCheck'] = true
        } else {
          option['allCheck'] = false
        }
      }
      // 当多选状态时, 值为空,列表也为空则重置下拉列表为所有选项
      if (!valueList.length && !option.optionFilterList.length) {
        option.optionFilterList = option.optionAllList
      }
      // 结束之后, 更新上一次数组状态
      option['oldValueList'] = valueList
      // 当前值在option.optionFilterList列表中找不到时, 会只显示值
      if (option.optionFilterList.length) {
        let showText = false
        option.optionFilterList.map(item => {
          if (item.value === valueList[0]) {
            showText = true
          }
        })
        if (!showText) {
          // 当前显示的值不再option.optionFilterList中, 那么会显示值而不是相应的文字
          this.optionCommonFuctionClass(option, valueList)
        }
      } else {
        this.optionCommonFuctionClass(option, valueList)
      }
    },
    // LazySelect函数全选事假
    checkTotalSwitch(flag, option) {
      const arrAppendList = []
      // 如果是激活状态, 那么代表当前全选中
      if (flag) {
        // 先把当前下拉列表中每一项的isSelect改为true, 不提取->代码行无变化
        option.optionFilterList.forEach(item => {
          item.isSelect = true
          arrAppendList.push(item.value)
        })
        // 所有选中添加进数组, 并去重保留一个相同项
        this.params[option.name].push(...arrAppendList)
        const arr1 = [...this.params[option.name]]
        const arr2 = this.unique(arr1)
        this.params[option.name] = arr2
        // 全选切换的时候, 需要去实时记录上一次的值, 以便在change事假中进行对比
        option['oldValueList'] = arr2
      } else {
        option.optionFilterList.forEach(item => {
          item.isSelect = false
          arrAppendList.push(item.value)
        })
        // 当前所有不选中, 取不同
        const arr1 = [...this.params[option.name]]
        const arr2 = [...arrAppendList]
        const arr3 = this.array_diff(arr2, arr1)
        this.params[option.name] = arr3
        // 全选切换的时候, 需要去实时记录上一次的值, 以便在change事假中进行对比
        option['oldValueList'] = arr3
      }
    },
    // LazySelect函数
    remoteMethod(query, option) {
      if (query.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          option.optionFilterList = option.optionAllList.filter(item => {
            if (option.optionFilterRole) {
              for (var i = 0; i < option.optionFilterRole.length; i++) {
                if (item[option.optionFilterRole[i]].toLowerCase().indexOf(query.toLowerCase()) > -1) {
                  return item
                }
              }
            } else {
              // 默认筛选value和label
              if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                return item
              }
            }
          })
          this.optionCommonFunction(option)
        }, 200)
      } else {
        option.optionFilterList = option.optionAllList
        this.optionCommonFunction(option)
      }
    },
    // LazySelect函数提取重复代码段
    optionCommonFunction(option) {
      if (option.optionFilterList.length) {
        // 更新下拉列表后, 需要将已选择的项重新添加上isSelect值为true
        option.optionFilterList.map(item => {
          this.params[option.name].forEach(e => {
            if (item.value === e) {
              item.isSelect = true
            }
          })
        })
        // 使用节流阀判断下拉列表中项是否全部已经被选中了
        let flag = false
        if (option.optionFilterList.length) {
          option.optionFilterList.forEach(l => {
            if (!l['isSelect']) {
              flag = true
            }
          })
          if (flag) {
            option['allCheck'] = false
          } else {
            option['allCheck'] = true
          }
        } else {
          // 如果下拉列表没有值, 那么全选也为false
          option['allCheck'] = false
        }
      }
    },
    // LazySelect函数解决第一个在多选情况下出现无对应文字显示的提取重复代码段, 希望被优化的地方
    optionCommonFuctionClass(option, valueList) {
      const res = this.$refs[`${option.name}-tags`][0].$el
      const re1 = res.getElementsByClassName('el-select__tags-text')
      // 为只显示第一个元素添加前置判断条件, 防止空值控制台报错
      if (this.params[option.name] && this.params[option.name].length !== 0) {
        const target = option.optionAllList.filter(item => item.value === valueList[0])
        re1[0].outerHTML = `<span class="el-select__tags-text">${target[0].label}</span>`
      }
    },
    // LazySelect函数提取重复代码段
    optionCommonFunctionMap(option, item, BooleanValue) {
      option.map(e => {
        if (item === e.value) {
          e['isSelect'] = BooleanValue
        }
      })
    },
    // 处理params中,是文本域的值, 把文本域的值给截取转换为数组
    dealParams() {
      const params = JSON.parse(JSON.stringify(this.params))
      this.options.forEach(item => {
        if (item.type === 'textArea') {
          const arr = []
          params[item.name].split(',').map(e => {
            e = e.replace(/[\r\n]/g, '').trim()
            if (e) {
              arr.push(e)
            }
          })
          params[item.name] = arr
          // 如果选中的和name属性不一致, 那么修改name属性为checkValue属性
          if (item.checkValue !== item.name) {
            params[item.checkValue] = arr
            delete params[item.name]
          }
        }
      })
      for (const k in params) {
        // 如果是数组， 过滤掉全选的参数
        if (params[k] instanceof Array) {
          params[k] = params[k].filter(item => item !== '选项0')
        }
      }
      return params
    },
    // 获取上传的文件信息
    appendFile(formData, name) {
      console.log(formData.get(name))
      this.formData.append(name, formData.get(name))
    },
    handleBeforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleClose(done) {
      this.$emit('update:showDialog', false)
    },
    openDailog() {
      this.$emit('open')
    },
    // 点击查询调用函数
    DialogConfirm() {
      this.$refs['DialogRuleForm'].validate((valid) => {
        if (valid) {
          const result = this.dealParams()
          // 判断, 如果有上传文件, 那么转换为formData形式参数
          let flag = true
          this.options.forEach(item => {
            if (item.type === 'upload') {
              flag = false
            }
          })
          if (flag) {
            const params = result || '当前没有值传出'
            this.$emit('DialogConfirm', params)
          } else {
            for (const k in result) {
              this.formData.append(k, result[k])
            }
            this.$emit('DialogConfirm', this.formData)
          }
        } else {
          return false
        }
      })
    },
    // 重置搜索栏表单
    resetForm() {
      this.$refs['DialogRuleForm'].resetFields()
      for (var k in this.defaultParams) {
        for (var e in this.params) {
          if (k === e) {
            this.params[e] = this.defaultParams[k]
          }
        }
      }
    },
    // 比较两数组, 找出不同项组成新数组并返回
    array_diff(shortArr, longArr) {
      var temp = {} // 临时数组1
      var temparray = []// 临时数组2
      for (var i = 0; i < shortArr.length; i++) {
        temp[shortArr[i]] = true// 巧妙地方：把数组B的值当成临时数组1的键并赋值为真
      }
      for (let i = 0; i < longArr.length; i++) {
        if (!temp[longArr[i]]) {
          temparray.push(longArr[i])// 巧妙地方：同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组
        }
      }
      return temparray
    },
    // 去除数组中的重复项
    unique(arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-bar {
  padding-right: 10px;
  background: #FFFFFF;
  .search-bar-col {
    .text-right {
      text-align: center;
      .textarea-radio-width{
        width: 50%;
      }
    }
    .width-one-hundred-percent {width: 100%}
    .move-left-50-percent {
      position: absolute;
        top:0;
        left:-50%;
    }
  }
}
.information-title {
    font-size: 14px;  /*一定要设置宽度，或者元素内含的百分比*/
    overflow: hidden; /*溢出的部分隐藏*/
    white-space: nowrap; /*文本不换行*/
    text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/
}
 .position-checkBox {
    position: absolute;
    top: 0;
    left: 2%;
    z-index: 999;
  }
  .el-select-dropdown.is-multiple .hidden-checkmark.selected:after {
    content: ''
  }
  .searche-bar-showInput {
    z-index: 999;
  }
</style>
