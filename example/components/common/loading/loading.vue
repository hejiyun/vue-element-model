<template>
  <transition>
    <div v-loading="isShow" v-show="isShow" class="loading"/>
  </transition>
</template>
<script>
import Vue from 'vue'
import { Loading } from 'element-ui'
Vue.use(Loading)
export default {
  name: 'Loading',
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    }
  }
}
</script>
<style lang="scss">
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 111;
  width: 100vw;
  height: 100vh;
  text-align: center;
}
</style>
