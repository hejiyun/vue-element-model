<template>
  <div class="add_container">
    <div class="header">
      <div class="left"/>
      <div class="right">调拨信息填写</div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-col :span="6"><p>单号</p></el-col>
          <el-col :span="18">
            <el-input v-model="input_odd" placeholder="请输入"/>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><p>调拨方式</p></el-col>
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
        <el-col :span="6">
          <el-col :span="6"><p>调拨类型</p></el-col>
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
        <el-col :span="6">
          <el-col :span="5"><p>备注</p></el-col>
          <el-col :span="19">
            <el-input v-model="input_remarks"/>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-col :span="6"><p>调出仓库</p></el-col>
          <el-col :span="18">
            <el-select v-model="value" clearable placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="3"><p>出货地址</p></el-col>
          <el-col :span="21">
            <el-input v-model="input_delivery_address"/>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="5"><p>操作员</p></el-col>
          <el-col :span="19">
            <el-input v-model="input_operator" placeholder="王立群"/>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
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
        <el-col :span="12">
          <el-col :span="3"><p>收货地址</p></el-col>
          <el-col :span="21">
            <el-input v-model="input_receiving_address"/>
          </el-col>
        </el-col>
      </el-row>
      <el-col style="margin-left:40%;">
        <el-col :span="2">
          <el-button type="primary" size="small">下载模板</el-button>
        </el-col>
        <el-col :span="2">
          <el-upload
            :on-change="handleChange"
            :file-list="fileList3"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            style="margin-left:20px">
            <el-button size="small" type="primary">批量导入</el-button>
            <!-- <div slot="tip" class="el-upload__tip">可上传excel文件</div> -->
          </el-upload>
        </el-col>
        <!-- <el-button type="primary" size="small">批量导入</el-button> -->
      </el-col>
      <el-col style="margin:20px 0;font-size:12px;">
        <el-col :span="2">
          <span>总数量:</span>
        </el-col>
        <el-col :span="2">
          <span>总金额:</span>
        </el-col>
        <el-col :span="2">
          <span>占库记录时间:</span>
        </el-col>
        <!-- <ul>
          <li>总数量: 2000</li>
          <li>总金额: 1000000.00</li>
          <li>占库记录时间: 2019-9-30 11:00</li>
        </ul> -->
      </el-col>
    </div>
    <div class="header" style="margin-top:10px">
      <div class="left"/>
      <div class="right">货品信息填写</div>
    </div>
    <div class="add_result">
      <!-- <Table /> -->
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
          prop="item_number"
          label="货号"
          width="180">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.item_number"
              :data-id="scope.$index"
              placeholder=""
              class="itemNumber_input"
              @keyup.native="barCodeShow"/>
            <div v-if="tableData4.length>0 && index === scope.$index" :class="scope.$index < 4 ? 'barCode_box' : 'barCode_box2'" @mouseleave="addData">
              <el-table
                ref="multipleTable"
                :data="tableData4"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="40"/>
                <el-table-column
                  prop="barCode"
                  label="条码"
                  width="120"/>
                <el-table-column
                  prop="size"
                  label="尺寸"
                  width="50"/>
                <el-table-column
                  prop="stock"
                  label="库存"
                  width="50"/>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="bar_code"
          label="条码"
          width="150">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.bar_code"
              placeholder=""
              clearable/>
          </template>
        </el-table-column>
        <el-table-column
          prop="apply_account"
          label="申请数量"
          width="110">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.apply_account"
              clearable/>
          </template>
        </el-table-column>
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
        <!-- <el-table-column
          prop="occupied_number"
          label="占库数"/> -->
        <el-table-column
          prop="available_stock"
          label="可用库存数"
          width="100"/>
      </el-table>
    </div>
    <div class="add-pages">
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
    </div>
    <div class="add_actions">
      <el-row>
        <el-button type="primary" size="small">批量清除</el-button>
        <el-button type="primary" size="small">保存草稿</el-button>
        <el-button type="primary" size="small">确认单据</el-button>
        <el-button type="primary" size="small">作废单据</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import Table from './components/table.vue'
import PageCommon from '@/components/PageCommon2'
export default {
  name: 'ScmAdd',
  components: {
    Table,
    PageCommon
  },
  data() {
    return {
      fileList3: [],
      tableData: [
        {
          choose: '',
          bar_code: '',
          item_number: '',
          size: 'S',
          price: '599.00',
          money: '599000',
          category: '服装',
          project: '短袖',
          series: '生活系列',
          type: '短袖T恤',
          brand: 'PUMA',
          apply_account: '',
          occupied_number: '1000',
          available_stock: '9000'
        },
        {
          choose: '',
          bar_code: '',
          item_number: '',
          size: 'S',
          price: '599.00',
          money: '599000',
          category: '服装',
          project: '短袖',
          series: '生活系列',
          type: '短袖T恤',
          brand: 'PUMA',
          apply_account: '',
          occupied_number: '1000',
          available_stock: '9000'
        },
        {
          choose: '',
          bar_code: '',
          item_number: '',
          size: 'S',
          price: '599.00',
          money: '599000',
          category: '服装',
          project: '短袖',
          series: '生活系列',
          type: '短袖T恤',
          brand: 'PUMA',
          apply_account: '',
          occupied_number: '1000',
          available_stock: '9000'
        },
        {
          choose: '',
          bar_code: '',
          item_number: '',
          size: 'S',
          price: '599.00',
          money: '599000',
          category: '服装',
          project: '短袖',
          series: '生活系列',
          type: '短袖T恤',
          brand: 'PUMA',
          apply_account: '',
          occupied_number: '1000',
          available_stock: '9000'
        },
        {
          choose: '',
          bar_code: '',
          item_number: '',
          size: 'S',
          price: '599.00',
          money: '599000',
          category: '服装',
          project: '短袖',
          series: '生活系列',
          type: '短袖T恤',
          brand: 'PUMA',
          apply_account: '',
          occupied_number: '1000',
          available_stock: '9000'
        },
        {
          choose: '',
          bar_code: '',
          item_number: '',
          size: 'S',
          price: '599.00',
          money: '599000',
          category: '服装',
          project: '短袖',
          series: '生活系列',
          type: '短袖T恤',
          brand: 'PUMA',
          apply_account: '',
          occupied_number: '1000',
          available_stock: '9000'
        },
        {
          choose: '',
          bar_code: '',
          item_number: '',
          size: 'S',
          price: '599.00',
          money: '599000',
          category: '服装',
          project: '短袖',
          series: '生活系列',
          type: '短袖T恤',
          brand: 'PUMA',
          apply_account: '',
          occupied_number: '1000',
          available_stock: '9000'
        }
      ],
      checkList: ['复选框 A'],
      input_odd: 'IM1902938399-001',
      input_operator: '',
      input_remarks: '',
      input_delivery_address: '',
      input_receiving_address: '',
      options: '',
      tableData3: [
        {
          barCode: '404818839557',
          size: 'S',
          stock: '90'
        }, {
          barCode: '404818839558',
          size: 'M',
          stock: '190'
        }, {
          barCode: '404818839558',
          size: 'M',
          stock: '190'
        }, {
          barCode: '404818839558',
          size: 'M',
          stock: '190'
        }
      ],
      tableData4: [],
      index: '',
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
      selection: []
    }
  },
  methods: {
    barCodeShow(e) {
      if (e.key === 'Enter') {
        this.tableData4 = this.tableData3
        this.index = parseInt(e.target.dataset.id)
      } else {
        this.tableData4 = []
      }
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    addData() {},
    handleChange() {},
    query() {},
    load() {}
  }
}
</script>

<style scoped>
.itemNumber_input {
  position: relative;
}
.barCode_box {
  position: absolute;
  left: -30%;
  /* top: -170px; */
  /* height: 170px; */
  z-index: 99;
  border: none;
  overflow: auto;
  border: 1px solid #eee;
  box-shadow: 2px 2px 10px #999;
  margin-top: 4px;
}
.barCode_box2 {
  position: absolute;
  left: -35%;
  top: -170px;
  height: 170px;
  z-index: 99;
  border: none;
  overflow: auto;
  border: 1px solid #eee;
  box-shadow: 2px 2px 10px #999;
  margin-top: 4px;
}
.barCode_box > .el-table {
  border: none;
}
.cell {
  font-size: 12px;
  font-weight: normal;
}
.add_actions {
  text-align: center;
  border: 1px solid #efefef;
  padding-top: 20px;
}
.add-pages {
  height: 40px;
  border: 1px solid #efefef;
  /* margin-top: 50px; */
  /* padding-top: 3px; */
  /* margin: auto; */
  /* margin-bottom: 20px; */
  overflow: hidden;
}
.add-pages > .left {
  float: left;
  line-height: 40px;
  margin-left: 10px;
}
.add-pages > .right {
  float: right;
  line-height: 40px;
  margin-top: -18px;
  margin-right: 20px;
}
.add_result {
  margin-top: 10px;
  width: 100%;
  height: 100%;
}
.add_msg {
  width: 100%;
  height: 220px;
  border: 1px solid #efefef;
  margin-top: 10px;
  border-radius: 6px;
  padding-top: 10px;
  padding-left: 10px;
  font-size: 12px;
  position: relative;
}
.add_button {
  /* display: flex;
  flex-direction: row; */
  align-items: center;
  /* position: absolute; */
  /* bottom: 20px; */
  /* margin-left: 40%; */
}
/* .add_info > ul {
  position: absolute;
  bottom: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  height: 10px;
}
.add_info > ul > li {
  margin: 0 10px;
} */
.add_container {
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
