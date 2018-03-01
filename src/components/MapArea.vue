<template>
  <div class="map-area" :class="{dragging:isDragging}">
    <div ref="stage" class="map-scroll-stage" @scroll="onScroll" @mousewheel.prevent="onMousewheel">
      <map-layer ref="mapLayer" :viewport="viewport"></map-layer>
      <grid-layer :viewport="viewport" :visible="showGridChecked" v-if="renderGrid"></grid-layer>
    </div>
    <div class="map-pos">
      {{Math.floor(viewport.left)}},{{Math.floor(viewport.top)}}<br />
      <label><input type="checkbox" v-model="showGridChecked"> Grid</label>
    </div>
  </div>
</template>
<script>
import MapLayer from './stage/MapLayer.vue';
import GridLayer from './stage/GridLayer.vue';

const HIDE_GRID_WHEN_SCROLLING = true;

export default {
  name: 'MapArea',
  components: {MapLayer, GridLayer},
  data: () => ({
    viewport: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
    isScrolling: false,
    scrollingTimer: null,
    mousedownFlag: false,
    mousedownOffset: null,
    isDragging: false,
    showGridChecked: true,
  }),
  computed: {
    renderGrid () {
      return !HIDE_GRID_WHEN_SCROLLING || !this.isScrolling;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setScroll();

      this.viewport.width = $(this.$refs.stage).width();
      this.viewport.height = $(this.$refs.stage).height();
      this.viewport.mapWidth = this.$refs.mapLayer.$data.mapWidth;
      this.viewport.mapHeight = this.$refs.mapLayer.$data.mapHeight;

      $(window).on('resize', () => {
        this.viewport.width = $(this.$refs.stage).width();
        this.viewport.height = $(this.$refs.stage).height();
      });

      $(this.$refs.stage).on('mousedown', this.onMousedown.bind(this));
      $(window).on('mousemove', this.onMousemove.bind(this));
      $(window).on('mouseup', this.onMouseup.bind(this));

      if(localStorage.getItem('viewportLeft')) {
        this.viewport.left = localStorage.getItem('viewportLeft');
        this.viewport.top = localStorage.getItem('viewportTop');
      }else{
        this.setViewportToCenter();
      }
    })
  },
  watch: {
    'viewport.left' (value) {
      $(this.$refs.stage).scrollLeft(value);
      localStorage.setItem('viewportLeft', value);
    },
    'viewport.top' (value) {
      $(this.$refs.stage).scrollTop(value);
      localStorage.setItem('viewportTop', value);
    }
  },
  methods: {
    setScroll() {
      $(this.$refs.stage).scrollLeft(this.viewport.left);
      $(this.$refs.stage).scrollTop(this.viewport.top);
    },
    setViewportToCenter() {
      this.viewport.left = this.$refs.mapLayer.$data.mapWidth / 2;
      this.viewport.top = this.$refs.mapLayer.$data.mapHeight / 2;
    },
    onScroll(e) {
      const $target = $(e.target);

      this.viewport.left = $target.scrollLeft();
      this.viewport.top = $target.scrollTop();

      this.setScrollingFlag();

      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      return false;
    },
    setScrollingFlag () {
      this.isScrolling = true;

      if(this.scrollingTimer){
        clearTimeout(this.scrollingTimer);
      }

      this.scrollingTimer = setTimeout(() => {
        this.$nextTick(() => {
          this.isScrolling = false;
        });
      }, 50);
    },
    adjustViewportPosition(x, y, speed=3){
      let left = Math.max(0, this.viewport.left + x * speed);
      let top = Math.max(0, this.viewport.top + y * speed);

      left = Math.min(left, this.$refs.mapLayer.$data.mapWidth - this.viewport.width);
      top = Math.min(top, this.$refs.mapLayer.$data.mapHeight - this.viewport.height);

      this.viewport.left = left;
      this.viewport.top = top;
    },
    onMousewheel(e) {
      this.adjustViewportPosition(e.deltaX, e.deltaY, 3);
    },
    onMousedown(e){
      this.mousedownFlag = true;
      this.mousedownOffset = {
        x: e.offsetX,
        y: e.offsetY,
      };
      this.isDragging = false;
    },
    onMousemove(e){
      if(!this.mousedownFlag) {
        return;
      }

      if(this.isDragging){
        this.adjustViewportPosition(-e.originalEvent.movementX, -e.originalEvent.movementY, 1);
      }else if(Math.abs(this.mousedownOffset.x-e.offsetX) + Math.abs(this.mousedownOffset.y-e.offsetY) > 2){
        this.isDragging = true;
      }
    },
    onMouseup(e){
      this.mousedownFlag = false;
      this.isDragging = false;
    }
  }
}
</script>

<style scoped>
  .map-pos {
    position:absolute;
    left:10px;
    top:10px;
    font-size:14px;
    color:#fff;
    user-select:none;
  }
  .map-scroll-stage {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:#122549;
    overflow:auto;
  }

  .map-area.dragging {
    cursor:move;
  }
</style>
