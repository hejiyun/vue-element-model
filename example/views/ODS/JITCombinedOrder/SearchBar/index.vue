<template>
  <div class="search-bar">
    <el-form ref="ruleForm">
      <el-row class="flexBox">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="flexBoxItem">
          <el-col v-if="option.type==='select'" class="search-bar-col">
            <!--下拉选择-->
            <el-form-item :label="option.label" style = "display: flex">
              <all-select ref="allSelect1" :disabled="option.disabled" :options="option.options" :name="option.name" :is-reset="isReset1" :index="option.index" @getNewVal="getNewVal"/>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='radioSelect'" class="search-bar-col">
            <!--下拉选择-->
            <el-form-item :label="option.label" style = "display: flex">
              <el-select
                v-model="value"
                :remote-method="remoteMethod4"
                :loading="loading"
                :disabled="option.disabled"
                :placeholder="option.placeholder||'全部'"
                filterable
                remote
                clearable
                reserve-keyword
                @visible-change="getListqwe1($event, option)"
                @change="setVal(option.name)">
                <el-option :disabled="true" value="选项0" style="max-width: 500px">
                  <span class="spanClass4">客商代码</span>
                  <span class="spanClass12">客商名称</span>
                </el-option>
                <el-option
                  v-for="(item, index) in list"
                  ref="optionCheck"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  style="max-width: 500px">
                  <el-tooltip :disabled="item.value? item.value.length < 10 : true" :content="item.value" class="item" effect="light" placement="top">
                    <span class="spanClass4" >{{ item.value }}</span>
                  </el-tooltip>
                  <el-tooltip :disabled="item.label ? item.label.length < 10 : true" :content="item.label" class="item" effect="light" placement="top">
                    <span class="spanClass12">{{ item.label }}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='lazySelect'" class="search-bar-col">
            <el-form-item :label="option.label" style = "display: flex">
              <el-tooltip :disabled="params[option.name].length === 0" class="item" effect="light" placement="top">
                <div slot="content" style="height: 200px;overflow: auto">
                  <p v-for="(text, index) in params[option.name]" :key="index">
                    <span>{{ text.label }}</span>
                    <span class="el-icon-error" style="float:right" @click="del(index, option.name, text)" />
                  </p>
                </div>
                <!-- v-loadmore="loadMore" -->
                <el-select
                  v-model="params[option.name]"
                  :remote-method="(query)=>{remoteMethod(query, option.name)}"
                  :loading="loading"
                  :placeholder="option.placeholder"
                  :disabled="option.disabled"
                  class="saed"
                  multiple
                  reserve-keyword
                  collapse-tags
                  filterable
                  remote
                  @visible-change="getListqwe($event, option)"
                  @remove-tag="delSelect"
                  @change="changeList"
                  @keyup.native="changemo1"
                  @keydown.native="changemo">
                  <el-option :disabled="true" value="选项0" style="max-width: 500px">
                    <el-checkbox v-model="checkTotal" class="checkClass" @change="checkTotalSwitch(checkTotal, option.name)"/>
                    <span class="spanClass">仓库代码</span>
                    <span class="spanClass1">仓库名称</span>
                    <span class="spanClass2">仓库类型</span>
                  </el-option>
                  <el-option
                    v-for="(item, index) in lazyOption"
                    ref="optionCheck"
                    :key="index"
                    :label="item.label"
                    :value="item"
                    style="max-width: 500px"
                    @click.native.prevent="changemorerr(item, index, params[option.name])">
                    <el-checkbox v-model="item.isSelect" class="checkClass"/>
                    <el-tooltip :disabled="item.value? item.value.length < 10 : true" :content="item.value" class="item" effect="light" placement="top">
                      <span class="spanClass" >{{ item.value }}</span>
                    </el-tooltip>
                    <el-tooltip :disabled="item.label ? item.label.length < 10 : true" :content="item.label" class="item" effect="light" placement="top">
                      <span class="spanClass1">{{ item.label }}</span>
                    </el-tooltip>
                    <el-tooltip :disabled="item.type ? item.type.length < 10 : true" :content="item.type" class="item" effect="light" placement="top">
                      <span class="spanClass2">{{ item.type }}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='lazySelect1'" class="search-bar-col">
            <el-form-item :label="option.label" style = "display: flex;">
              <el-tooltip :disabled="params[option.name].length === 0" class="item" effect="light" placement="top">
                <div slot="content" style="height: 200px;overflow: auto">
                  <p v-for="(text, index) in params[option.name]" :key="index">
                    <span>{{ text.label }}</span>
                    <span class="el-icon-error" style="float:right" @click="del1(index, option.name, text)" />
                  </p>
                </div>
                <!-- v-loadmore="loadMore" -->
                <el-select
                  v-model="params[option.name]"
                  :remote-method="(query)=>{remoteMethod1(query, option.name)}"
                  :loading="loading"
                  :placeholder="option.placeholder||'全部'"
                  :disabled="option.disabled"
                  class="saed"
                  multiple
                  collapse-tags
                  reserve-keyword
                  filterable
                  remote
                  @visible-change="getListqwe($event, option)"
                  @remove-tag="delSelect"
                  @change="changeList1"
                  @keyup.native="changemo1"
                  @keydown.native="changemo">
                  <el-option :disabled="true" value="选项0" style="max-width: 500px">
                    <el-checkbox v-model="checkTotal1" class="checkClass" @change="checkTotalSwitch1(checkTotal1, option.name)"/>
                    <span class="spanClass">仓库代码</span>
                    <span class="spanClass1" style="margin: 0 5px">仓库名称</span>
                    <span class="spanClass2">仓库类型</span>
                  </el-option>
                  <el-option
                    v-for="(item, index) in lazyOption1"
                    ref="optionCheck"
                    :key="index"
                    :label="item.label"
                    :value="item"
                    style="max-width: 500px"
                    @click.native.prevent="changemorerr1(item, index, params[option.name])">
                    <el-checkbox v-model="item.isSelect" class="checkClass"/>
                    <el-tooltip :disabled="item.value? item.value.length < 10 : true" :content="item.value" class="item" effect="light" placement="top">
                      <span class="spanClass" >{{ item.value }}</span>
                    </el-tooltip>
                    <el-tooltip :disabled="item.label ? item.label.length < 10 : true" :content="item.label" class="item" effect="light" placement="top">
                      <span class="spanClass1" style="margin: 0 5px">{{ item.label }}</span>
                    </el-tooltip>
                    <el-tooltip :disabled="item.type ? item.type.length < 10 : true" :content="item.type" class="item" effect="light" placement="top">
                      <span class="spanClass2">{{ item.type }}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='date'" class="search-bar-col">
            <!--时间单选-->
            <el-form-item :label="option.label" style = "display: flex">
              <el-date-picker
                :disabled="option.disabled"
                v-model="params[option.name]"
                :placeholder="option.placeholder||'选择日期'"
                type="date"/>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='daterange'" class="search-bar-col">
            <!--时间范围选择, 修改样式-->
            <el-form-item :label="option.label" style = "display: flex">
              <el-date-picker
                v-model="params[option.name]"
                :disabled="option.disabled"
                :default-value="options.defaultValue ? options.defaultValue : ''"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
                style="width:100%"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='input'" class="search-bar-col" >
            <el-form-item :label="option.label" style = "display: flex">
              <el-input
                :disabled="option.disabled"
                v-model="params[option.name]"
                :placeholder="option.placeholder||'请填写'"
                @keyup.native="isDisable(option.name)"/>
            </el-form-item>
          </el-col>
          <el-col v-if="option.type==='checkbox'" class="search-bar-col" >
            <el-form-item :label="option.label" style = "display: flex">
              <el-checkbox :disabled="option.disabled" v-model="params[option.name]" :label="option.placeholder||'请填写'"/>
            </el-form-item>
          </el-col>
        </div>
        <el-button v-preventReClick v-show="true" :disabled="searchDisable" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button v-if="isReset" type="primary" @click="resetForm('ruleForm')">重置</el-button>
        <el-button v-preventReClick v-if="isExport" type="primary" icon="el-icon-download" @click="exportExcel(exportOptions)">导出</el-button>
        <el-button v-if="isImport" type="primary" icon="el-icon-upload2" @click="importExcel">{{ text }}</el-button>
        <span v-show="disabled" style="color:red; lineHeight: 30px"> *当前禁用项为无效搜索条件</span>
      </el-row>

    </el-form>
    <div v-show="false">
      <form ref="myform" :action="`${exportOptions.url}`" :method="`${exportOptions.method}`">
        <input v-for="(val, key, index) in exportOptions.data" :key="index" :value="val" :name="`${key}`" type="text">
        <input type="submit" value="提交">
      </form>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import AllSelect from './allSelect'

export default {
  components: { // 组件
    AllSelect
  },
  props: {
    WidthNumber: {
      type: Number,
      default: 6
    },
    labelWidth: {
      type: Number,
      default: 120
    },
    widthPx: {
      type: Number,
      default: null
    },
    options: {
      type: Array,
      default: function() {
        return []
      }
    },
    optionsCopy: {
      type: Array,
      default: function() {
        return []
      }
    },
    exportUrl: {
      type: String,
      default: ''
    },
    isExport: {
      type: Boolean,
      default: false
    },
    isImport: {
      type: Boolean,
      default: false
    },
    isReset: {
      type: Boolean,
      default: false
    },
    allParams: {
      type: Boolean,
      default: false
    },
    allOrederParams: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    searchDisable: {
      type: Boolean,
      default: false
    },
    exportOptions: {
      type: Object,
      default: function() {
        return {}
      }
    },
    lazyUpdate: {
      type: Boolean,
      default: false
    }
  },
  data: function() { // 初始化数据
    return {
      disabled: false,
      // 远程下拉框参数
      lazyOption: [],
      lazyOption1: [],
      loading: false,
      checkTotal: false,
      checkTotal1: false,
      aq: true,
      page: 1,
      limit: 10,
      text1: '',
      params: {},
      status: 0,
      text: '导入商品清单',
      warehouseType: '',
      isReset1: false,
      // sousuo
      value: '',
      list: [],
      screenWidth: document.body.clientWidth,
      seList: [],
      seList1: [],
      isKeyup: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近三小时',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '今天',
          onClick(picker) {
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            const end = new Date(new Date().setHours(24, 0, 0, 0))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date(new Date().setHours(24, 0, 0, 0))
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date(new Date().setHours(24, 0, 0, 0))
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date(new Date().setHours(24, 0, 0, 0))
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
            picker.$emit('pick', [start, end])
          }
        }]
      }

    }
  },
  watch: {
    screenWidth: function(val) {
      if (!this.timer) {
        this.screenWidth = val
        this.timer = true
        const that = this
        setTimeout(function() {
          that.timer = false
        }, 400)
      }
    },
    optionsCopy: function(val) {
      this.list = val
    }
  },
  async created() {
    this.options.forEach((item) => {
      this.$set(this.params, item.name, '')
    })
    if (this.lazyUpdate) {
      const res = await this.$api.getwarehouseType1()
      const arr = res.data.data.map(item => {
        return item.dictCode
      })
      this.warehouseType = arr.join(',')
      // 多选仓库卡慢问题原因, 因为初始化渲染数据较多, 导致出现渲染卡慢的问题, 参见表格数据过多页面渲染
      const str = this.warehouseType
      this.getList('', str)
      this.getList1('', str)
    }
  },
  mounted() {
    this.options.map((v, i) => {
      if (v.defaultValue) {
        this.$set(this.params, v.name, v.defaultValue)
      }
    })
    this.$nextTick(() => {
      this.isDisable('dispatchNo')
    })
    const re = document.getElementsByClassName('el-select__tags')
    for (let i = 0; i < re.length; i++) {
      re[i].style = 'max-height:26px;max-width:15px;overflow:hidden'
      // 修复当选择多仓库时第一个选中选项名称会消失问题
      if (i === 1 || i === 2) {
        re[i].className = 'el-select__tags changeSpan'
      }
    }
    const that = this
    window.screenWidth = document.body.clientWidth
    this.screenWidth = window.screenWidth
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  methods: { // 方法
    isDisable(name) {
      if (name === 'dispatchNo' || name === 'expressBillNo') {
        if (this.params[name]) {
          console.log(this.params[name], '1')
          this.options.forEach(e => {
            if (e.name !== name) {
              e['disabled'] = true
            }
          })
          this.disabled = true
          this.$forceUpdate()
        } else {
          console.log(this.params[name], 'w')
          this.options.forEach(e => {
            e['disabled'] = false
          })
          this.disabled = false
          this.$forceUpdate()
        }
      }
    },
    getListqwe(flag, option) {
      if (flag) {
        option.placeholder = '请输入仓库名称或代码进行搜索'
      } else {
        option.placeholder = '全部'
      }
    },
    getListqwe1(flag, option) {
      if (flag) {
        option.placeholder = '请输入客商名称或代码进行搜索'
      } else {
        option.placeholder = '全部'
      }
    },
    changemo1() {
      this.isKeyup = true
    },
    changemo() {
      this.isKeyup = false
    },
    // 删除时, 多选框不正确
    changeList(val) {
      if (this.isKeyup) {
        if (val.length < this.seList.length && (this.seList.length - val.length) === 1) {
          this.checkTotal = false
          this.lazyOption.map(item => {
            if (item.value === this.seList[this.seList.length - 1].value) {
              item.isSelect = false
            }
          })
        }
        this.seList = val // 记录上一次的值
        this.isKeyup = false
      }
      if (val.length === 0) {
        this.getList('', this.warehouseType)
      }
    },
    changeList1(val) {
      if (this.isKeyup) {
        if (val.length < this.seList1.length && (this.seList1.length - val.length) === 1) {
          this.checkTotal1 = false
          this.lazyOption1.map(item => {
            if (item.value === this.seList1[this.seList1.length - 1].value) {
              item.isSelect = false
            }
          })
        }
        this.seList1 = val // 记录上一次的值
        this.isKeyup = false
      }
      if (val.length === 0) {
        this.getList1('', this.warehouseType)
      }
    },
    delSelect(val) {
      val.isSelect = false
    },
    setVal(name) {
      this.params[name] = this.value
      if (this.value === '') {
        this.list = this.optionsCopy
      }
    },
    remoteMethod4(query) {
      if (query.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.list = this.optionsCopy.filter(item => {
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item
            } else if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            } else if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.value.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            }
          })
        }, 200)
      } else {
        this.list = this.optionsCopy
      }
    },
    getNewVal(val, name) {
      this.params[name] = val
    },
    // 单选关联option
    changemorerr(item, index, list) {
      item.isSelect = !item.isSelect
      // this.lazyOption[index].isSelect = !item.isSelect
      let flag = 0
      this.lazyOption.map(e => {
        if (!e.isSelect) {
          flag = 1
        }
      })
      if (flag === 1) {
        this.checkTotal = false
      } else {
        this.checkTotal = true
      }
      this.seList = list
    },
    changemorerr1(item, index, list) {
      this.lazyOption1[index].isSelect = !item.isSelect
      let flag = 0
      this.lazyOption1.map(e => {
        if (!e.isSelect) {
          flag = 1
        }
      })
      if (flag === 1) {
        this.checkTotal1 = false
      } else {
        this.checkTotal1 = true
      }
      this.seList = list
    },
    // 远程搜索下拉框方法
    // 总的check切换
    checkTotalSwitch(val, name) {
      if (this.checkTotal) {
        this.lazyOption.forEach(item => {
          item.isSelect = true
        })
        // 所有选中添加进数组, 并去重保留一个相同项
        this.params[name].push(...this.lazyOption)
        const arr1 = [...this.params[name]]
        const arr2 = this.unique(arr1)
        this.params[name] = arr2
        this.seList = this.lazyOption
      } else {
        const arr = [...this.lazyOption]
        for (let i = 0; i < arr.length; i++) {
          arr[i].isSelect = false
        }
        // 当前所有不选中, 取不同
        this.lazyOption = arr
        const arr1 = [...this.params[name]]
        const arr2 = [...this.lazyOption]
        const arr3 = this.array_diff(arr1, arr2)
        this.params[name] = arr3
        this.seList = []
      }
    },
    checkTotalSwitch1(val, name) {
      if (this.checkTotal1) {
        this.lazyOption1.forEach(item => {
          item.isSelect = true
        })
        // 所有选中添加进数组, 并去重保留一个相同项
        this.params[name].push(...this.lazyOption)
        const arr1 = [...this.params[name]]
        const arr2 = this.unique(arr1)
        this.params[name] = arr2
        this.seList1 = this.lazyOption1
      } else {
        const arr = [...this.lazyOption1]
        for (let i = 0; i < arr.length; i++) {
          arr[i].isSelect = false
        }
        this.lazyOption1 = arr
        // 当前所有不选中
        const arr1 = [...this.params[name]]
        const arr2 = [...this.lazyOption]
        const arr3 = this.array_diff(arr1, arr2)
        this.params[name] = arr3
        this.seList1 = []
      }
    },
    del(index, name, text) {
      this.params[name].splice(index, 1)
      this.lazyOption.map(item => {
        if (item.value === text.value) {
          item.isSelect = false
        }
      })
      // this.value.remove(item)
    },
    del1(index, name, text) {
      this.params[name].splice(index, 1)
      this.lazyOption.map(item => {
        if (item.value === text.value) {
          item.isSelect = false
        }
      })
      // this.value.remove(item)
    },
    remoteMethod(query, a) {
      if (query.trim() !== '') {
        this.text1 = query
        this.loading = true
        setTimeout(() => {
          this.loading = false
          const str = this.warehouseType
          this.getList(query, str, a)
        }, 200)
      } else {
        const str = this.warehouseType
        this.getList('', str, a)
      }
    },
    remoteMethod1(query, a) {
      if (query.trim() !== '') {
        this.text1 = query
        this.loading = true
        setTimeout(() => {
          this.loading = false
          const str = this.warehouseType
          this.getList1(query, str, a)
        }, 200)
      } else {
        const str = this.warehouseType
        this.getList1('', str, a)
      }
    },
    // 远程下拉框获取数据
    async getList(query, type, name) {
      const res = await this.$api.getwarehouseList(query, type)
      if (res.data.data.warehouseList.length === 0) {
        this.lazyOption = []
      } else {
        this.lazyOption = res.data.data.warehouseList.map(item => {
          return { value: item.warehouseCode, label: item.warehouseName, type: item.warehouseTypeName, isSelect: false }
        })
      }
      if (name) {
        this.lazyOption.map(item => {
          this.params[name].forEach(e => {
            if (item.value === e.value) {
              item.isSelect = true
            }
          })
        })
        let flag = false
        if (this.lazyOption.length !== 0) {
          this.lazyOption.forEach(l => {
            if (!l.isSelect) {
              flag = true
            }
          })
          if (flag) {
            this.checkTotal = false
          } else {
            this.checkTotal = true
          }
        } else {
          this.checkTotal = false
        }
        const re = document.getElementsByClassName('changeSpan')
        const re1 = re[0].getElementsByClassName('el-select__tags-text')
        // 为只显示第一个元素添加前置判断条件, 防止空值控制台报错
        if (this.params[name] && this.params[name].length !== 0) {
          re1[0].outerHTML = `<span class="el-select__tags-text">${this.params[name][0].label}</span>`
        }
      }
    },
    async getList1(query, type, name) {
      const res = await this.$api.getwarehouseList(query, type)
      if (res.data.data.warehouseList.length === 0) {
        this.lazyOption1 = []
      } else {
        this.lazyOption1 = res.data.data.warehouseList.map(item => {
          return { value: item.warehouseCode, label: item.warehouseName, type: item.warehouseTypeName, isSelect: false }
        })
      }
      if (name) {
        this.lazyOption1.map(item => {
          this.params[name].forEach(e => {
            if (item.value === e.value) {
              item.isSelect = true
            }
          })
        })
        let flag = false
        if (this.lazyOption1.length !== 0) {
          this.lazyOption1.forEach(l => {
            if (!l.isSelect) {
              flag = true
            }
          })
          if (flag) {
            this.checkTotal1 = false
          } else {
            this.checkTotal1 = true
          }
        } else {
          this.checkTotal1 = false
        }
        const re = document.getElementsByClassName('changeSpan')
        const re1 = re[1].getElementsByClassName('el-select__tags-text')
        // 为只显示第一个元素添加前置判断条件, 防止空值控制台报错
        if (this.params[name] && this.params[name].length !== 0) {
          re1[0].outerHTML = `<span class="el-select__tags-text">${this.params[name][0].label}</span>`
        }
      }
    },
    // 多选下拉实现全选功能
    selectAll(val, options, name) {
      const allValues = ['选项0']
      // 保留所有值
      for (const item of options) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions[1]
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
      this.oldOptions[1] = this.params[name]
    },
    checkStatus(item) {
      this.$emit('chooseStatus', item)
    },
    checkNode(data, name) {
      // 测试一下,
      const val = []
      data.map(item => val.push(item[0]))
      this.params[name] = val
    },
    getParams() {
      return this.params
    },
    search() {
      const params = { ...this.params }
      for (const k in params) {
        if (k === 'daterange') {
          if (params[k]) {
            params.startDate = moment(params[k][0]).format('YYYY/MM/DD')
            params.endDate = moment(params[k][1]).format('YYYY/MM/DD')
          }
          delete params[k]
        }
        // 如果是数组， 过滤掉全选的参数
        if (params[k] instanceof Array) {
          params[k] = params[k].filter(item => item !== '选项0')
        }
        // if (this._.find(this.options, {'name': k}) && this._.find(this.options, {'name': k}).multiple) {
        //   params[k] = params[k].join(',')
        // }
      }
      this.$emit('search', params)
    },
    importExcel() {
      this.$emit('import')
    },
    exportExcel() {
      this.$nextTick(() => {
        const params = this.exportOptions
        let flag = true
        if (params.hasParams) {
          for (var k in params.data) {
            if (!params.data[k]) {
              flag = false
            }
          }
          if (!flag) {
            this.$notify({
              title: '错误',
              message: '请选择导出项',
              type: 'error',
              duration: 2000
            })
            return
          }
        }
        this.$axios({
          method: params.method,
          url: params.url,
          data: params.data
          // responseType: 'blob' // 这里注明一下, 如果导出EXCEL为[object blob]的话, 把这段responseType:'blob' 注释掉就行了.
        }).then(res => {
          if (res.data.code) {
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
            return
          }
          const blob = new Blob(['\ufeff' + res.data], { type: 'text/csv;charset=utf-8' })
          const url = window.URL.createObjectURL(blob)
          // const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(res.data)
          // 通过创建a标签实现
          const link = document.createElement('a')
          link.href = url
          // 对下载的文件命名
          link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '发货单导出数据表.csv'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      })
    },
    resetForm() {
      for (var k in this.params) {
        if (k !== 'createTime') {
          this.params[k] = ''
        }
      }
      console.log(this.params)
      this.$nextTick(() => {
        this.isDisable('dispatchNo')
      })
      this.value = []
      this.lazyOption.map(item => {
        item.isSelect = false
      })
      this.lazyOption1.map(item => {
        item.isSelect = false
      })
      this.seList = []
      this.seList1 = []
      this.checkTotal = false
      this.checkTotal1 = false
      const str = this.warehouseType
      this.getList('', str)
      this.getList1('', str)
      if (this.isReset1) {
        this.isReset1 = false
      } else {
        this.isReset1 = true
      }
      this.$emit('resetForm', '重置成功')
    },
    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].value === b[i].value) {
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return a
    },
    unique(arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].value === arr[j].value) {
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
<style scoped>
.search-bar {
    padding-right: 10px;
  background: #FFFFFF;
  /* border: 1px solid #cccccc;
  padding: 20px 20px 0px 20px;
  box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1); */
}
  .tc{
    text-align: center;
    margin-bottom: 10px;
  }
  .pt {
    position: absolute;
    top: -100px;
  }
 .spanClass{
    display:inline-block;
    width:20%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
 .spanClass4{
    display:inline-block;
    width:30%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
 .spanClass1{
    display:inline-block;
    width:45%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
  .spanClass2{
    display:inline-block;
    width:15%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
 .spanClass12{
    display:inline-block;
    width:60%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
 .checkClass {
    display:inline-block;
    width:30px;
    overflow: hidden
 }
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  content: ''
}
 .changafter::after {
    content: '...';
    color: #000;
    position: absolute;
    left: 83%;
    top: 5px;
    z-index: 999
  }
   .flexBox {
   display: flex;
   flex-wrap: wrap;
   padding: 5px 0;
 }
 .flexBoxItem {
     padding-left: 5px;
   height: 30px;
 }
</style>
