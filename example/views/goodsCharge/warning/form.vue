<template>
  <div class="bwform">
    <el-form v-if="form" :inline="true" :model="form" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="form.warn_book_no" placeholder="平台订单编号"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.warn_hk_product_code" placeholder="恒康货号"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="form.creat_time"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          end-placeholder="结束日期"
          clearable
          @change="listingDateChange"/>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.shop_code"
          filterable
          clearable
          placeholder="选择店铺">
          <el-option
            v-for="(item, index) in getShopCodeList"
            :key="index"
            :label="item.vendCustCode+'  '+item.vendCustName"
            :value="item.vendCustCode"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      getShopCodeList: null // 店铺名称code
    }
  },
  created() {
    this.getShopCode()
  },
  methods: {
    async getShopCode() {
      const res = await this.$api.getCustorm1()
      this.getShopCodeList = res.data.data
    },
    onSubmit() {
      this.$emit('EventType', 1, this.form)
    },
    reset() {
      this.$emit('EventType', 2, null)
    },
    // 时间插件拼接
    listingDateChange(val) {
      if (val) {
        const dateArr = val
        this.form.create_time_start = dateArr[0]
        this.form.create_time_end = dateArr[1]
      } else {
        this.form.create_time_start = ''
        this.form.create_time_end = ''
      }
    }
  }
}
</script>
