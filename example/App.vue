<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default{
  name: 'App',
  data() {
    return {
      isRouterAlive: true
    }
  }
}
</script>
<style>
 *{
   margin: 0;
   padding: 0
 }
 .order-box{
  /* box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);;
  background: white;
  border: 1px solid rgb(204, 204, 204);
  height: 100%;
 }
 .searchBox {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 15px 15px 10px 10px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-shadow: 0 3px 10px rgba(46, 8, 8, 0.1);
}
</style>
