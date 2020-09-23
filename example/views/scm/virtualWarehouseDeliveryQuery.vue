<template>
  <div class="detail_container">
    <div class="header">
      <div class="left"/>
      <div class="right">调拨信息</div>
    </div>
    <div class="detail_msg">
      <el-row :gutter="10">
        <el-col :span="5">
          <el-col :span="7"><p>单号</p></el-col>
          <el-col :span="17">
            <el-input v-model="input_odd" placeholder="IR9920190906093001050001"/>
          </el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="7"><p>调拨方式</p></el-col>
          <el-col :span="17">
            <el-select v-model="value" clearable placeholder="实物调拨">
              <el-option
                v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="7"><p>操作员</p></el-col>
          <el-col :span="17">
            <el-input v-model="input_operator" placeholder="王立群"/>
          </el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="4"><p>备注</p></el-col>
          <el-col :span="20">
            <el-input v-model="input_remarks"/>
          </el-col>
        </el-col>
        <el-col :span="4">
          <el-col :span="7"><p>开单日期</p></el-col>
          <el-col :span="17">
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="2019-9-30"/>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="5">
          <el-col :span="7"><p>调出仓库</p></el-col>
          <el-col :span="17">
            <el-select v-model="value" clearable placeholder="宝唯东莞-A类平台大宗销售仓">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="15">
          <el-col :span="3"><p>出货地址</p></el-col>
          <el-col :span="21">
            <el-input v-model="input_delivery_address" placeholder="广东省东莞市"/>
          </el-col>
        </el-col>
        <el-col :span="4">
          <el-col :span="7"><p>调拨类型</p></el-col>
          <el-col :span="17">
            <el-select v-model="value" clearable placeholder="全部">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="5">
          <el-col :span="7"><p>调入仓库</p></el-col>
          <el-col :span="17">
            <el-select v-model="value" clearable placeholder="宝唯上海-宝唯唯品会大宗销售仓">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="15">
          <el-col :span="3"><p>收货地址</p></el-col>
          <el-col :span="21">
            <el-input v-model="input_receiving_address" placeholder="上海市闵行区申长路1588弄中骏广场10号楼4楼"/>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="5">
          <el-col :span="7"><p>发货单</p></el-col>
          <el-col :span="17">
            <el-input v-model="input_receiving_address" placeholder="IR9920190906093001050001-01"/>
          </el-col>
        </el-col>
      </el-row>
      <div class="detail_info">
        <ul>
          <li>总数量: 2000</li>
          <li>总金额: 1000000.00</li>
          <li>占库记录时间: 2019-9-30 11:00</li>
        </ul>
      </div>
    </div>
    <div class="header" style="margin-top:10px">
      <div class="left" />
      <div class="right">货品信息</div>
    </div>
    <div class="detail_result">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          prop="choose"
          label="选择"
          width="60"/>
        <el-table-column
          prop="bar_code"
          label="条码"
          width="170">filterable
          <!-- <template slot-scope="scope">
            <el-input
              v-model="scope.row.bar_code"
              placeholder=""
              clearable/>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="item_number"
          label="货号"
          width="160"/>
        <el-table-column
          prop="size"
          label="尺码"/>
        <el-table-column
          prop="price"
          label="吊牌价"/>
        <el-table-column
          prop="money"
          label="金额"/>
        <el-table-column
          prop="category"
          label="类别"/>
        <el-table-column
          prop="project"
          label="项目"/>
        <el-table-column
          prop="series"
          label="系列"/>
        <el-table-column
          prop="type"
          label="款型"/>
        <el-table-column
          prop="brand"
          label="品牌"/>
        <el-table-column
          prop="apply_account"
          label="申请数量"
          width="100">
          <!-- <template slot-scope="scope">
            <el-input
              v-model="scope.row.apply_account"
              clearable/>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="available_stock"
          label="可用库存数"
          width="100"/>
        <el-table-column
          prop="occupied_number"
          label="占库量"/>
        <el-table-column
          prop="actual_receive"
          label="实收数量"
          width="120">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.actual_receive"
              clearable/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="detail-pages">
      <div class="left">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="当前页全选"/>
          <el-checkbox label="所有页全选"/>
        </el-checkbox-group>
      </div>
      <div class="right">
        <!-- <el-pagination
          :current-page="currentPage4"
          :page-size="25"
          :page-sizes="[25, 50, 100, 200]"
          :total="200"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/> -->
        <page-common
          ref="page"
          :default-parameters="params"
          api=""
          method=""
          @query="query"
          @loading="load"/>
      </div>
    </div>
    <div class="detail_actions">
      <el-row>
        <el-button type="primary" size="small">导出明细信息</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import PageCommon from '@/components/PageCommon2'
export default {
  name: 'VirtualWarehouseDeliveryQuery',
  components: {
    PageCommon
  },
  data() {
    return {
      tableData: [
        // {
        //   choose: '',
        //   bar_code: '',
        //   item_number: '',
        //   size: '',
        //   price: '',
        //   money: '',
        //   category: '',
        //   project: '',
        //   series: '',
        //   type: '',
        //   brand: '',
        //   apply_account: '',
        //   occupied_number: '',
        //   available_stock: '',
        //   treasury_records: ''
        // },
        {
          choose: '4048188305010',
          bar_code: '10005801-A03',
          item_number: '10005813-A03',
          size: 'S',
          price: '599.00',
          money: '599000',
          category: '服装',
          project: '短袖',
          series: '生活系列',
          type: '短袖T恤',
          brand: 'PUMA',
          apply_account: '100',
          occupied_number: '1000',
          available_stock: '9000',
          actual_receive: ''
        }
        // {
        //   choose: '',
        //   bar_code: '',
        //   item_number: '10005813-A03',
        //   size: 'S',
        //   price: '599.00',
        //   money: '599000',
        //   category: '服装',
        //   project: '短袖',
        //   series: '生活系列',
        //   type: '短袖T恤',
        //   brand: 'PUMA',
        //   apply_account: '',
        //   occupied_number: '1000',
        //   available_stock: '9000',
        //   treasury_records: '2019-9-30 11:00 占库成功'
        // },
        // {
        //   choose: '',
        //   bar_code: '',
        //   item_number: '10005813-A03',
        //   size: 'S',
        //   price: '599.00',
        //   money: '599000',
        //   category: '服装',
        //   project: '短袖',
        //   series: '生活系列',
        //   type: '短袖T恤',
        //   brand: 'PUMA',
        //   apply_account: '',
        //   occupied_number: '1000',
        //   available_stock: '9000',
        //   treasury_records: '2019-9-30 11:00 占库失败'
        // }
      ],
      checkList: ['复选框 A'],
      input_odd: '',
      input_operator: '',
      input_remarks: '',
      input_delivery_address: '',
      input_receiving_address: '',
      restaurants: [],
      state4: '',
      timeout: null,
      options2: [{
        value: '选项1',
        label: '店调拨'
      }, {
        value: '选项2',
        label: '出货'
      }, {
        value: '选项3',
        label: '回货'
      }, {
        value: '选项4',
        label: '转仓'
      }, {
        value: '选项5',
        label: '区调拨'
      }],
      value: '',
      options3: [{
        value: '选项1',
        label: '商品-新货-派车'
      }, {
        value: '选项2',
        label: '商品-货品整合-派车'
      }, {
        value: '选项3',
        label: '商品-货品整合-自提'
      }, {
        value: '选项4',
        label: '商品-季节回货-派车'
      }, {
        value: '选项5',
        label: '商品-备货-派车'
      }, {
        value: '选项6',
        label: '商品-备货-派车'
      }, {
        value: '选项7',
        label: '商品-备货-自提'
      }, {
        value: '选项8',
        label: '零售-货品整合-派车'
      }, {
        value: '选项9',
        label: '零售-货品整合-自提'
      }, {
        value: '选项10',
        label: '自行调拨-走账'
      }, {
        value: '选项11',
        label: '预售调拨'
      }, {
        value: '选项12',
        label: '自行调拨-差异调整'
      }, {
        value: '选项13',
        label: '拒收调拨'
      }, {
        value: '选项14',
        label: '商品-自动销补-派车'
      }, {
        value: '选项15',
        label: '拍照-快递'
      }],
      options4: [{
        value: '选项1',
        label: '未送审'
      }, {
        value: '选项2',
        label: '占库中'
      }, {
        value: '选项3',
        label: '待审核'
      }, {
        value: '选项4',
        label: '已作废'
      }, {
        value: '选项5',
        label: '已退回'
      }, {
        value: '选项6',
        label: '已审核'
      }, {
        value: '选项7',
        label: '已驳回'
      }, {
        value: '选项8',
        label: '已完成'
      }]
    }
  }
}
</script>

<style scoped>
.detail_actions {
  text-align: center;
  border: 1px solid #efefef;
  padding-top: 20px;
}
.detail-pages {
  height: 40px;
  border: 1px solid #efefef;
  margin-top: 10px;
  /* padding-top: 3px; */
  /* margin: auto; */
  margin-bottom: 20px;
  overflow: hidden;
}
.detail-pages > .left {
  float: left;
  line-height: 40px;
  margin-left: 10px;
}
.detail-pages > .right {
  float: right;
  line-height: 40px;
  margin-top: -18px;
  margin-right: 20px;
}
.detail_result {
  margin-top: 10px;
}
.detail_msg {
  width: 100%;
  height: 300px;
  border: 1px solid #efefef;
  margin-top: 10px;
  border-radius: 6px;
  padding-top: 10px;
  padding-left: 10px;
  font-size: 12px;
  position: relative;
}

.detail_info > ul {
  position: absolute;
  bottom: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  height: 10px;
}
.detail_info > ul > li {
  margin: 0 10px;
}
.detail_container {
  margin: 20px 0 0 20px;
}
.header {
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.header > .left {
  display: inline-block;
  width: 3px;
  height: 25px;
  background-color: rgb(64, 158, 255);
}
.header > .right {
  font-size: 12px;
  margin-left: 5px;
}
.el-row {
  margin-bottom: 20px;
  /* &:last-child {
    margin-bottom: 0;
  } */
}
.el-col {
  border-radius: 4px;
}
</style>
