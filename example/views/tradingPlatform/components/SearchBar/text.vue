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
      collapse-tags
      filterable
      remote
      @remove-tag="delSelect"
      @change="changeList"
      @keyup.native="changemo1"
      @keydown.native="changemo">
      <el-option :disabled="true" value="选项0" style="max-width: 500px">
        <el-checkbox v-model="checkTotal" class="checkClass" @change="checkTotalSwitch(checkTotal)"/>
        <span class="spanClass">仓库代码</span>
        <span class="spanClass1">仓库名称</span>
        <span class="spanClass2">仓库类型</span>
      </el-option>
      <el-option
        v-for="(item, index) in options"
        ref="optionCheck"
        :key="index"
        :label="item.label"
        :value="item"
        @click.native.prevent="changemorerr(item, index, value)">
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
      seList: []
    }
  },
  watch: {
    value: function(val) {
      console.log(val)
      this.$emit('getValue', val)
    },
    isRset: function(val) {
      this.reset()
    }
  },
  async created() {
    this.options.map((item, index) => {
      this.checkArr.push(false)
    })
    const res = await this.$api.getwarehouseType()
    const arr = res.data.data.map(item => {
      return item.dictCode
    })
    console.log(arr, 'sh')
    this.warehouseType = arr.join(',')
    const str = this.warehouseType
    console.log(str)
    this.getList('', str)
  },
  mounted() {
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
      console.log(val, '移除的')
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
      console.log(flag)
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
        const str = this.warehouseType
        this.getList('', str, value)
      }
    },
    // 远程下拉框获取数据
    async getList(query, type, value) {
      const res = await this.$api.getwarehouseList(query, type)
      if (res.data.data.warehouseList.length === 0) {
        this.lazyOption = []
      } else {
        this.lazyOption = res.data.data.warehouseList.map(item => {
          return { value: item.externalWarehouseCode, label: item.warehouseName, type: item.warehouseTypeName, isSelect: false }
        })
      }
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
        console.log(re, re1, 'jjjjjjj')
        re1[0].outerHTML = `<span class="el-select__tags-text">${value[0].label}</span>`
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
      console.log(this.options, '123213123421')
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
          } else {
            console.log('meiyou')
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
    width:20%;
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
  .optionClass {
    max-width: 400px
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  content: ''
}
</style>
