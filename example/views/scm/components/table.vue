<template>
  <div class="table_container">
    <table>
      <tr>
        <th>选择</th>
        <th>条码</th>
        <th>货号</th>
        <th>尺码</th>
        <th>吊牌价</th>
        <th>金额</th>
        <th>类别</th>
        <th>项目</th>
        <th>系列</th>
        <th>款型</th>
        <th>品牌</th>
        <th>申请数量</th>
        <th>占库数</th>
        <th>可用库存数</th>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.table_container {
  width: 100%;
  border: 1px solid #efefef;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
th {
  font-size: 12px;
  font-weight: normal;
  height: 30px;
  border-right: 1px solid #efefef;
}
</style>
