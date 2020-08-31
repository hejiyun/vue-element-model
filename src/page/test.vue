<template>
    <div>首页2

        <el-button @click="sendRequest">点我</el-button>
    </div>
    
</template>
<script>
import { getMenu  } from '@/axios/common'
export default {
  created() {
      getMenu()
  },
  methods: {
      sendRequest() {
          getMenu()
      }
  }
}
</script>