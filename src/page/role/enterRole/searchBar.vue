<template>
  <el-row>
    <el-col :span="4">
      <InputC ref="enterRoleInputC" :item="searchOptions[0]" @updateValue="updateValue($event, searchOptions[0].prop)"/>
    </el-col>
    <el-col :span="4" class="margin-10">
      <SelectC ref="enterRoleSelectC" :item="searchOptions[1]" @updateValue="updateValue($event, searchOptions[1].prop)"/>
    </el-col>
    <el-col :span="6">
      <el-button type="primary" @click="search">搜素</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
    </el-col>
  </el-row>
</template>
<script>
import { SelectC, InputC } from '@component/Form/ExportItem.js'
export default {
  components: {
    SelectC,
    InputC
  },
  data() {
    return {
      searchOptions: [
        {
          placeholder: '用户',
          prop: 'name'
        },
        {
          placeholder: '角色',
          prop: 'roleCode',
          options: [
            {
              label: '运营',
              value: 'test'
            }
          ]
        }
      ],
      form: {}
    }
  },
  created() {
    // 这里获取角色下拉列表信息, 并对选项赋值
  },
  methods: {
    updateValue(event, name) {
      this.form[name] = event
    },
    search() {
      this.$emit('search', this.form)
    },
    reset() {
      this.$refs.enterRoleInputC.reset()
      this.$refs.enterRoleSelectC.reset()
      this.form = {}
    }
  }
}
</script>
