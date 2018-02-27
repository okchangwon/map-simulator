<template>
  <div class="tool-area">
    <h1>듀랑고 맵 시뮬레이터</h1>
  </div>
</template>
<script>
  export default {
    name: 'ToolArea'
  }
</script>

<style scoped>
  .tool-area {
    position:absolute;
    top:5px;
    right:5px;
    bottom:5px;
    width:250px;
    margin:1px;
    background-color:rgba(255,255,255,0.3);
    border-radius:10px;
    overflow:auto;
  }

  h1 {
    display:block;
    margin:5px;
    padding:8px 0;
    font-size:13px;
    font-weight:normal;
    color:#fff;
    background-color:#000;
    border-radius:10px;
    text-align:center;
  }
</style>
