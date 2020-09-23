<template>
  <el-tooltip :disabled="value.length === 0" class="item" effect="light" placement="top">
    <div slot="content" style="height: 200px;overflow: auto">
      <p v-for="(text, index) in value" :key="index">
        <span>{{ text.label }}</span>
        <span class="el-icon-error" style="float:right" @click="del(index, value, text)" />
      </p>
    </div>
    <!-- v-loadmore="loadMore" -->
    <el-select
      v-model="value"
      :remote-method="(query)=>{remoteMethod(query, value)}"
      :loading="loading"
      placeholder="全部"
      style="width: 100%"
      class="saed"
      multiple
      reserve-keyword
      filterable
      collapse-tags
      remote
      @remove-tag="delSelect"
      @change="changeList"
      @keyup.native="changemo1"
      @keydown.native="changemo">
      <el-option :disabled="true" value="选项0" style="max-width: 500px">
        <el-checkbox v-model="checkTotal" class="checkClass" @change="checkTotalSwitch(checkTotal)"/>
        <!-- <span class="spanClass">仓库代码</span>
        <span class="spanClass11">仓库名称</span>
        <span class="spanClass22">仓库类型</span>
        <span class="spanClass33"> 账套</span> -->
      </el-option>
      <el-option
        v-for="(item, index) in options"
        ref="optionCheck"
        :key="index"
        :label="item.label"
        :value="item"
        @click.native.prevent="changemorerr(item, index, value)">
        <el-checkbox v-model="item.isSelect" class="checkClass"/>
        <!-- <el-tooltip :disabled="item.value? item.value.length < 10 : true" :content="item.value" class="item" effect="light" placement="top">
          <span class="spanClass" >{{ item.value }}</span>
        </el-tooltip>
        <el-tooltip :disabled="item.label ? item.label.length < 10 : true" :content="item.label" class="item" effect="light" placement="top">
          <span class="spanClass1">{{ item.label }}</span>
        </el-tooltip>
        <el-tooltip :disabled="item.type ? item.type.length < 10 : true" :content="item.type" class="item" effect="light" placement="top">
          <span class="spanClass2">{{ item.type }}</span>
        </el-tooltip>
        <el-tooltip :disabled="item.count ? item.count.length < 10 : true" :content="item.count" class="item" effect="light" placement="top">
          <span class="spanClass3">{{ item.count }}</span>
        </el-tooltip> -->
      </el-option>
    </el-select>
  </el-tooltip>
</template>
<script>
export default {
  name: 'StockSearchMain',
  props: {
    isRset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      value: [],
      loading: false,
      checkTotal: false,
      checkArr: [],
      aq: true,
      page: 1,
      limit: 10,
      text: '',
      warehouseType: '',
      seList: [],
      // 初始化仓库数据
      optionsWarehouse: [],
      warehouseTypeList: [], // 保存所有仓库类型
      nowList: [] // 当前数组
    }
  },
  watch: {
    value: function(val) {
      this.$emit('getValue', val)
    },
    isRset: function(val) {
      this.reset()
    },
    optionsWarehouse: function(val) {
      this.options = val
    },
    porpsType: function(val) {
      this.warehouseType = val
    }
  },
  async created() {
    this.options.map((item, index) => {
      this.checkArr.push(false)
    })
    const res = await this.$api.getBrandName()
    this.warehouseTypeList = res.data.data
    const arr = res.data.data.map(item => {
      return item.dictCode
    })
    this.warehouseType = arr.join(',')
    const str = this.warehouseType
    // this.getList('', str)
    // 初始化数据数组请求
    // 初始化选择框添加loading
    this.loading = true
    const resWarehouse = await this.$api.getwarehouseList('', str)
    // 如果拿到了初始数据, 那么就把加载动画去除
    if (resWarehouse) {
      this.loading = false
    }
    this.optionsWarehouse = resWarehouse.data.data.warehouseList.map(item => {
      return { value: item.externalWarehouseCode, label: item.warehouseName, type: item.warehouseTypeName, count: item.warehouseAccount, isSelect: false }
    })
  },
  mounted() {
    const re = document.getElementsByClassName('el-select__tags')
    console.log(re)
    for (let i = 0; i < re.length; i++) {
      re[i].style = 'max-height:30px;max-width:15px;overflow:hidden'
      if (i === 1 || i === 2) {
        re[i].className = 'el-select__tags changeSpan'
      }
    }
  },
  methods: {
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
          this.options.map(item => {
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
    delSelect(val) {
      val.isSelect = false
    },
    // 单选关联option
    changemorerr(item, index, list) {
      if (item.isSelect) {
        item.isSelect = false
      } else {
        item.isSelect = true
      }
      this.options[index].isSelect = item.isSelect
      let flag = 0
      this.options.map(e => {
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
    // 远程搜索下拉框方法
    // 总的check切换
    checkTotalSwitch(val) {
      if (this.checkTotal) {
        this.options.forEach(item => {
          item.isSelect = true
        })
        // 所有选中添加进数组, 并去重保留一个相同项
        this.value.push(...this.options)
        const arr1 = [...this.value]
        const arr2 = this.unique(arr1)
        this.value = arr2
        this.seList = this.options
      } else {
        const arr = [...this.options]
        for (let i = 0; i < arr.length; i++) {
          arr[i].isSelect = false
        }
        // 当前所有不选中, 取不同
        this.options = arr
        const arr1 = [...this.value]
        const arr2 = [...this.options]
        const arr3 = this.array_diff(arr1, arr2)
        this.value = arr3
        this.seList = []
      }
    },
    del(index, name, text) {
      this.value.splice(index, 1)
      this.options.map(item => {
        if (item.value === text.value) {
          item.isSelect = false
        }
      })
      // this.value.remove(item)
    },
    remoteMethod(query, value) {
      if (query.trim() !== '') {
        this.text = query
        this.loading = true
        setTimeout(() => {
          this.loading = false
          const str = this.warehouseType
          this.getList(query, str, value)
        }, 200)
      } else {
        this.options = this.nowList
        // const str = this.warehouseType
        // this.getList('', str, value)
      }
    },
    // 远程下拉框获取数据
    async getList(query, type, value) {
      // 先将传进来的type做一个数组过滤, 将不符合条件的排出出去
      let arr = []
      console.log(type)
      // 从本地所有仓库去筛选, 筛选出属于该业务类型的元素
      if (type && type.indexOf(',') === -1) {
        // 获取选中仓库对应的类型名称
        const strArr = this.warehouseTypeList.filter(item => item.dictCode === type)
        this.optionsWarehouse.map(item => {
          // 因为是单选, 所以单个匹配成功则添加
          if (strArr[0].dictValue === item.type) {
            arr.push(item)
          }
        })
      } else {
        // 如果为空, 则为全部仓库中筛选
        arr = this.optionsWarehouse
      }
      this.nowList = arr
      // 每次输入值触发函数,都会去初始化数组中过滤符合条件数组
      this.options = arr.filter(item => {
        if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          return item
        }
      })
      if (value) {
        this.options.map(item => {
          this.value.forEach(e => {
            if (item.value === e.value) {
              item.isSelect = true
            }
          })
        })
        let flag = false
        if (this.options.length !== 0) {
          this.options.forEach(l => {
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
        const re = document.getElementsByClassName('el-select__tags')
        const re1 = re[0].getElementsByClassName('el-select__tags-text')
        // 为只显示第一个元素添加前置判断条件, 防止空值控制台报错
        if (value && value.length !== 0) {
          re1[0].outerHTML = `<span class="el-select__tags-text">${value[0].label}</span>`
        }
      }
    },
    editPlaceholder() {
      this.placeholder = '请输入仓库名称或者代码'
    },
    reset() {
      this.value = ''
      this.options.map(item => {
        item.isSelect = false
      })
      this.seList = []
      this.checkTotal = false
      const str = this.warehouseType
      this.getList('', str)
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
  .spanClass{
    display:inline-block;
    width:18%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
  .spanClass1{
    display:inline-block;
    width:42%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
 }
  .spanClass11{
    display:inline-block;
    width:15%;
    /* white-space: nowrap;
    text-overflow: ellipsis; */
    overflow: hidden;
    margin-left:70px;
 }
  .spanClass2{
    display:inline-block;
    width:15%;
    /* white-space: nowrap;
    text-overflow: ellipsis; */
    overflow: hidden;
 }
  .spanClass22{
    display:inline-block;
    width:15%;
    /* white-space: nowrap;
    text-overflow: ellipsis; */
    overflow: hidden;
    margin-left:65px;
 }
  .spanClass3{
    display:inline-block;
    width:8%;
    overflow: hidden;
    margin-left: -8px;
 }
 .spanClass33{
    display:inline-block;
    width:10%;
    overflow: hidden;
    margin-left:10px;
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
  .optionClass {
    max-width: 400px
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  content: ''
}
</style>
