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
      visible: false,
      dialog: false,
      loading: false,
      value: '',
      searchValue: '',
      showDrap: false,
      count: 0,
      checked: false,
      noFocus: true,
      fileterList: [],
      selectList: [],
      operationName: ''
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
    },
    selectList: {
      handler(v, o) {
        this.$emit('updateValue', v)
      },
      deep: true
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
    // 单个点击修改值
    checkChange(val, child) {
      this.operationName = 'checked'
      let str = this.Titem.optionHeader[0].split('/')[1]
      // 单个点击复选框时, 只需要判断true为添加, false为移除即可
      if (val) {
        this.selectList.push(child)
      } else {
        this.selectList = this.selectList.filter(e => e[str] !== child[str])
      }
      str = null
    },
    allSelect() {
      // 需要考虑连续点击全选时的动作
      if (this.operationName === 'allSelect') {
        return
      }
      let str = this.Titem.optionHeader[0].split('/')[1]
      const arr = []
      this.fileterList.forEach(e => {
        this.$set(e, 'checked', true)
        this.selectList.forEach(item => {
          if (item[str] !== e[str]) {
            arr.push(e)
          }
        })
      })
      // 同步到selectList中, 需要考虑selectList中是否包含当前选项
      this.selectList = [...this.selectList, ...arr]
      str = null
      // 函数结尾讲该次操作名称记为全选
      this.operationName = 'allSelect'
    },
    allCancel() {
      // 需要考虑连续点击全取消时的动作
      if (this.operationName === 'allCancel' || this.operationName === '') {
        return
      }
      let str = this.Titem.optionHeader[0].split('/')[1]
      this.fileterList.forEach(e => {
        this.$set(e, 'checked', false)
        // 同步到selectList中
        this.selectList = this.selectList.filter(item => item[str] !== e[str])
      })
      str = null
      // 函数结尾讲该次操作名称记为反选
      this.operationName = 'allCancel'
    },
    reset() {
      this.visible = false;
      this.selectList = []
      this.Titem.AllList.forEach(e => {
        this.$set(e, 'checked', false)
      })
    },
    hideTest() {
      this.count--
      this.focusInput()
    },
    dialogClose(list) {
      this.count--
      if (list && list.length) {
        let str = this.Titem.optionHeader[0].split('/')[1]
        list.forEach(e => {
          // 在这里需要重置掉allList中的checked属性, 因为fliterList与allList是同步的数据
          for (let index = 0; index < this.Titem.AllList.length; index++) {
            if (e[str] === this.Titem.AllList[index][str]) {
              this.$set(this.Titem.AllList[index], 'checked', false)
              // 使用break结束当前循环
              break
            }
          }
          // 并且需要删除select中， 包含它的项
          this.selectList = this.selectList.filter(item => item[str] !== e[str])
        })
        str = null
      }
      this.focusInput()
    },
    showSelect() {
      this.dialog = true
      this.count++
    },
    reRenderLi(value) {
      this.loading = true
      this.operationName = 'search'
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
