<template>
  <div v-if="form" class="SeachItem">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="form.hk_product_code" placeholder="恒康货号"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.short_name" placeholder="货品简称"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="form.listingdate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期"
          clearable
          @change="listingDateChange"/>
      </el-form-item>
      <el-form-item>
        <el-select v-if="selectData&&selectData.brand" v-model="form.brand_key" clearable placeholder="选择品牌">
          <el-option
            v-for="(item,index) in selectData.brand"
            :key="index"
            :label="item.dic_value"
            :value="item.dic_key"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-if="selectData&&selectData.season" v-model="form.develop_season_key" clearable placeholder="选择季节">
          <el-option
            v-for="(item,index) in selectData.season"
            :key="index"
            :label="item.dic_value"
            :value="item.dic_key"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-if="selectData&&selectData.gender" v-model="form.sex_key" clearable placeholder="选择性别">
          <el-option
            v-for="(item,index) in selectData.gender"
            :key="index"
            :label="item.dic_value"
            :value="item.dic_key"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.is_monitor">单品设置监控</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="priceExport()">导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dataImport()">数据导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" plain @click="watchAllprice()">全局价格监控</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    selectData: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    onSubmit() {
      this.$emit('EventType', 1, this.form)
    },
    priceExport() {
      this.$emit('EventType', 2, null)
    },
    dataImport() {
      this.$emit('EventType', 3, null)
    },
    watchAllprice() {
      this.$emit('EventType', 4, null)
    },
    // 时间插件拼接
    listingDateChange(val) {
      if (val) {
        const dateArr = val.toString().split(',')
        this.form.listing_date_start = dateArr[0] + ' 00:00:00'
        this.form.listing_date_end = dateArr[1] + ' 00:00:00'
      } else {
        this.form.listing_date_start = ''
        this.form.listing_date_end = ''
      }
    }
  }
}
</script>
