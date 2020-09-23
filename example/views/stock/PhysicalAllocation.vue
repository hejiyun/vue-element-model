<template>
  <div class="PhysicalAllocation">
    <el-container class="stock-box">
      <el-col class="searchBox searchbg">
        <el-form ref="form" :model="form">
          <el-col>
            <el-form-item class="switchStock">
              <el-radio-group v-model="form.type" size="mini" @change="changeTips">
                <el-radio-button v-model="materialCodeList" label="materialCodeList">货号</el-radio-button>
                <el-radio-button v-model="barCodeList" label="barCodeList" style="margin-left:-2px;">条码</el-radio-button>
              </el-radio-group>
              <span style="color: red; font-size: 16px; padding-left: 4px;">*</span>
              <el-input ref="gdt" :autosize="{ minRows: 2, maxRows: 3 }" v-model="form.chooseMatOrBar" placeholder="可批量输入 以英文逗号隔开" type="textarea" @keyup.native="numLimit" @scroll="showScrollBar"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="仓库类别">
              <!-- 增加仓库类别的传参参数 -->
              <el-select v-model="form.warehouseType" clearable style="width:100%" placeholder="全部" @change="getTypeToWarehouse">
                <el-option
                  v-for="item in warehouseTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item class="bt" label="仓库">
              <Select ref="sle" :porpsType="warehouseType" :isRset="isReset" @getValue="getvalue"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="品牌">
              <el-select v-model="form.brandCodeList" style="width:100%" filterable reserve-keyword multiple collapse-tags placeholder="全部">
                <el-option
                  v-for="item in brandList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="实物数≥">
              <el-input v-model="form.minTotalQty" placeholder="请输入整数" type="number" @blur="getInteger(form)"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="未分配可用数≥">
              <el-input v-model="form.minUnallocatedQty" placeholder="请输入整数" type="number" @blur="getInteger(form)"/>
            </el-form-item>
          </el-col>
          <el-col>
            <div class="grid-content bg-purple toLeft">
              <el-button type="primary" @click="search(form)">查询</el-button>
              <el-button type="primary" @click="reset(form)">重置</el-button>
              <el-button :disabled="undisable" type="primary" @click="Export(form)">导出</el-button>
              <el-button :disabled="!form.chooseMatOrBar" type="primary" @click="distGoods(form)">批量分货</el-button>
              <!-- 批量上架导入 -->
              <PhysicalBatch/>
              <el-drawer
                v-loading="loading"
                ref="drawer"
                :visible.sync="dialog"
                :before-close="clickOutOfDrawer"
                :show-close="false"
                class="dialog_d"
                size="40%"
                title="批量上架设置"
                direction="rtl"
                custom-class="demo-drawer"
                style="text-align:center">
                <div class="demo-drawer__content">
                  <el-form :model="form" style="padding:0 10% 0 5%">
                    <!-- <el-col>
                        <span style="color: red;font-size:16px">*</span>
                      </el-col> -->
                    <el-form-item :label-width="formLabelWidth" label="请选择分配仓库">
                      <el-select
                        :loading="loadingWarehouse"
                        :remote-method="remoteSearchWarehouse"
                        v-model="distWarehouse"
                        remote
                        filterable
                        clearable
                        style="width:100%"
                        placeholder="全部"
                        @change="screenChannel"
                        @clear="clearWarehouse">
                        <el-option
                          v-for="item in distWarehouseList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                          <span style="float: left;color: #8492a6;font-size: 13px;">{{ item.value }}</span>
                          <span style="float: left;padding-left:40px;color: #8492a6;font-size: 13px;">{{ item.label }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="请选择分配维度">
                      <el-select v-model="value2" placeholder="请选择" style="margin-left:-48%" @change="clearInput">
                        <el-option label="比例分配" value="1"/>
                        <el-option label="组合分配(数量+比例)" value="2"/>
                      </el-select>
                    </el-form-item>
                    <div v-if="value2 === '1'">
                      <el-form-item>
                        <p style="margin-left:-61%;font-size:14px;">设置各渠道分配比例：</p>
                        <el-row>
                          <el-col :span="6"><span>渠道代码</span></el-col>
                          <el-col :span="8"><span>渠道</span></el-col>
                          <el-col :span="4"><span>业务类型</span></el-col>
                          <el-col :span="6"><span>比例</span></el-col>
                        </el-row>
                        <el-row v-for="(item, index) in fenpeiQudao" :key="index" class="proportion">
                          <el-col :span="24" style="margin:10px 0">
                            <el-col :span="6">
                              <span>{{ item.channelCode }}</span>
                            </el-col>
                            <el-col :span="8">
                              <span>{{ item.channelName }}</span>
                            </el-col>
                            <el-col :span="4">
                              <span>{{ item.bizTypeName }}</span>
                            </el-col>
                            <el-col :span="6">
                              <el-col v-if="item">
                                <el-col :span="13" style="margin-left:20px">
                                  <el-input v-model="item.point" size="mini" placeholder="0" @keyup.native="testValue(item)"/>
                                </el-col>
                                <el-col :span="4"><span>%</span></el-col>
                              </el-col>
                            </el-col>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </div>
                    <div v-if="value2 === '2'">
                      <el-form-item>
                        <el-col :span="8"><p style="margin-left:-5%;font-size:14px;">请设置数值区间：</p></el-col>
                        <el-col :span="6" style="margin-left:-4%;">
                          <el-input v-model="inputMin" placeholder="*必填" style="text-align:center;font-size:14px;"/>
                        </el-col>
                        <el-col :span="1">
                          <p>-</p>
                        </el-col>
                        <el-col :span="6">
                          <el-input v-model="inputMax" placeholder="" style="font-size:14px"/>
                        </el-col>
                      </el-form-item>
                      <el-form-item>
                        <p style="margin-left:-66%">设置各渠道分配比例：</p>
                        <el-row>
                          <el-col :span="6"><span>渠道代码</span></el-col>
                          <el-col :span="8"><span>渠道</span></el-col>
                          <el-col :span="4"><span>业务类型</span></el-col>
                          <el-col :span="6"><span>比例</span></el-col>
                        </el-row>
                        <el-row v-for="(item, index) in fenpeiQudao" :key="index" class="proportion">
                          <el-col :span="24" style="margin:10px 0">
                            <el-col :span="6">
                              <span>{{ item.channelCode }}</span>
                            </el-col>
                            <el-col :span="8">
                              <span>{{ item.channelName }}</span>
                            </el-col>
                            <el-col :span="4">
                              <span>{{ item.bizTypeName }}</span>
                            </el-col>
                            <el-col v-if="item" :span="6">
                              <el-col :span="13" style="margin-left:20px">
                                <el-input v-model="item.point" size="mini" placeholder="0" @keyup.native="testValue(item)"/>
                              </el-col>
                              <el-col :span="6"><span>%</span></el-col>
                            </el-col>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </div>
                  </el-form>
                  <div class="demo-drawer__footer" style="margin-top:50px">
                    <el-button :disabled="(value2 === '2') && !inputMin" type="primary" style="margin:0 20px 0 0" @click="confirm">确定</el-button>
                    <el-button @click="dialog = false">取 消</el-button>
                  </div>
                  <el-dialog :visible.sync="dialogTableVisible2" :close-on-click-modal="false" title="处理完成" append-to-body style="text-align:center" @close="close2">
                    <span style="margin:0 0 0 -68%;color:red">以下sku条码分配失败，请重新分配！</span>
                    <el-table :data="data2" style="margin:15px 0 10px 0;" height="300" border>
                      <af-table-column property="barCode" label="sku条码" align="center"/>
                      <af-table-column property="channelName" label="分配渠道" align="center"/>
                      <af-table-column property="allocatedQty" label="最终分配结果" align="center"/>
                    </el-table>
                    <el-pagination
                      :current-page="currentPage"
                      :page-sizes="[10, 20, 30, 40]"
                      :page-size="pageSize"
                      :total="gridData.length"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handleFailInfoSizeChange"
                      @current-change="handleFailInfoCurrentChange"/>
                  </el-dialog>
                </div>
              </el-drawer>
            </div>
          </el-col>
        </el-form>
        <div class="showbox" style="color:#00ace6;cursor:pointer;text-align:right;">
          <span v-if="!show" style="text-decoration: underline" @click="showMore">展开查看商品详情
            <i class="el-icon-right"/>
          </span>
          <span v-if="show" style="text-decoration: underline" @click="closeMore">
            <i class="el-icon-back"/>
            收起
          </span>
        </div>
      </el-col>
      <div class="showbox">
        <el-table
          ref="physicalAllocationTable"
          :data="tableData"
          :header-cell-style="{background: '#204060', color: 'white'}"
          style="width: 100%"
          height="calc(100vh - 210px)"
          fit
          border
          @sort-change="getSortList">
          <af-table-column
            prop="materialCode"
            label="货号"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="sizeTypeValue"
            label="尺码类别"
            align="center"/>
          <af-table-column
            prop="size"
            label="尺码"
            align="center"/>
          <af-table-column
            prop="barCode"
            label="sku条码"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="shortName"
            label="货品简称"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="brandName"
            label="品牌"
            align="center"/>
          <af-table-column
            prop="externalWarehouseCode"
            label="仓库代码"
            align="center"/>
          <af-table-column
            :show-overflow-tooltip="true"
            prop="warehouseName"
            label="仓库名称"
            align="center"/>
          <af-table-column
            prop="warehouseTypeName"
            label="仓库类型"
            align="center"/>
          <af-table-column
            prop="totalQty"
            sortable="custom"
            align="center"
            min-width="90">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">实物数</span>
              <!-- <el-tooltip class="item" effect="dark" content="仓库中实有的库存数量" placement="top">
                <i class="el-icon-question"/>
              </el-tooltip> -->
            </template>
          </af-table-column>
          <af-table-column
            prop="occupiedQty"
            sortable="custom"
            align="center"
            min-width="90">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">占用数</span>
              <!-- <el-tooltip class="item" effect="dark" content="销售出，采购退，调拨出等发货占库但未出仓库的商品数量" placement="top">
                <i class="el-icon-question"/>
              </el-tooltip> -->
            </template>
          </af-table-column>
          <af-table-column
            prop="unallocatedQty"
            sortable="custom"
            align="center"
            min-width="100">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">未分配数</span>
              <!-- <el-tooltip class="item" effect="dark" content="线下销售和调拨等业务当前可用的库存数量" placement="top">
                <i class="el-icon-question"/>
              </el-tooltip> -->
            </template>
          </af-table-column>
          <af-table-column
            prop="allocatedQty"
            sortable="custom"
            align="center"
            min-width="100">
            <template slot="header" slot-scope="scope">
              <span :key="scope.row">已分配数</span>
              <!-- <el-tooltip class="item" effect="dark" content="分配给线上销售的当前可用库存数量" placement="top">
                <i class="el-icon-question"/>
              </el-tooltip> -->
            </template>
          </af-table-column>
          <af-table-column
            prop="operation"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="fenpei(scope.row)">分配实物库存</el-button>
            </template>
          </af-table-column>
          <af-table-column
            prop="pipeline"
            label="流水"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="seePipeline(scope.row)">查看</el-button>
            </template>
          </af-table-column>
          <af-table-column
            v-if="show"
            prop="color"
            label="颜色"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="retailPrice"
            label="零售价"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="year"
            label="年份"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="developSeasonValue"
            label="季节"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="listingDate"
            label="上市时间"
            align="center"/>
          <af-table-column
            v-if="show"
            :show-overflow-tooltip="true"
            prop="productSeriesValue"
            label="系列"
            align="center"/>
          <af-table-column
            v-if="show"
            prop="sexValue"
            label="性别"
            align="center"/>
          <af-table-column
            v-if="show"
            :show-overflow-tooltip="true"
            prop="productTypeValue"
            label="类别"
            align="center"/>
          <af-table-column
            v-if="show"
            :show-overflow-tooltip="true"
            prop="productPatternValue"
            label="款型"
            align="center"/>
          <af-table-column
            v-if="show"
            :show-overflow-tooltip="true"
            prop="projectValue"
            label="项目"
            align="center"/>
        </el-table>
      </div>
      <div class="pageBar">
        <div class="mr2">
          <div v-if="showMatInfo" style="float:left;font-size:20px;" class="mcode">
            <span>输入货号共: <span style="color:red">{{ totalmCode }}</span>个。</span>
            <!-- 迭代：去除当前页面货号数显示 本次不迭代 -->
            <span>当前页面共<span style="color:red"> {{ inputCurrent }}</span>个货号,</span>
            <span>共<span style="color:red">{{ totalbCode }}</span>个数据。</span>
          </div>
          <div v-if="showBarInfo" style="float:left;font-size:20px;" class="bcode">
            <span>输入条码共: <span style="color:red">{{ totalmCode }}</span>个。</span>
            <!-- 迭代：去除当前页面条码数显示 本次不迭代 -->
            <span>当前页面共<span style="color:red">{{ inputCurrent }}</span>个条码,</span>
            <span>共<span style="color:red">{{ totalbCode }}</span>个数据。</span>
          </div>
        </div>
        <page-common
          ref="page"
          api="/bff/api/v1/physical_inventory/_list"
          method="post"
          @query="query"
          @loading="load"/>
      </div>
    </el-container>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" class="dialog_a" width="65%" top="10vh" title="库存流水日志" @close="closePipeline">
      <el-form :model="form" label-position="right">
        <el-row>
          <el-col :span="10" style="margin-left:-5%">
            <el-form-item :label-width="formLabelWidth" label="流水类型:">
              <el-select v-model="value" placeholder="全部" clearable style="">
                <!-- <el-option label="全部" value="选项0"/> -->
                <el-option
                  v-for="item in pipelineTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="70px" label="更新时间">
              <el-date-picker
                v-model="valueTime"
                :default-value="defaultDate"
                :default-time="['00:00:00', '23:59:59']"
                type="daterange"
                range-separator="~"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left:3%">
            <el-form-item>
              <el-button type="primary" size="mini" style="margin-left:10px" @click="handleCurrentChange(1)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="pipelineSearchResult"
        border
        height="350">
        <af-table-column
          prop="id"
          label="流水号"
          width=""
          align="center"/>
        <af-table-column
          prop="businessTypeName"
          label="流水类型"
          width=""
          align="center"/>
        <af-table-column
          prop="businessNo"
          label="业务单据号"
          width=""
          align="center"/>
        <af-table-column
          prop="adjustQty"
          label="实际调整数"
          width="90"
          align="center"/>
        <af-table-column
          prop="toAllocatedQty"
          label="分配数"
          width=""
          align="center"/>
        <af-table-column
          prop="toOccupiedQty"
          label="实物占用数"
          align="center"
          width="90"/>
        <af-table-column
          prop="toAvailableQty"
          label="实物可用数"
          align="center"
          width="90"/>
        <af-table-column
          prop="createTime"
          label="时间"
          align="center"/>
        <af-table-column
          prop="remark"
          label="备注"
          align="center"
          width=""/>
      </el-table>
      <el-pagination
        :current-page="currentList.pageNum"
        :page-sizes="[10, 20, 35, 50]"
        :page-size="currentList.pageSize"
        :total="innerTotal"
        layout="total, sizes, prev, pager, next, jumper"
        style="text-align:center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </el-dialog>
    <el-dialog :visible.sync="outerVisible" :close-on-click-modal="false" class="dialog_b" center title="分配实物库存（增加渠道可用库存）" @closed="gb">
      <div class="box" width="100%">
        <div class="left">
          <p style="margin:20px 0;">当前可分配数：<span style="color:red;margin-left:45px">{{ dangqian.unallocatedQty }}</span></p>
          <p style="margin:20px 0;">请填写分配规则：
            <template>
              <el-radio v-model="radio" label="1" style="margin-left:30px">数量</el-radio>
              <el-radio v-model="radio" label="2">比例</el-radio>
            </template>
          </p>
          <div v-if="radio === '1'" style="margin:20px 0;">
            <el-row>
              <el-col :span="12"><span>分配渠道</span></el-col>
              <el-col :span="10"><span>分配数量</span></el-col>
            </el-row>
            <el-row v-for="(item, index) in fenpeiQudao" :key="index" class="number">
              <el-col :span="24" style="margin:10px 0">
                <el-col :span="10"><span>{{ item.channelName }}</span></el-col>
                <el-col v-if="item" :span="5" style="margin-left:20px">
                  <el-input v-model="item.qty" size="mini" placeholder="0" @keyup.native="watchNumber(dangqian, item)" @blur="clearNumInput(dangqian)"/>
                </el-col>
              </el-col>
            </el-row>
            <p v-if="showNumWarn" style="color:red;text-align:center;">分配超限，请重新分配！</p>
            <p style="margin-top:10px;">剩余可分配数：<span v-if="showNumSurplus" style="color:red;margin-left:45px">{{ surplus }}</span></p>
            <!-- <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" style="margin:0 60px 0 25px;" @click="queren(dangqian)">确认</el-button>
              <el-button size="small" @click="cancel">取 消</el-button>
            </div> -->
          </div>
          <div v-if="radio === '2'">
            <el-row>
              <el-col :span="12"><span>分配渠道</span></el-col>
              <el-col :span="10"><span>分配比例</span></el-col>
            </el-row>
            <el-row v-for="(item, index) in fenpeiQudao" :key="index" class="proportion">
              <el-col :span="24" style="margin:10px 0">
                <el-col :span="10"><span>{{ item.channelName }}</span></el-col>
                <el-col v-if="item" :span="11">
                  <el-col :span="12" style="margin-left:20px">
                    <el-input v-model="item.point" size="mini" placeholder="0" @keyup.native="watchProportion(dangqian, item)" @blur="clearPropInput"/>
                  </el-col>
                  <el-col :span="4"><span>%</span></el-col>
                  <el-col :span="7"><span v-if="showPropToNum" style="color:red">{{ item.qty1 }}</span></el-col>
                </el-col>
              </el-col>
            </el-row>
            <p v-if="showPropWarn" style="color:red;text-align:center;">分配超限，请重新分配！</p>
            <p style="margin-bottom:20px">剩余可分配数：<span v-if="showPropSurplus" style="color:red;margin-left:45px">{{ surplus2 }}</span></p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button :disabled="disableQuren" type="primary" size="small" style="margin:0 60px 0 25px;" @click="queren(dangqian)">确 认</el-button>
            <el-button size="small" @click="cancel">取 消</el-button>
          </div>
        </div>
        <div class="right" style="margin:40px 0">
          <p style="margin-bottom:10px;">商品基本信息</p>
          <el-col :span="24">
            <el-col :span="10" class="left_l">货号：</el-col>
            <el-col :span="12" class="left_r">{{ dangqian.materialCode }}</el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="10" class="left_l">SKU条码：</el-col>
            <el-col :span="12" class="left_r">{{ dangqian.barCode }}</el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="10" class="left_l">货品简称：</el-col>
            <el-col :span="12" class="left_r">{{ dangqian.shortName }}</el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="10" class="left_l">尺码：</el-col>
            <el-col :span="12" class="left_r">{{ dangqian.size }}</el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="10" class="left_l">年份：</el-col>
            <el-col :span="12" class="left_r">{{ dangqian.year }}</el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="10" class="left_l">季节：</el-col>
            <el-col :span="12" class="left_r">{{ dangqian.developSeasonValue }}</el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="10" class="left_l">库存总数：</el-col>
            <el-col :span="12" class="left_r">{{ dangqian.totalQty }}</el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="10" class="left_l">当前可分配数：</el-col>
            <el-col :span="12" class="left_r">{{ dangqian.unallocatedQty }}</el-col>
          </el-col>
        </div>
      </div>
      <el-dialog
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        class="dialog_c"
        width="30%"
        title="处理完成"
        center
        append-to-body>
        <template>
          <el-table
            :data="tableData2"
            border
            style="width: 100%">
            <af-table-column
              prop="channelName"
              label="分配渠道"
              align="center"
              width=""/>
            <af-table-column
              prop="allocatedQty"
              label="实际分配数"
              align="center"
              width=""/>
            <af-table-column
              prop="availableQty"
              label="分配后渠道可用库存"
              align="center"/>
          </el-table>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="close1">关闭</el-button>
        </div>
      </el-dialog>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerVisible = true">确认</el-button>
        <el-button @click="outerVisible = false">取 消</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import PageCommon from './PageCommon'
import Select from './searchBar/text'
import Select2 from './searchBar/text3'
import moment from 'moment'
import PhysicalBatch from './physicalBatch'

export default{
  name: 'PhysicalAllocation',
  components: {
    PageCommon,
    Select,
    Select2,
    PhysicalBatch
  },
  data() {
    return {
      totalmCode: '', // 输入货号/条码总条数
      totalbCode: '', // 查询到的总条数
      radio: '1', // 单个分配 按数量/比例分配 默认按数量分配
      surplus: '', // 按数量分配的剩余可分配数
      surplus2: '', // 按比例分配的剩余可分配数
      isReset: false, // 仓库模糊查询重置
      outerVisible: false, // 分配实物库存弹窗显示 默认不显示
      innerVisible: false, // 分配实物库存分配结果显示 默认不显示
      pipelineSearchResult: [], // 库存流水查询结果
      dialogTableVisible: false, // 库存流水弹窗显示 默认不显示
      dialogTableVisible2: false, // 批量分货失败结果显示 默认不显示
      pipelineTypeList: [], // 流水类型List
      value: 'PHYSICAL_INVENTORY_ALLOCATION', // 流水查询默认查询实物库存流水
      tableData: [], // 货号/条码查询结果
      tableData2: [], // 实物库存分配（单个）分配结果
      undisable: false, // 导出按钮的禁用状态 默认不禁用
      currentPage: 1, // 分页器默认页数
      innerTotal: 0, // 流水查询分页器总条数
      form: {
        chooseMatOrBar: '', // 货号/条码输入框
        type: 'materialCodeList', // 选中货号/条码查询 默认选中货号
        brandCodeList: [], // 品牌List
        // externalWarehouseCodeList: [], // 仓库List
        warehouseCodeList: [], // 仓库List 改为传仓库内码
        minUnallocatedQty: '', // 未分配可用数
        minTotalQty: '', // 实物数
        // 增加仓库类型初始属性
        warehouseType: '' // 仓库类型
      },
      materialCodeList: [], // 货号List
      barCodeList: [], // 条码List
      loading: false, // loading
      oldList: [], // 选中货号/条码
      show: false, // 展开/收起 默认展开
      showNumWarn: false, // 按数量分配-分配超限提示 默认不提示
      showNumSurplus: false, // 按数量分配-剩余可分配数提示 默认不提示
      showPropSurplus: false, // 按比例分配-剩余可分配数提示 默认不提示
      showPropToNum: false, // 按比例分配-比例对应的数量
      showPropWarn: false, // 按比例分配-分配超限提示 默认不提示
      showMatInfo: false, // 查询后 货号信息展示
      showBarInfo: false, // 查询后 条码信息展示
      dangqian: {}, // 当前条码所在行的信息
      inputCurrent: '', // 当前共货号/条码多少条
      fenpeiQudao: [], // 单个及批量分配的渠道信息
      currentList: [],
      brandList: [], // 品牌select下拉框list
      warehouseTypeList: [], // 仓库类别下拉框list
      distWarehouseList: [], // 批量分货仓库下拉框list
      dialog: false,
      formLabelWidth: '120px', // 表单标签宽度 默认120px
      inputMin: '', // 批量分货-组合分配 最小区间
      inputMax: '', // 批量分货-组合分配 最大区间
      value2: '1', // 批量分货 分配维度 默认按比例分配
      valueTime: [], // 流水查询 更新时间
      defaultDate: [], // 流水查询默认时间 默认显示近一周
      warehouseType: '', // 仓库类别
      gridData: [], // 批量分货 分配失败信息展示table
      distWarehouse: '', // 批量分货 分配仓库
      dangqian2: [], // 查询的当前行信息
      data2: [], // 批量分货 分配失败的条码信息
      channelMap: {}, // 获取分配失败信息的渠道名称
      pageNum: 1, // 分页器默认页数
      pageSize: 50, // 分页器每页默认条数
      disableQuren: false, // 单个分配 确认按钮的禁用状态 默认不禁用
      loadingWarehouse: false, // 批量分货 仓库-模糊查询loading
      upInfoWarehouse: [] // 批量分货 仓库
    }
  },
  // watch: {
  //   form: {
  //     handler(val, oldval) {
  //       const re = document.getElementsByClassName('changeSpan1')
  //       const re1 = re[1].getElementsByClassName('el-select__tags-text')
  //       const id = this.form.brandCodeList[0] || ''
  //       re1[0].outerHTML = `<span class="el-select__tags-text">${(this.options3.filter(e => e.value === id)[0]).label}</span>`
  //     },
  //     deep: true
  //   }
  // },
  async created() {
    this.getBrand()
    this.getPipeType()
    this.getWarehouseType()
    this.getUpDateTime()
  },
  // mounted() {
  //   const re = document.getElementsByClassName('el-select__tags')
  //   for (let i = 0; i < re.length; i++) {
  //     re[i].style = 'max-height:30px;max-width:15px;overflow:hidden'
  //     if (i === 1 || i === 2) {
  //       re[i].className = 'el-select__tags changeSpan1'
  //     }
  //   }
  // },
  methods: {
    // 批量分配输入框校验
    testValue(item) {
      let sum = 0
      var re = /^[0-9]+$/
      if (item.point) {
        if (!re.test(item.point)) {
          this.$message({
            showClose: true,
            message: '请输入一个正整数',
            type: 'error',
            duration: 1000
          })
          item.point = ''
          return
        }
      }
      if (parseInt(item.point) > 100 || parseInt(item.point) <= 0) {
        this.$message({
          showClose: true,
          message: '请输入大于0且不超过100的比例或数值',
          type: 'error',
          duration: 1000
        })
        item.point = ''
        return
      }
      this.fenpeiQudao.map(item => {
        sum += item.point ? parseInt(item.point) : 0
      })
      if (sum > 100) {
        this.$message({
          showClose: true,
          message: '分配超限，请重新分配！',
          type: 'error',
          duration: 1000
        })
        item.point = ''
      }
    },
    // 根据所选仓库带出对应渠道
    async screenChannel() {
      // 调用后台接口请求渠道
      try {
        const res = await this.$api.getChannel(this.distWarehouse)
        const list = res.data.data
        this.fenpeiQudao = list
        list.forEach(item => {
          this.channelMap[item.channelCode] = item.channelName // 渠道代码所对应的渠道名称
        })
      } catch (e) {
        this.$message({
          showClose: true,
          message: '网络异常, 请稍后重试',
          type: 'error',
          duration: 1000
        })
      }
    },
    // 流水查看dialog更新时间
    getUpDateTime() {
      var now = new Date()
      var time = now.getTime() - 1000 * 60 * 60 * 24 * 7
      const beg = moment(new Date(time)).format('YYYY-MM-DD')
      const end = moment(new Date()).format('YYYY-MM-DD')
      this.defaultDate = [beg, end]
      const from = beg + ' 00:00:00'
      const to = end + ' 23:59:59'
      this.toTime = [from, to]
      this.valueTime = this.toTime
    },
    // 仓库类别(型)
    async getWarehouseType() {
      const res = await this.$api.getDictType('physical_inventory_query_warehouse_type')
      const data = res.data.data
      data.map(item => {
        item['value'] = item.dictCode
        item['label'] = item.dictValue
      })
      for (var i = 0; i < data.length; i++) {
        var arr = {
          value: data[i].value,
          label: data[i].label
        }
        this.warehouseTypeList.push(arr)
      }
    },
    // 点击抽屉以外的区域
    clickOutOfDrawer(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.distWarehouse = ''
          done()
        })
        .catch(_ => {})
    },
    async baseSearch() {
      const params = { ...this.form }
      const arr = []
      this.form.chooseMatOrBar.split(',').map(item => {
        item = item.replace(/[\r\n]/g, '').trim()
        if (item) {
          arr.push(item)
        }
      })
      params[this.form.type] = arr
      if (this.form.externalWarehouseCodeList.length === 0) {
        if (this.warehouseType) {
          const str = this.warehouseType
          const res = await this.$api.getwarehouseList('', str)
          const arr = res.data.data.warehouseList
          arr.map(item => {
            this.form.externalWarehouseCodeList.push(item.externalWarehouseCode)
          })
        }
      }
      for (const k in params) {
        if (k === 'materialCodeList') {
          this.showMatInfo = true
        } else if (k === 'barCodeList') {
          this.showBarInfo = true
        }
      }
      const request = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
        // orderByList: [{
        //   columnName: column.prop,
        //   order: column.order
        // }]
      }
      if (params.barCodeList) {
        request.barCodeList = params.barCodeList
      }

      if (params.materialCodeList) {
        request.materialCodeList = params.materialCodeList
      }

      if (this.form.externalWarehouseCodeList) {
        request.externalWarehouseCodeList = this.form.externalWarehouseCodeList
      }

      if (this.form.brandList) {
        request.brandList = this.form.brandList
      }

      if (this.form.minTotalQty) {
        request.minTotalQty = this.form.minTotalQty
      }

      if (this.form.minUnallocatedQty) {
        request.minUnallocatedQty = this.form.minUnallocatedQty
      }
      const res = this.$axios.post('/bff/api/v1/physical_inventory/_list', request)
      this.tableData = res.data.data.list
      this.totalmCode = res.data.data.currentInput
      this.totalbCode = res.data.data.currentInput
      this.inputCurrent = res.data.data.currentCount
      this.innerTotal = res.data.data.total
      this.$refs.physicalAllocationTable.clearSort()
      this.$refs.physicalAllocationDetailTable.clearSort()
    },
    handleFailInfoSizeChange(val) {
      this.pageSize = val
    },
    // 分配失败信息翻页
    handleFailInfoCurrentChange(val) {
      this.currentPage = val
      this.data2 = []
      const st = (val - 1) * this.pageSize
      const st1 = val * this.pageSize
      this.gridData.map((item, index) => {
        if (index >= st && index < st1) {
          item.channelName = this.channelMap[item.channelCode] // 分配失败的展示渠道名称
          this.data2.push(item)
        }
      })
    },
    // 刷新页面封装
    async refreshTable() {
      const params = { ...this.form }
      const arr = []
      this.form.chooseMatOrBar.split(',').map(item => {
        item = item.replace(/[\r\n]/g, '').trim()
        if (item) {
          arr.push(item)
        }
      })
      params[this.form.type] = arr
      // 销毁变量
      delete params['type']
      delete params['chooseMatOrBar']
      for (const k in params) {
        if (k === 'materialCodeList') {
          this.showMatInfo = true
        } else if (k === 'barCodeList') {
          this.showBarInfo = true
        }
      }
      this.$refs.physicalAllocationTable.clearSort()
      this.$refs.physicalAllocationDetailTable.clearSort()
      this.$refs.page.getList(params)
    },
    // 批量分配处理完成
    async close2() {
      this.dialog = false
      this.refreshTable()
    },
    // 批量分配的确认按钮
    async confirm(done) {
      let flag = false
      for (var i = 0; i < this.fenpeiQudao.length; i++) {
        if (this.fenpeiQudao[i].point) {
          flag = true
        }
      }
      if (!flag) {
        this.$message({
          message: '渠道分配信息不能为空',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.$confirm('请再次确认是否提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.confirmSubmit()
      }).catch(() => {
      })
    },
    // 再次确认提交
    async confirmSubmit() {
      // 改为传仓库内码
      if (this.form.warehouseCodeList.length === 0) {
        if (this.warehouseType) {
          const str = this.warehouseType
          const res = await this.$api.getwarehouseList('', str)
          const arr = res.data.data.warehouseList
          arr.map(item => {
            // this.form.externalWarehouseCodeList.push(item.externalWarehouseCode)
            // 改为传仓库内码
            this.form.warehouseCodeList.push(item.warehouseCode)
          })
        }
      }
      try {
        const it = this.distWarehouseList.filter(e => e.value === this.distWarehouse)[0]
        const arr1 = []
        this.fenpeiQudao.map(e => {
          const ar = {
            channelCode: e.channelCode,
            allowShortAllocate: true,
            percentage: e.point
          }
          arr1.push(ar)
        })
        this.loading = true
        const res = await this.$axios.post('/bff/api/v1/physical_inventory/batch_allocation', {
          barCodes: it.barCodeList,
          warehouseCode: it.warehouseCode,
          externalWarehouseCode: it.externalWarehouseCode,
          startValue: this.inputMin,
          endValue: this.inputMax,
          allocationList: arr1.filter(channel => channel.percentage)
        }, { timeout: 20000 })
        this.loading = false
        const list = res.data.data
        const failInfo = list.filter(item => item.resultCode === '1')
        if (failInfo.length) {
          // 处理失败
          this.dialogTableVisible2 = true
          this.gridData = failInfo
          this.handleFailInfoCurrentChange(1)
        } else {
          this.$alert('处理完成', {
            confirmButtonText: '关闭页面',
            center: true
          }).then(async() => {
            this.dialog = false
            this.refreshTable()
          })
        }
      } catch (e) {
        this.$message({
          showClose: true,
          message: '网络异常, 请稍后重试',
          type: 'error',
          duration: 1000
        })
      }
    },
    // 品牌
    getBrand() {
      var data = []
      this.$axios.get('/bff/api/v1/brands').then(res => {
        data = res.data.data
        // 将返回的数据直接赋值给options3（要改名）
        data.map(item => {
          item['value'] = item.dictCode
          item['label'] = item.dictValue
        })
        for (var i = 0; i < data.length; i++) {
          var arr = {
            value: data[i].value,
            label: data[i].label
          }
          this.brandList.push(arr)
        }
      })
    },
    // 单个分配关闭
    gb() {
      this.showNumWarn = false
      this.showNumSurplus = false
      this.showPropSurplus = false
      this.showPropWarn = false
    },
    // 单个分配dialog的关闭按钮
    async close1() {
      this.innerVisible = false
      this.outerVisible = false
      this.showNumSurplus = false
      this.showPropSurplus = false
      this.showPropToNum = false
      this.refreshTable()
    },
    // 排序
    getSortList(column) {
      if (column.order) {
        console.log('点击触发排序,', column)
        // const data = {
        //   orderByList: [{
        //     columnName: column.prop,
        //     order: column.order
        //   }],
        //   minUnallocatedQty: this.form.minUnallocatedQty,
        //   // externalWarehouseCodeList: this.form.externalWarehouseCodeList
        //   // 改为传仓库内码
        //   warehouseCodeList: this.form.warehouseCodeList
        // }

        var data = {
          orderByList: [{
            columnName: column.prop,
            order: column.order
          }]
        }
        data[this.form.type ] = this.oldList
        data = Object.assign(this.form, data)
        this.$refs.page.getList(data)
      }
    },
    // 流水类型
    async getPipeType() {
      const res1 = await this.$api.getTypeCode11()
      const data = res1.data.data
      data.map(item => {
        item['value'] = item.dictCode
        item['label'] = item.dictValue
      })
      for (var i = 0; i < data.length; i++) {
        var arr2 = {
          value: data[i].value,
          label: data[i].label
        }
        this.pipelineTypeList.push(arr2)
      }
    },
    // 查流水
    async seePipeline(ck) {
      this.dangqian2 = ck
      this.dialogTableVisible = true
      this.getUpDateTime()
      this.searchInventoryLog()
    },
    async searchInventoryLog() {
      const request = {
        inventoryLogType: 'PHYSICAL',
        barCode: this.dangqian2.barCode,
        inventoryId: this.dangqian2.inventoryId,
        pageNum: this.currentList.pageNum,
        pageSize: this.currentList.pageSize
      }

      if (this.valueTime) {
        if (this.valueTime[0]) {
          request.start = this.valueTime[0]
        }
        if (this.valueTime[1]) {
          request.end = this.valueTime[1]
        }
      }

      if (this.value) {
        request.businessTypeList = [this.value]
      }
      this.$axios.post('/bff/api/v1/inventory_log/_page', request).then(res => {
        this.pipelineSearchResult = res.data.data.list
        this.innerTotal = res.data.data.total
      })
    },
    closePipeline() {
      this.value = 'PHYSICAL_INVENTORY_ALLOCATION'
      this.getUpDateTime()
      // this.pipelineSearchResult = []
      this.innerTotal = 0
    },
    // 校验输入的数量
    watchNumber(dangqian, inputItem) {
      let sum = 0
      var re = /^[0-9]+$/
      if (inputItem.qty !== '') {
        if (!re.test(inputItem.qty)) {
          this.$message({
            showClose: true,
            message: '请输入一个正整数',
            type: 'error',
            duration: 1000
          })
          return
        }
      }
      this.fenpeiQudao.map(item => {
        if (item.qty) {
          sum += parseInt(item.qty)
        }
      })
      if (sum > dangqian.unallocatedQty) {
        // this.fenpeiQudao.map(item => {
        //   item.qty = item.qty > dangqian.unallocatedQty ? 0 : item.qty
        // })
        this.showNumWarn = true
        this.showNumSurplus = false
        this.disableQuren = true
      } else {
        this.showNumWarn = false
        this.showNumSurplus = true
        this.disableQuren = false
        this.surplus = dangqian.unallocatedQty - Math.abs(sum)
        if (isNaN(this.surplus)) {
          this.showNumSurplus = false
        } else {
          this.showNumSurplus = true
        }
      }
      // this.fenpeiQudao.map(item => {
      //   item.point = Math.floor(dangqian.unallocatedQty * (parseInt(item.qty) / 100))
      // })
    },
    // 分配数量超限 失焦后置0
    clearNumInput(dangqian) {
      this.fenpeiQudao.map(item => {
        if (item.qty > dangqian.unallocatedQty) {
          item.qty = ''
        }
      })
    },
    // 校验输入的比例数字
    watchProportion(dangqian, Inputitem) {
      let sum2 = 0
      var re = /^[0-9]+$/
      if (Inputitem.point !== '') {
        if (!re.test(Inputitem.point)) {
          this.$message({
            showClose: true,
            message: '请输入一个正整数',
            type: 'error',
            duration: 1000
          })
          return
        }
      }
      this.fenpeiQudao.map(item => {
        // this.fenpeiQudao.map(item => {
        //   item.point = item.point > 100 ? 0 : item.point
        // })
        if (item.point) {
          sum2 += parseInt(item.point)
        }
      })
      if (sum2 > 100) {
        // this.fenpeiQudao.map(item => {
        //   item.point = item.point > 100 ? 0 : item.point
        // })
        this.showPropWarn = true
        this.showPropSurplus = false
        this.showPropToNum = false
        this.disableQuren = true
      } else {
        this.showPropWarn = false
        this.showPropToNum = true
        this.showPropSurplus = true
        this.disableQuren = false
        this.surplus2 = dangqian.unallocatedQty
        this.fenpeiQudao.map(item => {
          item.qty1 = item.point ? Math.floor(item.point / 100 * dangqian.unallocatedQty) : 0
          this.surplus2 = this.surplus2 - item.qty1
        })
      }
    },
    // 分配比例超限 失焦后置0
    clearPropInput() {
      this.fenpeiQudao.map(item => {
        item.point = item.point > 100 ? '' : item.point
      })
    },
    // 单个分配的确认按钮
    queren(dangqian) {
      this.disableQuren = false
      this.showNumWarn = false
      this.showPropWarn = false
      if (this.radio === '2') {
        this.fenpeiQudao.map(item => {
          item.qty = item.qty1
          delete item.qty1
        })
      } else {
        this.fenpeiQudao.map(item => {
          delete item.qty1
        })
      }
      let flag = false
      for (var i = 0; i < this.fenpeiQudao.length; i++) {
        if (this.fenpeiQudao[i].qty) {
          flag = true
        }
      }
      // const distInfo = this.fenpeiQudao.filter(value => value.qty).length
      // console.log(distInfo, )
      if (!flag) {
        this.$message({
          message: '分配失败',
          type: 'warning',
          duration: 2000
        })
        // const qtyLength = this.fenpeiQudao.filter(value => value.qty === 0).length
        // console.log(qtyLength, 'qtyLength')
        // if (qtyLength > 0) {
        // }
        return
      }
      const params = {
        allocationList: this.fenpeiQudao.filter(channel => channel.qty),
        barCode: dangqian.barCode,
        warehouseCode: dangqian.warehouseCode
      }
      this.$axios.post('/bff/api/v1/physical_inventory/_allocation', params).then(async res => {
        const channelList = res.data.data
        const arr = []
        for (var i = 0; i < channelList.length; i++) {
          arr.push(channelList[i].channelCode)
        }
        const params2 = {
          barCodeList: [dangqian.barCode],
          channelCodeList: arr
        }
        const res2 = await this.$axios.post('/bff/api/v1/channel_inventory/_page', params2)
        const channelCd = res2.data.data.list
        this.tableData2 = res.data.data
        this.tableData2.forEach(item => {
          const ciFilteredList = channelCd.filter(ci => ci.channelCode === item.channelCode)
          if (ciFilteredList.length === 0) {
            return
          }
          item.availableQty = ciFilteredList[0].availableQty
        })
        this.innerVisible = true
      })
      // this.show3 = false
      // this.show4 = false
      this.showPropToNum = false
      this.showNumWarn = false
    },
    // 单个分配的取消按钮
    cancel() {
      this.outerVisible = false
      if (this.innerVisible === true) {
        return
      }
      this.showPropToNum = false
      this.showNumSurplus = false
      this.showPropSurplus = false
      this.showNumWarn = false
      this.showPropWarn = false
    },
    // 展开查看更多
    showMore() {
      this.show = true
    },
    // 收起
    closeMore() {
      this.show = false
    },
    // 条码/货号输入条数提示（库存查询）
    changeTips(form) {
      this.showMatInfo = false
      this.showBarInfo = false
    },
    // 条码/货号输入的中文逗号替换成英文
    numLimit(form) {
      this.form.chooseMatOrBar = this.form.chooseMatOrBar.replace(/，/g, ',')
      // if (this.form.type === 'barCodeList') {
      //   if (arr3.length <= 50) {
      //     return arr3
      //   } else {
      //     const arr4 = arr3.splice(0, 50)
      //     this.form.chooseMatOrBar = arr4.join(',')
      //   }
      // } else {
      //   if (arr3.length <= 10) {
      //     return arr3
      //   } else {
      //     const arr4 = arr3.splice(0, 10)
      //     this.form.chooseMatOrBar = arr4.join(',')
      //   }
      // }
      // this.$refs.gdt.scrollTop = this.$refs.gdt.scrollHeight
    },
    showScrollBar() {
    },
    // 点击分配实物库存
    async fenpei(row) {
      this.outerVisible = true
      this.dangqian = row
      // 先从仓库代码映射出可以分配的渠道
      // const cangkudata = await this.$api.getChannel(row.externalWarehouseCode)
      // 改为传仓库内码
      const cangkudata = await this.$api.getChannel(row.warehouseCode)
      cangkudata.data.data.map((item, index) => {
        item['allowShortAllocate'] = true
        item['qty'] = ''
        item['point'] = ''
        item['sequence'] = index
      })
      this.fenpeiQudao = cangkudata.data.data
    },
    // 仓库
    getvalue(val) {
      console.log(val, '选择的数组')
      if (val !== '') {
        const arr = []
        val.map(item => {
          arr.push(item.value)
        })
        // const arr2 = []
        // val.map(item => {
        //   arr2.push(item.label)
        // })
        // this.distWarehouse = arr2
        // this.form.externalWarehouseCodeList = arr
        // 改为传仓库内码
        this.form.warehouseCodeList = arr
      } else {
        // this.form.externalWarehouseCodeList = []
        // 改为传仓库内码
        this.form.warehouseCodeList = []
      }
    },
    // 清空批量分配的最大区间及最小区间
    clearInput(val) {
      if (val) {
        this.inputMin = ''
        this.inputMax = ''
      }
    },
    // 点击批量分货
    async distGoods(form) {
      const params = { ...form }
      console.log(params, '这里打印出来的是什么')
      console.log(params.warehouseType, '拿到类型了吗')
      // 重新获取正确的仓库类型
      const str = params.warehouseType
      console.log(str, '仓库类型')
      const arr = []
      this.form.chooseMatOrBar.split(',').map(element => {
        element = element.replace(/[\r\n]/g, '').trim()
        // 排除处理过后， 所有项中为''项
        if (element) {
          arr.push(element)
        }
      })
      params[this.form.type] = arr
      // 改为传仓库内码
      if (params.warehouseCodeList.length !== 0) {
        params.warehouseCodeList = params.warehouseCodeList
      } else {
        const res = await this.$api.getwarehouseList('', str)
        params.warehouseCodeList = res.data.data.warehouseList.map(item => item.warehouseCode)
      }
      try {
        const res = await this.$axios.post('/bff/api/v1/physical_inventory/up_info', {
          barCodeList: params.barCodeList,
          materialCodeList: params.materialCodeList,
          // warehouseCodeList: params.externalWarehouseCodeList
          // 改为传仓库内码
          warehouseCodeList: params.warehouseCodeList
        })
        const list = res.data.data
        console.log(list, 'list')
        this.upInfoWarehouse = list
        list.map(item => {
          // item['value'] = item.externalWarehouseCode
          // 改为传仓库内码
          item['value'] = item.warehouseCode
          item['label'] = item.warehouseName
        })
        this.distWarehouseList = list
        if (list.length === 0) {
          this.$notify({
            title: '提示',
            message: `该类条码或货号暂时不支持批量分货,请重新搜索`,
            duration: 2000
          })
        } else {
          this.dialog = true
        }
      } catch (e) {
        this.$notify({
          title: '错误',
          message: `网络异常, 请稍后重试`,
          type: 'error',
          duration: 2000
        })
      }
      this.distWarehouse = ''
      this.fenpeiQudao = []
      this.inputMin = ''
      this.inputMax = ''
    },
    // 批量分货模糊查询仓库
    async remoteSearchWarehouse(query) {
      const remoteWarehouse = this.upInfoWarehouse.map(item => {
        return {
          // value: item.externalWarehouseCode,
          // 改为传仓库内码
          value: item.warehouseCode,
          label: item.warehouseName
        }
      })
      if (query.trim() !== '') {
        this.loadingWarehouse = true
        setTimeout(() => {
          this.loadingWarehouse = false
          this.distWarehouseList = remoteWarehouse.filter(item => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item
            }
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            }
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.value.toLowerCase().indexOf(query.toLowerCase()) === -1) {
              return item
            }
          })
        }, 200)
      } else {
        this.distWarehouseList = remoteWarehouse
      }
    },
    // 批量分货模糊查询仓库的清除按钮
    clearWarehouse() {
      const remoteWarehouse = this.upInfoWarehouse.map(item => {
        return {
          // value: item.externalWarehouseCode,
          // 改为传仓库内码
          value: item.warehouseCode,
          label: item.warehouseName
        }
      })
      this.distWarehouseList = remoteWarehouse
    },
    // 根据选中的仓库类别显示相应类别的仓库
    async getTypeToWarehouse(warehouseTypeCode) {
      // this.form.externalWarehouseCodeList = []
      // 改为传仓库内码
      this.form.warehouseCodeList = []
      this.$refs.sle.clearSelection()
      // warehouseTypeCode是用户选中的仓库类型，替换了以前的this.warehouseType
      this.$refs.sle.getList('', warehouseTypeCode)
    },
    // 实物数和未分配可用数的校验
    getInteger() {
      this.form.minUnallocatedQty = parseInt(this.form.minUnallocatedQty)
      this.form.physicalQty = parseInt(this.form.physicalQty)
    },
    // 点击查询按钮
    async search(form) {
      const str = JSON.stringify(form)
      const params = JSON.parse(str)
      // code解析单独提取出一个方法
      const arr = []
      this.form.chooseMatOrBar.split(',').map(item => {
        item = item.replace(/[\r\n]/g, '').trim()
        if (item) {
          arr.push(item)
        }
      })
      params[this.form.type] = arr
      // params[this.form.type] = this.form.chooseMatOrBar
      delete params['type']
      delete params['chooseMatOrBar']
      if (this.form.chooseMatOrBar === '') {
        this.$alert('查询时SKU条码和货号必输入一项', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      for (const k in params) {
        if (k === 'materialCodeList') {
          this.showMatInfo = true
        } else if (k === 'barCodeList') {
          this.showBarInfo = true
        }
        // if (k === 'materialCodeList' || k === 'barCodeList') {
        //   if (params[k] === '') {
        //     delete params[k]
        //   } else {
        //     if (params[k]) {
        //       const arr = params[k].split(',') || params[k].split('，')
        //       const arr2 = []
        //       arr.map(item => {
        //         item = item.replace(/[\r\n]/g, '').trim()
        //         if (item) {
        //           arr2.push(item)
        //         }
        //       })
        //       params[k] = arr2
        //     }
        //   }
        // }
      }
      // 获取输入的货号数
      // if (this.form.chooseMatOrBar !== '') {
      //   this.nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm')
      // }
      for (var k in params) {
        if (k === 'materialCodeList' || k === 'barCodeList') {
          this.oldList = params[k]
        }
      }
      // 改为传仓库内码
      if (params.warehouseCodeList.length === 0) {
        if (this.warehouseType) {
          const str = this.warehouseType
          const res = await this.$api.getwarehouseList('', str)
          const arr = res.data.data.warehouseList
          arr.map(item => {
            // params.externalWarehouseCodeList.push(item.externalWarehouseCode)
            params.warehouseCodeList.push(item.warehouseCode)
          })
        }
      }
      this.$refs.page.getList(params)
    },
    query(data, total, input, count) {
      this.tableData = data
      this.totalmCode = total
      this.inputCurrent = input
      this.totalbCode = count
      console.log(this.tableData, '传递的tableData')
    },
    load(status) {
      this.loading = status
    },
    // 点击导出按钮
    async Export(params) {
      const form = { ...params }
      // form[this.form.type] = params.chooseMatOrBar
      // 处理用户输入的货号/条码的格式，去除空格、回车符等
      const arr = []
      form.chooseMatOrBar.split(',').map(item => {
        item = item.replace(/[\r\n]/g, '').trim()
        if (item) {
          arr.push(item)
        }
      })
      // 处理完毕，将处理后的数据赋给相应属性
      form[this.form.type] = arr
      delete form['type']
      delete form['chooseMatOrBar']
      for (const k in form) {
        if (k === 'materialCodeList' || k === 'barCodeList') {
          if (form[k] !== '') {
            if (form[k].indexOf(',') !== -1) {
              form[k] = form[k].split(',')
            } else {
              // 去掉嵌套的数组
              form[k] = form[k]
            }
            // if (form[k].length > 50 && k !== 'warehouseCodeList') {
            //   this.$notify({
            //     title: '提示',
            //     message: 'sku或货号最多只能支持50条导出',
            //     duration: 2000
            //   })
            //   return
            // }
          }
        }
        if (k === 'warehouseCodeList') {
          if (form[k] === '') {
            form[k] = []
          }
        }
      }
      // 改为传仓库内码
      if (form.warehouseCodeList.length === 0) {
        if (this.warehouseType) {
          const str = this.warehouseType
          const res = await this.$api.getwarehouseList('', str)
          const arr = res.data.data.warehouseList
          arr.map(item => {
            // form.externalWarehouseCodeList.push(item.externalWarehouseCode)
            form.warehouseCodeList.push(item.warehouseCode)
          })
        }
      }
      const that = this
      this.undisable = true
      this.$axios({
        method: 'post',
        url: `/bff/api/v1/physical_inventory/_export`,
        data: form
        // responseType: 'blob'
      }).then(res => {
        that.undisable = false
        if (res.data.code) {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        const blob = new Blob(['\ufeff' + res.data], { type: 'text/csv;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '库存查询导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 点击重置按钮
    reset(form) {
      for (const k in form) {
        form[k] = ''
      }
      this.isReset = !this.isReset
      this.form.type = 'materialCodeList'
      this.showMatInfo = false
      this.showBarInfo = false
      this.warehouseType = ''
    },
    handleSizeChange(pageSize) {
      this.currentList.pageSize = pageSize
      this.searchInventoryLog()
    },
    // 翻页
    handleCurrentChange(pageNum) {
      this.currentList.pageNum = pageNum
      this.searchInventoryLog()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
// 批量分货渠道过多确认按钮无法显示 增加向下滑动效果
  .el-drawer.rtl{
    overflow: scroll
  }
</style>
<style>
  label {
    font-size: 11px !important;
    font-weight: 500;
  }
</style>
<style lang='scss' scoped>
  * {
    font-size: 11px;
    font-family: tahoma, arial, 宋体, sans-serif;
  }

  // 搜索框背景色为白色 增加上边框
  .searchbg {
    display: block;
    border-top: 1px solid #cdcdcd;
    background: white;
  }
  .box {
    border: 1px solid #ccc;
    /* height: 300px; */
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  .left {
    float: left;
    width: 50%;
    border-right: 1px solid #ccc;
    margin-left: 20px;
    padding-bottom: 20px;
  }
  .left .number {
    margin: 10px 0;
  }
  .left .proportion {
    margin: 10px 0;
  }
  .right {
    float: right;
    width: 50%;
    padding-left: 25px;
    text-align: center;
  }
  .right .left_l {
    background:#efefef;
    padding: 5px 5px;
    margin-bottom: 3px;
  }
  .right .left_r {
    text-align:center;
    background:#efefef;
    padding: 5px 0;
    margin-left:5px;
    margin-bottom: 3px;
  }
  .stock-box {
    display: block;
    width:100%;
    /* padding: 15px 40px; */
  }
  .blue-line{
    width: 15px;
    font-weight: 900;
    color: blue;
    display: inline-block;
  }
  .el-divider{
    margin: 12px 0;
  }
  .pageBar {
    position: relative;
    background: white;
    overflow: hidden;
  }
  .mr{
    margin: 10px 0;
    position: absolute;
    right: 10px;
    top: 0px;
  }
  .mr2{
    position: absolute;
    left:10px;
    top: 10px;
  }
  .text-right{
    text-align: center;
  }
  .text-right button:last-child {
    margin-right: 5%;
  }
  /* .bt {
    font-size: 12px;
    font-weight: normal;
  } */
  .changeSpan1 span span:nth-child(1) {
    width: 60%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .dejts {
    margin-bottom: -10px;
  }
</style>
