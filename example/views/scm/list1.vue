<template>
  <div class="list_container">
    <div class="header">
      <div class="left" />
      <div class="right">查询条件</div>
    </div>
    <div class="list_condition">
      <el-row :gutter="4">
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p>单号</p></el-col>
          <el-col :span="18">
            <el-input v-model="input_odd" placeholder="请输入"/>
          </el-col>
        </el-col>
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p>调出仓库</p></el-col>
          <el-col :span="18">
            <el-select v-model="value" clearable placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p>调入仓库</p></el-col>
          <el-col :span="18">
            <el-select v-model="value" clearable placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p>货号</p></el-col>
          <el-col :span="18">
            <el-select v-model="value" clearable placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p class="demonstration">开单日期</p></el-col>
          <el-col :span="18">
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="4">
        <!-- <el-col :span="4">
          <el-col :span="4"><p>备注</p></el-col>
          <el-col :span="18">
            <el-input v-model="input_remarks" placeholder="模糊查询"/>
          </el-col>
        </el-col> -->
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p>调拨类型</p></el-col>
          <el-col :span="18">
            <el-select v-model="value" clearable placeholder="全部">
              <el-option
                v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p>单据状态</p></el-col>
          <el-col :span="18">
            <el-select v-model="value" clearable placeholder="全部">
              <el-option
                v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p>调拨方式</p></el-col>
          <el-col :span="18">
            <el-select v-model="value" clearable placeholder="全部">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-col>
        <el-col :xs="6" :sm="12" :md="4" :lg="4" :xl="4">
          <el-col :span="6"><p>操作员</p></el-col>
          <el-col :span="18">
            <el-input v-model="input_operator" placeholder="王立群"/>
          </el-col>
        </el-col>
      </el-row>
      <div class="list_button">
        <el-button type="primary" icon="el-icon-search" size="small">查询</el-button>
        <el-button type="primary" size="small" @click="toAdd">新增</el-button>
        <el-button type="primary" size="small">导出列表</el-button>
        <el-button type="primary" size="small">导出明细</el-button>
      </div>
      <div class="list_info">
        <ul>
          <li>总数量: 2000</li>
          <li>总金额: 1000000.00</li>
          <li>占库记录时间: 2019-9-30 11:00</li>
        </ul>
      </div>
    </div>
    <div class="header" style="margin-top:10px">
      <div class="left" />
      <div class="right">查询结果</div>
    </div>
    <div class="list_result">
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
          prop="odd_numbers"
          label="单号"
          width="145"/>
        <el-table-column
          prop="output"
          label="调出仓库"
          width="120"/>
        <el-table-column
          prop="input"
          label="调入仓库"
          width="120"/>
        <el-table-column
          prop="apply_quantity"
          label="申请数量"/>
        <el-table-column
          prop="money"
          label="金额"/>
        <el-table-column
          prop="opening_date"
          label="开单日期"/>
        <el-table-column
          prop="auditor"
          label="审核员"/>
        <el-table-column
          prop="audit_date"
          label="审核日期"/>
        <el-table-column
          prop="document_status"
          label="单据状态"/>
        <el-table-column
          prop="available_stock"
          label="可用库存数"
          width="90"/>
        <el-table-column
          prop="stock_occupancy"
          label="占库量"/>
        <el-table-column
          prop="treasury_records"
          label="占库记录"
          width="120"/>
        <el-table-column
          prop="submitter"
          label="提交人"/>
        <el-table-column
          prop="detailed_information"
          label="明细信息">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini">查看</el-button> -->
            <router-link to="/scm/detail" style="color:red">查看</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" style="color:red;font-size:12px" @click="open">申请取消</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="output_quantity"
          label="调出数量"/>
        <el-table-column
          prop="input_quantity"
          label="调入数量"/>
        <el-table-column
          prop="output_date"
          label="调出日期"/>
        <el-table-column
          prop="output_effective_date"
          label="调出生效日期"/>
        <el-table-column
          prop="input_date"
          label="调入日期"/>
        <el-table-column
          prop="input_effective_date"
          label="调入生效日期"/>
        <el-table-column
          prop="deliver_invoice"
          label="发货单"
          width="">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">查看</el-button>
            <!-- <router-link style="color:red">查看</router-link> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="receiving_invoice"
          label="收货单"
          width="">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">查看</el-button>
            <!-- <router-link style="color:red">查看</router-link> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          width="100"/>
      </el-table>
    </div>
    <div class="list-pages">
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
          api=""
          method=""
          @query="query"
          @loading="load"/>
      </div>
      <!-- 如果分页器请求数据时需要携带参数，加上下面这一项 -->
      <!-- :default-parameters="params" -->
      <!-- query 请求时返回的数据 -->
      <!-- load 加载 -->
    </div>
  </div>
</template>

<script>
import PageCommon from '@/components/PageCommon2'
export default {
  name: 'ScmList',
  components: {
    PageCommon
  },
  data() {
    return {
      value: '',
      value1: '',
      input_odd: '',
      input_remarks: '',
      input_ways: '',
      input_operator: '',
      options: [],
      tableData: [
        {
          choose: '',
          odd_numbers: 'IR1906272440136-003',
          output: '宝唯昆山-A类平台大宗销售仓',
          input: '宝胜昆山-昆山宝唯客退电子商务仓',
          apply_quantity: '100',
          money: '6600.00',
          opening_date: '2019/6/27',
          auditor: '王立群',
          audit_date: '2019/6/29',
          document_status: '待审核',
          available_stock: '',
          stock_occupancy: '',
          treasury_records: '2019-9-30   11：00 占库失败',
          submitter: '',
          detailed_information: '',
          operation: '',
          output_quantity: '100',
          input_quantity: '99',
          output_date: '2019/5/25',
          output_effective_date: '2019/5/26',
          input_date: '2019/5/26',
          input_effective_date: '2019/5/26',
          deliver_invoice: '已生效',
          receiving_invoice: '已生效',
          remarks: '新增页面填写'
        }
      ],
      checkList: ['选中且禁用', '复选框 A'],
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
        label: '商品-回收-派车'
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
  },
  methods: {
    toAdd() {
      this.$router.push('/scm/add')
    },
    open() {
      this.$confirm('确定取消调拨申请单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '申请成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '申请失败'
        })
      })
    },
    query() {
    },
    load() {
    }
  }
}
</script>

<style scoped>
.el-checkbox__label {
  font-size: 12px;
}
.list-pages {
  height: 40px;
  border: 1px solid #efefef;
  margin-top: 10px;
  /* padding-top: 3px; */
  /* margin: auto; */
  margin-bottom: 20px;
  overflow: hidden;
}
.list-pages > .left {
  float: left;
  line-height: 40px;
  margin-left: 10px;
}
.list-pages > .right {
  float: right;
  line-height: 40px;
  margin-top: -18px;
  margin-right: 20px;
}
.cell {
  font-size: 12px;
  text-align: center;
}
.el-input__inner {
  font-size: 12px;
}
.el-col {
  font-size: 12px;
  margin-top: 5px;
}
.list_container {
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
.list_condition {
  width: 100%;
  border: 1px solid #efefef;
  margin-top: 10px;
  border-radius: 6px;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 80px;
  position: relative;
}
.list_button {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 25px;
  margin-left: 45%;
}
.list_info > ul {
  position: absolute;
  bottom: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  height: 10px;
}
.list_info > ul > li {
  margin: 0 10px;
}
.list_result {
  margin-top: 10px;
}
</style>
