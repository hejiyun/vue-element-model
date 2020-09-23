<template>
  <div class="stock_container">
    <div class="condition">
      <div class="top">
        <div class="left_l"/>
        <!-- <search-bar
          ref="sh"
          :all-oreder-params="true"
          :options="dealersSearchBarOptions"
          :width-number="8"
          is-reset
          @search="search"
          @lazyOut="lazyget"
        /> -->
        <p>查询条件</p>
        <span>( 查询时sku条码和货号必输入一项 )</span>
      </div>
      <div class="bottom">
        <div class="bottom-info">
          <el-row :gutter="2">
            <el-col :xs="6" :sm="12" :md="6" :lg="6" :xl="6">
              <el-col :span="5"><p>sku条码</p></el-col>
              <el-col :span="19">
                <el-input
                  v-model="barCodeList"
                  :rows="2"
                  type="input"
                  placeholder="支持批量输入，以逗号（,）分隔"/>
              </el-col>
            </el-col>
            <el-col :xs="6" :sm="12" :md="6" :lg="6" :xl="6">
              <el-col :span="4"><p>货号</p></el-col>
              <el-col :span="20">
                <el-input
                  v-model="materialCodeList"
                  :rows="2"
                  type="input"
                  placeholder="支持批量输入，以逗号（,）分隔"/>
              </el-col>
            </el-col>
            <el-col :xs="6" :sm="12" :md="6" :lg="6" :xl="6">
              <el-col :span="4"><p>仓库</p></el-col>
              <el-col :span="20">
                <el-tooltip :content="warehouseCodeList" :disabled="warehouseCodeList.length === 0" effect="light" placement="top" class="item">
                  <!-- <div slot="content">
                    <slot v-for="item in value" name="content">{{ item }}</slot>
                    <br>
                  </div> -->
                  <el-select
                    v-model="warehouseCodeList"
                    :loading="loading"
                    :remote-method="remoteMethod"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    collapse-tags
                    placeholder="全部仓库">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-tooltip>
              </el-col>
            </el-col>
            <el-col :xs="6" :sm="12" :md="6" :lg="6" :xl="6">
              <el-col :span="14">
                <p>未分配可用数 <span>>=</span></p>
              </el-col>
              <el-col :span="8">
                <el-input v-model="minUnallocatedQty" type="number" style="margin-left:-40px"/>
              </el-col>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-input :value="value3"></el-input>
            <el-select
              v-model="value2"
              multiple
              filterable
              collapse-tags
              style="margin-left: 20px;"
              placeholder="请选择"
              @change="shijian">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-row> -->
        </div>
        <div class="bottom-action">
          <el-button :disabled="getshow" type="primary" size="small" @click="onSubmit">查询</el-button>
          <el-button type="primary" size="small" @click="onReset">重置</el-button>
          <el-button type="primary" size="small" @click="onExport">导出</el-button>
        </div>
      </div>
    </div>
    <div class="result">
      <div class="top">
        <div class="left_l"/>
        <div class="left">查询结果</div>
        <div v-if="flag" class="right">
          <ul>
            <!-- <li>总计货号 xx条</li>
            <li>SKU xx条</li>
            <li>库存实物数</li>
            <li>可用数</li> -->
            <li>当前时间:&nbsp;&nbsp;{{ date }}</li>
          </ul>
        </div>
      </div>
      <div class="center">
        <el-table
          :data="tableData"
          border
          style="width: 100%;">
          <el-table-column
            prop="warehouseCode"
            label="仓库代码"
            align="center"/>
          <el-table-column
            prop="warehouseName"
            label="仓库名称"
            width="150"
            align="center"/>
          <el-table-column
            prop="warehouseType"
            label="仓库类型"
            align="center"/>
          <el-table-column
            prop="brandName"
            label="品牌"
            align="center"/>
          <el-table-column
            prop="materialCode"
            label="货号"
            align="center"/>
          <el-table-column
            prop="size"
            label="尺码"
            align="center"/>
          <el-table-column
            prop="barCode"
            label="SKU条码"
            align="center"/>
          <el-table-column
            prop="totalQty"
            sortable
            label="实物数"
            align="center"/>
          <el-table-column
            prop="occupiedQty"
            sortable
            label="可用数"
            align="center"/>
          <el-table-column
            prop="unallocatedQty"
            sortable
            label="未分配可用数"
            align="center"/>
          <el-table-column
            prop="allocatedQty"
            sortable
            label="已分配可用数"
            align="center"/>
        </el-table>
      </div>
      <div class="bottom">
        <div class="block">
          <el-pagination
            :current-page="currentPage4"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            :total="100"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import SearchBar from '@/components/SearchBar'
import moment from 'moment'
const arr2 = []
export default {
  name: 'StockSearch',
  // components: { SearchBar },
  data() {
    return {
      // options: [{
      //     value: '选项1',
      //     label: '黄金糕'
      //   }, {
      //     value: '选项2',
      //     label: '双皮奶'
      //   }, {
      //     value: '选项3',
      //     label: '蚵仔煎'
      //   }, {
      //     value: '选项4',
      //     label: '龙须面'
      //   }, {
      //     value: '选项5',
      //     label: '北京烤鸭'
      //   }],
      // value2: '',
      // value3: '',
      flag: false,
      date: '',
      getshow: false,
      barCodeList: [],
      materialCodeList: [],
      minUnallocatedQty: '',
      warehouseCodeList: [],
      options: [],
      value: '',
      list: [],
      loading: false,
      warehouseLists: [],
      formInline: {
        user: '',
        region: ''
      },
      tableData: [],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      message: ''
      // seen: false
    }
  },
  async created() {
    // 1.调用接口获取数据
    // 获取仓库类型
    const res3 = await this.$api.getDictType('physical_inventory_query_warehouse_type')
    const warehouseTypeList = res3.data.data
    const str = []
    warehouseTypeList.map(item => {
      str.push(item.dictCode)
    })
    const str2 = str.join()
    // 根据仓库类型获取对应仓库数据
    const res2 = await this.$api.getWarehouses(`${str2}`)
    const arr = res2.data.data.warehouseList
    arr.map(item => {
      arr2.push({
        value: item.externalWarehouseCode,
        label: `${item.warehouseName} ${item.externalWarehouseCode} ${item.warehouseTypeName}`
        // label: item.warehouseName
      })
    })
  },
  mounted() {
  },
  methods: {
    // shijian(value) {
    //   console.log(value, 'value')
    //   console.log(this.value2, 'this.value')
    // },
    // 点击查询按钮
    async onSubmit() {
      // if (statusCode === '500') {
      //   this.$message({
      //     message: '服务器错误',
      //     type: 'warning'
      //   })
      // }
      // sku条码和货号都没有输入
      if (!this.barCodeList && !this.materialCodeList) {
        this.$alert('查询时SKU条码和货号必输入一项', '提示', {
          confirmButtonText: '确定'
        })
        // sku条码和货号都输入了
      } else if (this.barCodeList && this.materialCodeList) {
        this.$alert('查询时SKU条码和货号只能输入一项', '提示', {
          confirmButtonText: '确定'
        })
        // sku条码和货号输入了其中一项
      } else {
        const params = {
          warehouseCodeList: this.warehouseCodeList,
          minUnallocatedQty: this.minUnallocatedQty,
          page: 1,
          size: 10,
          orderByList: [
            {
              columnName: 'warehouseCode',
              order: 'ascending'
            }
            // {
            //   columnName: 'totalQty',
            //   order: 'ascending'
            // },
            // {
            //   columnName: 'unallocatedQty'
            // }
          ]
        }
        // 去掉sku条码和货号输入框中的空格
        if (this.materialCodeList.trim()) {
          params.materialCodeList = this.materialCodeList.split(',')
        }
        if (this.barCodeList.trim()) {
          params.barCodeList = this.barCodeList.split(',')
        }
        if (this.warehouseCodeList) {
          const res = await this.$api.physicalInventory(params)
          this.tableData = res.data.list // 数据列表
          this.message = res.msg
          if (this.tableData.length === 0) {
            this.$alert('没有符合查询条件的结果，请更改查询条件试一试', '提示', {
              confirmButtonText: '确定'
            })
          }
        }
        // }
        // 定时器有问题，待解决
        this.flag = true
        this.timer = setTimeout(() => {
          this.date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }, 1000)
      }
      // 当用户同时输入了sku条码和货号时，查询按钮为禁用状态
      if (this.barCodeList !== '' && this.materialCodeList !== '') {
        this.getshow = true
      }
    },
    // 点击重置按钮
    onReset() {
      this.barCodeList = ''
      this.materialCodeList = ''
      this.minUnallocatedQty = ''
      this.warehouseCodeList = ''
      this.flag = false
      this.getshow = false
      this.value = ''
    },
    // 点击导出按钮
    onExport() {
      this.$axios({
        method: 'post',
        url: `/bff/api/v1/physical_inventory/_export`,
        responseType: 'blob'
        // data: {
        //   barCodeList: [this.barCodeList],
        //   materialCodeList: this.materialCodeList,
        //   warehouseCodeList: this.warehouseCodeList,
        //   minUnallocatedQty: this.minUnallocatedQty
        // }
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
        const url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(res.data)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '发货单导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    },
    handleSelect(item) {
    },
    loadAll() {
    },
    remoteMethod(query) {
      if (query !== '') { // 输入框的值不为空时，执行以下语句
        this.loading = true // loading图标显示
        // js是单线程的，会按顺序执行代码，setTimeout和setInterval是异步执行的，当遇到异步的时候，会将异步放到异步队列先执行下行代码，当所有程序执行完，会回过头来执行异步队列里的异步函数
        setTimeout(() => { // 200ms以后，执行以下语句
          this.loading = false // loading图标消失
          this.options = arr2.filter(item => {
            return item.label.toLowerCase() // 将数据中的大写变为小写
              .indexOf(query.toLowerCase()) > -1 // 接口中的数据找到输入框中相对应的数据
          })
        }, 200)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style scoped>
*{font-size: 12px;}
/* .multiple-wrap{
  position: relative;
  cursor: pointer;
  font-size: 14px;
  line-height: 18px;
  max-height: 54px;
  overflow: hidden;
  word-break: break-all;
}
i.more{
  position: absolute;
  display: inline-block;
  width: 50px;
  height: 18px;
  bottom: 0;
  right: 0;
  text-align: right;
  font-size: 18px;
} */
.item {
  /* width: 180px; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.cell {
  text-align: center;
}
.stock_container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.bottom-action {
  height: 30px;
}
.top {
  margin-top: 10px;
  overflow: hidden;
  /* height: 30px; */
  display: flex;
  flex-direction: row;
  align-items: center;
}
.top > .left_l {
  display: inline-block;
  width: 3px;
  height: 25px;
  background-color: rgb(64, 158, 255);
}
.top > p {
  font-weight: 700;
  float: left;
  margin-left: 10px;
}
.top > span {
  float: left;
  margin-left: .5rem;
  color: #999;
  /* margin-top: 10px; */
}
.condition > .bottom {
  margin-top: 1rem;
  font-weight: 700;
  border: 1px solid #ccc;
  padding: 20px 0 20px 0;
}
.condition > .bottom > .bottom-info {
  border-bottom: 2px solid #efefef;
  padding-left: 10px;
  padding-bottom: 40px;
}
.condition > .bottom > .bottom-action {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.result > .top {
  height: 30px;
  background-color: #efefef;
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: space-between; */
  /* padding-left: 10px; */
  padding-right: 20px;
  margin-top: 5px;
  overflow: hidden;
}
.result > .top > .left {
  font-weight: 700;
  margin-left: 10px;
  float: left;
}
.result > .top > .right {
  margin-top: -5px;
  position: absolute;
  right: 20px;
}
.result > .top > .right > ul > li{
  list-style: none;
  float: left;
  padding-right: 10px;
}
.result > .bottom {
  border: 1px solid #ccc;
  padding: 10px 0;
  text-align: center;
  margin-top: 20px;
}
.center {
  margin-right: 20px;
}
</style>
