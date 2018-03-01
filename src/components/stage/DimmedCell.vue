<template>
  <span class="dimmed-cell"></span>
</template>

<script>
  export default {
    name: 'DimmedCell'
  }
</script>

<style>
  .dimmed-cell {
    display:block;
    position:absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    line-height:35px;
    background-color:rgba(0,0,0,0.7)
  }
</style>
