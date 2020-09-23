<template>
  <div>
    <!-- 采购单新增页自动分货弹框组件 -->
    <div class="auto-btn">
      <el-button :disabled="!addForm.inWarehouseCode" type="primary" size="mini" @click="autoDelivery(addForm.inWarehouseCode)">自动分货</el-button>
    </div>
    <el-dialog :visible.sync="warehouseChanged" :close-on-click-modal="false" title="重新设置自动分货提醒" width="30%" center>
      <span class="tips-text">您此前针对入此仓库： {{ autoDeliveryInfo.length > 0 ? autoDeliveryInfo[0].theWarehouseCode : '' }},  设置了自动分货，现您已更改入库仓库，如还需要自动分货，请点击：“继续” 设置；如不需要进行自动分货，请点击“清空设置”，系统将不再保留此前设置的分货规则。</span>
      <div class="tips-button">
        <el-button size="mini" @click="clearInfo">清空设置</el-button>
        <el-button type="primary" size="mini" @click="goOn">继续</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="自动分货" width="40%" center>
      <el-row>
        <el-col :span="4">
          <span>预计到货仓库:</span>
        </el-col>
        <el-col :span="16">
          <el-input v-model="inWarehouseName" :disabled="true"/>
        </el-col>
      </el-row>
      <el-row class="warehouse-code">
        <el-col :span="4">
          <span>仓库代码:</span>
        </el-col>
        <el-col :span="16">
          <el-input v-model="inWarehouseCode" :disabled="true"/>
        </el-col>
      </el-row>
      <el-row class="rules">
        <el-form-item>
          <p>设置各渠道分配比例：</p>
          <el-row>
            <el-col :span="5"><span>渠道代码</span></el-col>
            <el-col :span="9"><span>渠道名称</span></el-col>
            <el-col :span="4"><span>业务类型</span></el-col>
            <el-col :span="6"><span>比例</span></el-col>
          </el-row>
          <el-row v-for="(item, index) in allocateList" :key="index" class="proportion">
            <el-col :span="24">
              <el-col :span="5">
                <span>{{ item.channelCode }}</span>
              </el-col>
              <el-col :span="9">
                <span>{{ item.channelName }}</span>
              </el-col>
              <el-col :span="4">
                <span>{{ item.bizTypeName }}</span>
              </el-col>
              <el-col :span="6">
                <el-col v-if="item">
                  <el-col :span="13">
                    <el-input v-model="item.point" size="mini" placeholder="0" @keyup.native="testValue(item)"/>
                  </el-col>
                  <el-col :span="4"><span>%</span></el-col>
                </el-col>
              </el-col>
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <div class="warehouse-btn">
        <el-button type="primary" size="mini" @click="confirm">确定</el-button>
        <el-button size="mini" @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="hasSetRulesTip" :close-on-click-modal="false" title="自动分货已设置提醒" width="40%" center>
      <el-row>
        <el-col>
          <span>您已设置了自动分货规则，请问是否重新设置，如果是，会覆盖掉您之前提交的分货规则，按照最近一次提交的规则进行自动分货</span>
        </el-col>
      </el-row>
      <el-row class="rules">
        <el-form-item>
          <p class="has-set">已设置的规则见下，供参考：</p>
          <el-row>
            <el-col :span="5"><span>渠道代码</span></el-col>
            <el-col :span="9"><span>渠道名称</span></el-col>
            <el-col :span="4"><span>业务类型</span></el-col>
            <el-col :span="6"><span>分货比例</span></el-col>
          </el-row>
          <el-row v-for="(item, index) in autoDeliveryInfo" :key="index" class="proportion">
            <el-col :span="24">
              <el-col :span="5">
                <span>{{ item.theChannelCode }}</span>
              </el-col>
              <el-col :span="9">
                <span>{{ item.theChannelName }}</span>
              </el-col>
              <el-col :span="4">
                <span>{{ item.theBiztypeName }}</span>
              </el-col>
              <el-col :span="6">
                <span>{{ item.thePercentage }}%</span>
              </el-col>
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <div class="warehouse-btn">
        <el-button type="primary" size="mini" @click="resetRules(addForm.inWarehouseCode)">是的，需要重新设置</el-button>
        <el-button type="primary" size="mini" @click="clearRules">清空设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    addForm: {
      type: Object,
      default: () => {}
    },
    inWarehouseList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogTableVisible: false, // 自动分货弹框是否显示，默认不显示
      inWarehouseCode: '', // 选中的入库仓库的代码
      inWarehouseName: '', // 选中的入库仓库的名称
      autoDeliveryInfo: [], // 存储设置了分货规则的仓库信息
      hasDelRules: false, // 是否设置了分货规则
      hasSetRulesTip: false, // 自动分货已设置提醒弹框 默认不显示
      allocateList: [], // 仓库对应分配渠道信息
      warehouseChanged: false // 入库仓库改变后的弹框
    }
  },
  methods: {
    // 获取仓库名称及相应渠道
    async getNameAndChannel() {
      this.inWarehouseCode = this.addForm.inWarehouseCode
      this.inWarehouseList.forEach(item => {
        if (item.value === this.addForm.inWarehouseCode) {
          this.inWarehouseName = item.label
        }
      })
      // 根据入库仓库代码获取相应渠道
      const res = await this.$api.getChannel(this.inWarehouseCode)
      const list = res.data.data
      this.allocateList = list
    },
    // 自动分货
    async autoDelivery(info) {
      if (this.autoDeliveryInfo && this.autoDeliveryInfo.length) { // 用户针对相同仓库修改分货规则
        this.autoDeliveryInfo.map(item => {
          if (info === item.theWarehouseCode) {
            this.dialogTableVisible = false
            this.hasSetRulesTip = true
          }
        })
      } else {
        this.dialogTableVisible = true
      }
      this.getNameAndChannel()
    },
    // 用户换仓
    async changeWarehouse() {
      if (this.autoDeliveryInfo.length > 0 && this.autoDeliveryInfo.indexOf(this.addForm.inWarehouseCode) < 0) {
        this.warehouseChanged = true
      }
      this.getNameAndChannel()
    },
    // 清空设置
    clearInfo() {
      this.autoDeliveryInfo = []
      this.warehouseChanged = false
    },
    // 继续
    goOn() {
      this.dialogTableVisible = true
      this.hasSetRulesTip = false
      this.inWarehouseCode = this.addForm.inWarehouseCode
      this.autoDeliveryInfo = []
      this.warehouseChanged = false
    },
    // 自动分货弹窗 确认按钮触发事件
    async confirm() {
      this.allocateList.map(item => {
        if (item.point) {
          this.hasDelRules = true
        }
        this.autoDeliveryInfo.push({
          theWarehouseCode: this.inWarehouseCode,
          theBiztypeName: item.bizTypeName,
          theChannelCode: item.channelCode,
          theChannelName: item.channelName,
          thePercentage: item.point,
          hasDelRules: this.hasDelRules
        })
      })
      this.$emit('childFn', this.autoDeliveryInfo, this.allocateList)
      this.$alert('设置成功', '', {
        confirmButtonText: '关闭页面',
        type: 'success',
        center: true,
        showClose: false
      }).then(() => {
        this.dialogTableVisible = false
      })
    },
    // 提交关闭后清空
    clearAutoInfo() {
      this.autoDeliveryInfo = []
    },
    // 校验自动分货输入的比例
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
      this.allocateList.map(item => {
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
    // 重新设置相同仓库下的分货规则
    async resetRules(info) {
      this.hasSetRulesTip = false
      this.dialogTableVisible = true
      this.inWarehouseCode = info
      this.inWarehouseList.forEach(item => {
        if (item.value === this.addForm.inWarehouseCode) {
          this.inWarehouseName = item.label
        }
      })
      // 根据入库仓库代码获取相应渠道
      const res = await this.$api.getChannel(this.inWarehouseCode)
      const list = res.data.data
      this.allocateList = list
      this.autoDeliveryInfo = []
    },
    // 清空相同仓库下的分货规则
    clearRules() {
      this.autoDeliveryInfo = []
      this.hasSetRulesTip = false
      this.dialogTableVisible = false
    }
  }
}
</script>

