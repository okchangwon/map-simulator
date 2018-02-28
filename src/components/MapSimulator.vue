<template>
  <div class="map-simulator">
    <map-area></map-area>
    <tool-area></tool-area>
  </div>
</template>

<script>
  import MapArea from './MapArea.vue';
  import ToolArea from './ToolArea.vue';

export default {
  name: 'MapSimulator',
  components: {MapArea, ToolArea},
  data: () => ({

  }),
  mounted () {
  },
};
</script>

<style scoped>
.map-simulator {
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  background-color:#666;
}
</style>
