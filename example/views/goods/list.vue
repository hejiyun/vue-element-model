<template>
  <el-container class="order-box outerBox pdc">
    <!-- <p class="mr"><span class="blue-line">|</span>查询条件</p> -->
    <!--搜索头-->
    <div class="search-bar">
      <el-form ref="ruleForm" label-position="left">
        <!-- 修改按货号查询为按宝唯货号/恒康货号查询 -->
        <el-col>
          <el-form-item>
            <div class="mat">
              <el-radio-group v-model="listQuery.productCodeType" class="matSon" size="mini">
                <el-radio-button v-model="productCodeType" label="1">宝唯货号</el-radio-button>
                <el-radio-button v-model="productCodeType" label="2">恒康货号</el-radio-button>
              </el-radio-group>
            </div>
            <div class="matInput">
              <!-- 增加针对货号输入框的input事件，对用户输入的数据进行监察 -->
              <el-input :autosize="{ minRows: 2, maxRows: 3 }" v-model="listQuery.productCodes" placeholder="可批量输入 以英文逗号隔开 最多输入200条" type="textarea" @input="convertChineseComma"/>
            </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="条码:">
            <el-input :placeholder="$t('goods.placeHolder')" v-model.trim="listQuery.barCode" clearable class="commonWidth" @keyup.enter.native="handleFilter"/>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="货号:">
              <el-input :placeholder="$t('goods.placeHolder')" v-model.trim="listQuery.productCode" clearable class="commonWidth" @keyup.enter.native="handleFilter"/>
            </el-form-item>
          </el-col> -->
        <el-col>
          <el-form-item label="品牌:">
            <el-select v-model="listQuery.brand" class="commonWidth" filterable clearable placeholder="全部">
              <el-option
                v-for="item in brandOptions"
                :key="item.dic_key"
                :label="item.dic_value"
                :value="item.dic_key"
                clearable
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="年份:">
            <el-select v-model="listQuery.year" filterable class="commonWidth" clearable placeholder="全部">
              <el-option
                v-for="item in yearOptions"
                :key="item.dic_key"
                :label="item.dic_value"
                :value="item.dic_value"
                clearable
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="上市日期:">
            <el-date-picker
              v-model="listQuery.listingDate"
              class="marketdate"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期"
              clearable
              @change="listingDateChange"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="季节:">
            <el-select v-model="listQuery.season" filterable class="commonWidth" clearable placeholder="全部">
              <el-option
                v-for="item in seasonOptions"
                :key="item.dic_key"
                :label="item.dic_value"
                :value="item.dic_key"
                clearable
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="性别:">
            <el-select v-model="listQuery.gender" class="commonWidth" filterable clearable placeholder="全部">
              <el-option
                v-for="item in genderOptions"
                :key="item.dic_key"
                :label="item.dic_value"
                :value="item.dic_key"
                clearable
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="项目:">
            <el-select v-model="listQuery.project" filterable class="commonWidth" clearable placeholder="全部">
              <el-option
                v-for="item in projectOptions"
                :key="item.dic_key"
                :label="item.dic_value"
                :value="item.dic_key"
                clearable
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="建档时间:">
            <el-date-picker
              v-model="listQuery.productCreateTime"
              type="daterange"
              range-separator="-"
              class="marketdate"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期"
              clearable
              @change="productCreateTimeChange"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="类别:">
            <el-select v-model="listQuery.category" filterable class="commonWidth" clearable placeholder="全部">
              <el-option
                v-for="item in categoryOptions"
                :key="item.dic_key"
                :label="item.dic_value"
                :value="item.dic_key"
                clearable
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="款型:">
            <el-select v-model="listQuery.pattern" filterable class="commonWidth" clearable placeholder="全部">
              <el-option
                v-for="item in modeOptions"
                :key="item.dic_key"
                :label="item.dic_value"
                :value="item.dic_key"
                clearable
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="系列:">
            <el-select v-model="listQuery.series" filterable class="commonWidth" clearable placeholder="全部">
              <el-option
                v-for="item in seriesOptions"
                :key="item.dic_key"
                :label="item.dic_value"
                :value="item.dic_key"
                clearable
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="货品简称:">
            <el-input :placeholder="$t('goods.placeHolder')" v-model.trim="listQuery.shortName" clearable class="commonWidth" @keyup.enter.native="handleFilter"/>
          </el-form-item>
        </el-col>

        <!-- 增加查询按钮禁用状态 -->
        <el-button v-waves :disabled="isDisable" type="primary" @click="handleFilter">
          查询
        </el-button>
        <el-button v-waves type="primary" @click="handleReset">
          {{ $t('table.reset') }}
        </el-button>
        <el-button v-waves type="primary" @click="exportList(false, multipleSelection.length)">
          汇总导出
        </el-button>
        <el-button v-waves type="primary" @click="exportList(true, multipleSelection.length)">
          商品明细导出
        </el-button>
      </el-form>
    </div>
    <!--表格-->
    <!-- <p class="mr"><span class="blue-line">|</span>货品列表</p> -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :header-cell-style="{background: '#204060', color: 'white'}"
      height="calc(100vh - 220px)"
      style="width: 100%"
      border
      fit
      @selection-change="handleSelectionChange">
      <af-table-column type="selection"/>
      <!-- 详细信息 -->
      <af-table-column label="详细信息" align="center" >
        <template slot-scope="scope">
          <router-link :to="`/goods/detail/`+encodeURIComponent(scope.row.product_code)">
            <el-button type="text" size="small">{{ $t('goods.view') }}</el-button>
          </router-link>
        </template>
      </af-table-column>

      <!-- 宝唯货号 -->
      <af-table-column label="宝唯货号" align="center" >
        <template slot-scope="scope">
          <!-- 字段待后端接口提供 -->
          <span>{{ scope.row.bw_product_code }} </span>
        </template>
      </af-table-column>
      <!-- 恒康货号 -->
      <af-table-column label="恒康货号" align="center" >
        <template slot-scope="scope">
          <!-- 字段待后端接口提供 -->
          <!-- 现有的货号 改名 恒康货号 -->
          <span>{{ scope.row.product_code }} </span>
        </template>
      </af-table-column>

      <!-- 货号 -->
      <!-- <af-table-column :label="$t('goods.goodsNo')" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.product_code }} </span>
        </template>
      </af-table-column> -->
      <!-- 商品主图 -->
      <af-table-column label="商品主图" align="center" >
        <template slot-scope="scope">
          <img
            v-image-preview
            :src="scope.row.main_images?scope.row.main_images[0].img_url:defaultImg"
            :alt="scope.row.main_images?scope.row.main_images[0].img_name:null"
            :onerror="defaultImg"
            class="goods-image">
        </template>
      </af-table-column>
      <!-- 图片地址 -->
      <af-table-column label="图片地址 (单击可复制)" align="center" prop="main_image_address">
        <!-- <template slot="header" slot-scope="scope">
          <span :key="scope.row">图片地址<span class="copyImageAddress"> (单击可复制)</span></span>
        </template> -->
        <template slot-scope="scope">
          <span :data-clipboard-text="scope.row.main_images?scope.row.main_images[0].img_path:null" class="tag-read" @click="copyAddress">{{ scope.row.main_images?scope.row.main_images[0].img_path:null }} </span>
        </template>
      </af-table-column>
      <!-- 条码 -->
      <!-- <el-table-column :label="$t('goods.barCode')" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.bar_code }} </span>
        </template>
      </el-table-column> -->
      <!-- 货品简称 -->
      <af-table-column :label="$t('goods.goodsName')" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.short_name }} </span>
        </template>
      </af-table-column>
      <!-- 品牌 -->
      <af-table-column :label="$t('goods.brand')" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.brand_value }} </span>
        </template>
      </af-table-column>
      <!-- 颜色 -->
      <af-table-column :label="$t('goods.color')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.color_value }} </span>
        </template>
      </af-table-column>
      <!-- 尺码类别 -->
      <!-- <el-table-column :label="$t('goods.sizeType')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.size_type_value }} </span>
        </template>
      </el-table-column> -->
      <!-- 尺码 -->
      <!-- <el-table-column :label="$t('goods.size')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.size_detail_value }} </span>
        </template>
      </el-table-column> -->
      <!-- 吊牌价 -->
      <af-table-column :label="$t('goods.tagPrice')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.suggested_retail_price }} </span>
        </template>
      </af-table-column>
      <!-- 年份 -->
      <af-table-column :label="$t('goods.year')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.year }} </span>
        </template>
      </af-table-column>
      <!-- 季节 -->
      <af-table-column :label="$t('goods.season')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.develop_season_value }} </span>
        </template>
      </af-table-column>
      <!-- 上市日期 -->
      <af-table-column :label="$t('goods.marketTime')" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.listing_date }} </span>
        </template>
      </af-table-column>
      <!-- 产地 -->
      <af-table-column :label="$t('goods.origin')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.producing_area }} </span>
        </template>
      </af-table-column>
      <!-- 性别 -->
      <af-table-column :label="$t('goods.gender')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.sex_value }} </span>
        </template>
      </af-table-column>
      <!-- 类别 -->
      <af-table-column :label="$t('goods.classes')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.product_type_value }} </span>
        </template>
      </af-table-column>
      <!-- 款型 -->
      <af-table-column :label="$t('goods.mode')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.product_pattern_value }} </span>
        </template>
      </af-table-column>
      <!-- 项目 -->
      <af-table-column :label="$t('goods.project')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.project_value }} </span>
        </template>
      </af-table-column>
      <!-- 系列 -->
      <af-table-column :label="$t('goods.series')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.product_series_value }} </span>
        </template>
      </af-table-column>
      <!-- 主项目 -->
      <af-table-column :label="$t('goods.mainProject')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.main_project_value }} </span>
        </template>
      </af-table-column>
      <!-- 类目 -->
      <af-table-column :label="$t('goods.category')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.main_category_value }}</span>
        </template>
      </af-table-column>
      <!-- <af-table-column :label="$t('goods.goodsMainImage')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <img
            v-image-preview
            :src="scope.row.main_images[0].img_url"
            :alt="scope.row.main_images[0].img_name"
            :onerror="defaultImg"
            class="goods-image">
        </template>
      </af-table-column> -->
      <!-- <af-table-column :label="$t('goods.mainImageAddress')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.main_images[0].img_url }} </span>
        </template>
      </af-table-column> -->
      <!-- 允许使用 -->
      <af-table-column :label="$t('goods.permit')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.allow_use | allowFilter }} </span>
        </template>
      </af-table-column>
      <!-- 建档时间 -->
      <af-table-column :label="$t('goods.createTime')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.product_create_tme }} </span>
        </template>
      </af-table-column>
      <!-- 最后编辑时间 -->
      <af-table-column :label="$t('goods.lastEditTime')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.product_update_time }} </span>
        </template>
      </af-table-column>
      <!-- 详细信息 -->
      <!-- <af-table-column :label="$t('goods.detail')" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <router-link :to="'/goods/detail/'+scope.row.bar_code">
            <el-button type="primary" size="small">{{ $t('goods.view') }}</el-button>
          </router-link>
        </template>
      </af-table-column> -->
    </el-table>
    <el-col :span="24" class="pageOuter">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" class="pageInner" @pagination="getList" />
    </el-col>
  </el-container>
</template>

<script>
import { parseTime } from '@/utils/index.js'
import Pagination from '@/components/Pagination'
import { fetchList, fetchSelectOptions } from '@/api/goods'
import waves from '@/directive/waves'
import Clipboard from 'clipboard'
export default {
  name: 'GoodsList',
  components: { Pagination },
  directives: { waves },
  filters: {
    allowFilter(status) {
      const allowMap = {
        1: '是',
        0: '否'
      }
      return allowMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      downloadLoading: false, // 下载table字段 默认不下载
      multipleSelection: [], // 勾选的货品list
      list: null,
      listLoading: false, // 获取商品列表的加载状态 默认不加载
      isDisable: false, // 查询按钮的禁用状态 默认不禁用
      defaultImg: 'this.src = "' + require('@/assets/404_images/404.png') + '"', // 商品主图加载失败的默认图片
      // radio: '1', // 用户选择宝唯货号/恒康货号 默认宝唯货号
      listQuery: (() => {
        const date = new Date()
        const s1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())
        return {
          current: 1, // 分页器的当前页 默认第一页
          pageSize: 50, // 分页器每页条数 默认每页十条
          // 增加的变量名
          productCodeType: '1', // 货号类型：宝唯货号(1)/恒康货号(2) 默认宝唯货号
          productCodes: '', // 用户输入的宝唯货号/恒康货号集合
          // 增加结束
          barCode: '', // 条码
          styleId: '',
          shortName: '', // 货品简称
          listingDate: '', // 上市日期
          listingDateBegin: '', // 上市日期的开始日期
          listingDateEnd: '', // 上市日期的结束日期
          productCreateTime: ['2018-01-01', s1], // 建档时间
          productCreateTimeBegin: '2018-01-01 00:00:00', // 建档时间的开始日期
          productCreateTimeEnd: s1 + ' 00:00:00', // 建档时间的结束日期
          year: '', // 年份
          season: '', // 季节
          brand: '', // 品牌
          gender: '', // 性别
          category: '', // 类别
          pattern: '', // 款型
          series: '', // 系列
          project: '', // 项目
          productCode: '' // 货号
        }
      })(),
      productCodeType: 1, // 货号类型
      yearOptions: {}, // 年份下拉框list
      genderOptions: {}, // 性别下拉框list
      seasonOptions: {}, // 季节下拉框list
      brandOptions: {}, // 品牌下拉框list
      categoryOptions: {}, // 类别下拉框list
      modeOptions: {}, // 款型下拉框list
      seriesOptions: {}, // 系列下拉框list
      projectOptions: {}, // 项目下拉框list
      timeNow: '',
      tableHeight: window.innerHeight - 300, // 货品列表table高度
      screenHeight: window.innerHeight, // 屏幕高度
      total: 0, // 分页器总条数 默认0条
      screenWidth: '', // 屏幕宽度
      twoWordsWidth: '45px', // 搜索项(两个字)label默认宽度
      fourWordsWidth: '100px' // 搜索项(四个字)label默认宽度
    }
  },
  watch: {
    screenWidth: function(val) {
      this.screenWidth = val
    },
    listQuery: {
      handler: (val) => {
        if (window.localStorage) {
          // localStorage.setItem('goodsListParams', JSON.stringify(val))
        }
      },
      deep: true
    },
    screenHeight(val) {
      this.screenHeight = val
      this.tableHeight = this.screenHeight - 1600
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.listenResize())
    this.listQuery = null
  },
  mounted() {
    window.addEventListener('resize', this.listenResize())
  },
  created() {
    window.screenWidth = document.body.clientWidth
    this.screenWidth = window.screenWidth
    // 获取所有可选下拉框的的数据（头部搜索框，品牌，性别等等）
    this.getAllSelectOptions()
    // 获取数据
    this.getList()
  },
  methods: {
    // 宝唯货号/恒康货号输入的中文逗号替换成英文
    convertChineseComma() {
      // 如果只是单纯实时判断不能超过200条的话, 没必要对输入的数据做转换处理, 因为处理了会影响原有的输入数据
      let limitData = this.listQuery.productCodes
      limitData = limitData.replace(/，/g, ',').split(',')
      // this.listQuery.productCodes = this.listQuery.productCodes.replace(/，/g, ',')
      // // const limitData = this.listQuery.productCodes.split(',').filter(item => item !== '')
      // // 拿到用户输入的货号，处理数据格式
      // const limitData = []
      // this.listQuery.productCodes.split(',').map(item => {
      //   item = item.replace(/[\r\n]/g, '').trim()
      //   if (item) {
      //     limitData.push(item)
      //   }
      // })
      // 若用户输入超过200条货号，弹出提示
      if (limitData.length > 200) {
        // 控制只有输入第一次超出长度的时候,让他显示,并且需要手动关闭提示, 如果继续输入, 不再管, 但是不能点击确认
        if (!this.isDisable) {
          this.$message({
            showClose: true,
            message: '最多允许输入200条货号',
            type: 'error',
            duration: 0
          })
        }
        this.isDisable = true
      } else {
        this.isDisable = false
      }
    },
    listenResize() {
      window.screenHeight = window.innerHeight
      this.screenHeight = window.screenHeight
      window.screenWidth = document.body.clientWidth
      this.screenWidth = window.screenWidth
    },
    // 单击复制图片地址
    copyAddress() {
      var clipboard = new Clipboard('.tag-read')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1000
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        console.log('该浏览器不支持自动复制')
        this.$message({
          message: '复制失败',
          type: 'error'
        })
        clipboard.destroy()
      })
    },
    // 点击
    openDetails(val) {
      this.$router.push({ path: '/goods/detail/' + val.bar_code })
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 时间插件拼接
    listingDateChange(val) {
      if (val) {
        const dateArr = val.toString().split(',')
        this.listQuery.listingDateBegin = dateArr[0] + ' 00:00:00'
        this.listQuery.listingDateEnd = dateArr[1] + ' 00:00:00'
      } else {
        this.listQuery.listingDateBegin = ''
        this.listQuery.listingDateEnd = ''
      }
    },
    // 改变建档时间
    productCreateTimeChange(val) {
      if (val) {
        const dateArr = val.toString().split(',')
        this.listQuery.productCreateTimeBegin = dateArr[0] + ' 00:00:00'
        this.listQuery.productCreateTimeEnd = dateArr[1] + ' 00:00:00'
      } else {
        this.listQuery.productCreateTimeBegin = ''
        this.listQuery.productCreateTimeEnd = ''
      }
    },
    // 获取所有select
    getAllSelectOptions() {
      this.selectAllSelectOptions(data => {
        this.brandOptions = data.brand
        this.genderOptions = data.gender
        this.seasonOptions = data.season
        this.yearOptions = data.year
        this.projectOptions = data.project
        this.seriesOptions = data.series
        this.categoryOptions = data.type
        this.modeOptions = data.pattern
        this.$forceUpdate()
      })
    },
    // 查询所有select option
    selectAllSelectOptions(callback) {
      fetchSelectOptions().then(res => {
        const data = res.data.data
        // console.log(data)
        callback(data)
        // localStorage.setItem('goodsListSelectOptions', JSON.stringify(data))
        // return data
      })
    },
    // 过滤空值
    dealObjectValue(obj) {
      const param = {}
      if (obj === null || obj === undefined || obj === '') {
        return param
      }
      for (const key in obj) {
        if (typeof (obj[key]) === 'object' && obj[key]) {
          param[key] = this.dealObjectValue(obj[key])
        } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
          param[key] = obj[key]
        }
      }
      return param
    },
    // 清空数据
    filterParam(obj) {
      // 过滤属性的话, 只需要初步的去判断下, 是否是空值就行, 不用弄得太过复杂
      for (var key in obj) {
        if (!obj[key] || key === 'listingDate' || key === 'productCreateTime') {
          delete obj[key]
        }
      }
      return obj
      // const listingDateArr = Object.keys(obj.listingDate ? obj.listingDate : {})
      // const productCreateTimeArr = Object.keys(obj.productCreateTime ? obj.productCreateTime : {})
      // if (!listingDateArr.length) {
      //   obj.listingDateBegin = ''
      //   obj.listingDateEnd = ''
      // }
      // if (!productCreateTimeArr.length) {
      //   obj.productCreateTimeBegin = ''
      //   obj.productCreateTimeEnd = ''
      // }
      // return this.dealObjectValue(obj)
    },
    // 导出信息
    exportList(all, num) {
      if (num === 0) {
        this.$confirm('您未选择任何信息', '提示', {
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
        })
        return
      }
      this.$confirm('已勾选' + num + '条数据, 是否继续下载?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (all) {
          this.handleDownloadAll()
        } else {
          this.handleDownloadNormal()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下载'
        })
      })
    },
    // 下载所有字段
    handleDownloadAll() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 需要添加宝唯货号/恒康货号
        // const tHeader = [
        //   '条码', '宝唯货号', '恒康货号', '货品简称', '尺码类别',
        //   '尺码', '品牌', '年份', '项目', '吊牌价',
        //   '性别', '商业模式', '子项目', '子系列', '颜色',
        //   '季节', '货品英文名称', '货品全称', '主项目',
        //   '产地', '子款型', '建档时间', '款型',
        //   '系列', '类别', '上市日期', '最后编辑时间',
        //   '面料', '商品主图', '图片地址', '供应商', '类目', '款号',
        //   '允许使用'
        // ]
        // 新修改：去除条码，尺码，尺码类别字段
        const tHeader = [
          '宝唯货号', '恒康货号', '货品简称',
          '品牌', '年份', '项目', '吊牌价',
          '性别', '商业模式', '子项目', '子系列', '颜色',
          '季节', '货品英文名称', '货品全称', '主项目',
          '产地', '子款型', '建档时间', '款型',
          '系列', '类别', '上市日期', '最后编辑时间',
          '面料', '商品主图', '图片地址', '供应商', '类目', '款号',
          '允许使用'
        ]

        // 需要添加宝唯货号/恒康货号字段--依赖后端接口提供
        // const filterVal = ['bar_code', 'bw_product_code', 'product_code', 'short_name', 'size_type_value',
        //   'size_detail_value', 'brand_value', 'year', 'project_value', 'retail_price',
        //   'sex_value', 'business_pattern_tar', 'child_project_value', 'child_series_value', 'color_value',
        //   'develop_season_value', 'foreign_name', 'full_name', 'main_project_value',
        //   'producing_area', 'product_child_pattern_value', 'product_create_tme', 'product_pattern_value',
        //   'product_series_value', 'product_type_value', 'listing_date', 'product_update_time',
        //   'shell_fabric_value', '', 'main_image_address', 'supplier_value', '', 'product_pattern_code_value',
        //   'allow_use_tar'
        // ]
        // 新修改：去除bar_code(条码),size_type_value(尺码类别),size_detail_value(尺码)
        const filterVal = ['bw_product_code', 'product_code', 'short_name',
          'brand_value', 'year', 'project_value', 'retail_price',
          'sex_value', 'business_pattern_tar', 'child_project_value', 'child_series_value', 'color_value',
          'develop_season_value', 'foreign_name', 'full_name', 'main_project_value',
          'producing_area', 'product_child_pattern_value', 'product_create_tme', 'product_pattern_value',
          'product_series_value', 'product_type_value', 'listing_date', 'product_update_time',
          'shell_fabric_value', '', 'main_image_address', 'supplier_value', '', 'product_pattern_code_value',
          'allow_use_tar'
        ]
        const list = this.multipleSelection
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: parseTime(new Date()) + '全部商品信息',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    // 下载常规字段
    handleDownloadNormal() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 需要添加宝唯货号/恒康货号
        // const tHeader = ['宝唯货号', '恒康货号', '条码', '货品简称', '品牌',
        //   '颜色', '尺码类型', '尺码', '吊牌价',
        //   '年份', '季节', '上市日期', '产地',
        //   '性别', '类别', '款型', '项目',
        //   '系列', '主项目', '类目', '商品主图',
        //   '图片地址', '允许使用', '建档时间', '最后编辑时间'
        // ]
        // 新修改： 去除条码，尺码,尺码类别，字段
        const tHeader = ['宝唯货号', '恒康货号', '货品简称', '品牌', '颜色',
          '吊牌价',
          '年份', '季节', '上市日期', '产地',
          '性别', '类别', '款型', '项目',
          '系列', '主项目', '类目', '商品主图',
          '图片地址', '允许使用', '建档时间', '最后编辑时间'
        ]
        // 需要添加宝唯货号/恒康货号字段--依赖后端接口提供
        // 汇总导出类目不取值
        // 新修改：去除bar_code(条码),size_type_value(尺码类别),size_detail_value(尺码)
        const filterVal = ['bw_product_code', 'product_code', 'short_name', 'brand_value', 'color_value',
          'suggested_retail_price',
          'year', 'develop_season_value', 'listing_date', 'producing_area',
          'sex_value', 'product_type_value', 'product_pattern_value', 'project_value',
          'product_series_value', 'main_project_value', '', '',
          'main_image_address', 'allow_use_tar', 'product_create_tme', 'product_update_time'
        ]
        const list = this.multipleSelection
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: parseTime(new Date()) + '常用商品信息',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // 重新刷新页面
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    // 重置
    handleReset() {
      this.resetSearchItem()
      // 重置时选中宝唯货号
      this.listQuery.productCodeType = 1
      // this.getList()
    },
    // 情况搜索项
    resetSearchItem() {
      // 记录当前页current,点击查询的时候，在默认第一页开始查询
      this.listQuery = Object.assign(this.listQuery, {
        // 增加的变量名
        productCodeType: '1', // 货号类型：宝唯货号(1)/恒康货号(2) 默认宝唯货号
        productCodes: '', // 用户输入的宝唯货号/恒康货号集合
        // 增加结束
        barCode: '', // 条码
        styleId: '',
        shortName: '', // 货品简称
        listingDate: '', // 上市日期
        listingDateBegin: '', // 上市日期的开始日期
        listingDateEnd: '', // 上市日期的结束日期
        productCreateTime: [], // 清空建档事件
        productCreateTimeBegin: '', // 建档时间的开始日期
        productCreateTimeEnd: '', // 建档时间的结束日期
        year: '', // 年份
        season: '', // 季节
        brand: '', // 品牌
        gender: '', // 性别
        category: '', // 类别
        pattern: '', // 款型
        series: '', // 系列
        project: '', // 项目
        productCode: '' // 货号
      })
    },
    // 获取列表
    getList() {
      // 点击的时候, 拷贝一个对象, 不影响输入的内容
      const limitData = this.listQuery.productCodes.replace(/，/g, ',').split(',')
      if (!limitData[limitData.length - 1]) {
        limitData.pop()
      }
      // 处理用户输入的货号/条码的格式，去除空格、回车符等
      let str1 = ''
      limitData.map((item, index) => {
        item = item.replace(/[\r\n]/g, '').trim()
        // 处理最后多余逗号的格式
        if (item) {
          if (index !== limitData.length - 1) {
            str1 += item + ','
          } else {
            str1 += item
          }
        }
      })
      const str = JSON.stringify(this.listQuery)
      const params = JSON.parse(str)
      params.productCodes = str1.trim()
      // console.log(params.productCodes)
      // this.listQuery.productCodes = arr
      // this.listQuery.productCodes = this.listQuery.productCodes.trim()
      // if (this.listQuery.productCodes && this.listQuery.productCodes.split(',').length > 200) {
      //   this.listQuery.productCodes = this.listQuery.productCodes.substring(0, this.listQuery.productCodes.lastIndexOf(','))
      // }
      // if (this.listQuery.productCodes.charAt(this.listQuery.productCodes.length - 1) === ',') {
      //   this.listQuery.productCodes = this.listQuery.productCodes.substring(0, this.listQuery.productCodes.length - 1)
      // }
      this.isDisable = true
      // 去除掉loading
      this.listLoading = true
      this.list = []
      // 处理用户输入最后一条数据后有逗号，后端识别到会请求出错，前端做去除
      fetchList(this.filterParam(params)).then(response => {
        if (response.data.code !== '0') {
          this.$message.warning(response.data.msg)
          return
        }
        this.list = response.data.data
        console.log(response)
        // this.list = response.data
        const businessPatternMap = {
          '-1': '委托代销',
          '0': '受托代销',
          '1': '货品联营'
        }
        const allowMap = {
          1: '是',
          0: '否'
        }
        const listLength = this.list.length
        for (let i = 0; i < listLength; i++) {
          this.list[i].main_image_address = this.list[i].main_images[0].img_url
          this.list[i].allow_use_tar = allowMap[this.list[i].allow_use]
          this.list[i].business_pattern_tar = businessPatternMap[this.list[i].business_pattern]
          this.list[i].listing_date = this.list[i].listing_date.toString().substring(0, 10)
        }
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(error => {
        this.listLoading = false
        this.$message.warning(error.response.msg || error.response.error)
      }).finally(() => {
        this.listLoading = false
        this.isDisable = false
      })
    }
  }
}
</script>

<style>
  label {
    font-size: 11px !important;
    font-weight: 500;
  }
</style>
<style scoped>
.createDataTime {
  width: 100%;
  margin-bottom: -1px
}
.searchButton {
  text-align:center;
  margin-bottom: 20px;
  margin-left: 7%;
}
.copyImageAddress {
  color:#ff4d4d;
  font-size:12px;
  font-weight:normal;
  padding:0;
  margin:0;
}
.pageOuter {
  display: block;
  text-align: right;
}
.pageInner {
  padding: 0px 16px;
  margin-top:10px;
}
.order-box {
  display: block;
  width:100%;
  padding: 15px 40px;
}
  .info-list{
    margin: 10px;
  }
  .block_item{
    padding-bottom: 10px;
  }
  .goods-image{
    display: inline-block;
    width: 4em;
  }
  .blue-line{
    width: 15px;
    font-weight: 900;
    color: blue;
    display: inline-block;
  }
  .mr{
    margin: 10px 0;
  }
  .search-bar-col {
    margin-bottom: 2px
  }
 .search-bar-col .el-form-item__content{
   margin-bottom: -1px
 }
 .hi{
  margin-bottom: -1px
 }
 .el-divider{
   margin: 15px 0
 }
 .tableColor{
    color: black;
    box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1);
  }
</style>
