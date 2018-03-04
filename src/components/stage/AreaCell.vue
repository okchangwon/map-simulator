<template>
  <span class="area-cell"
        v-if="area && owner"
        :style="{'background-color':backgroundColor}"><span class="name">{{owner.name}}</span></span>
</template>

<script>
const BG_OPACITY = 0.5;

export default {
  name: 'AreaCell',
  props: {
    x: {type:Number},
    y: {type:Number},
  },
  computed: {
    area () {
      return this.$store.state.area.areas.find(area => area.x===this.x && area.y===this.y);
    },
    owner () {
      return this.$store.state.area.owners.find(owner => owner.id===this.area.ownerId);
    },
    backgroundColor () {
      const rgb = this.owner.color
        .replace(/[^0-9a-z]/ig,'')
        .replace(/([0-9a-z]{2})/g,'|$1')
        .split('|').slice(1)
        .map(code => parseInt(code, 16));

      return 'rgba(' + rgb.join(',') + ', ' + BG_OPACITY + ')';
    },
  },
}
</script>

<style scoped>
.area-cell {
  display:block;
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  line-height:35px;
  overflow:hidden;
}

.name {
  display:block;
  transform: rotate(-45deg);
  white-space:nowrap;
  text-align:center;
  text-overflow-ellipsis: ellipsis;
}
</style>
