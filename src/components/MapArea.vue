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
    <div class="map-selector">
      <ul class="urban-list">
        <li class="urban-item" v-for="(urbans, key) in islands" :class="{active:activeUrban===key}" @click="onClickUrban(key)"><span>{{getUrbanName(key)}}</span>
          <ul class="map-list">
            <li class="map-item" v-for="map in urbans" :class="{active:selectedMap===map.code}"><a href="#" @click.prevent="onClickMap(key, map.code)">{{map.name}}</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import MapLayer from './stage/MapLayer.vue';
import GridLayer from './stage/GridLayer.vue';
import islands from '../data/islands.js';

const HIDE_GRID_WHEN_SCROLLING = true;

const URBAN_NAMES = {
  'asia-a':'도시섬 - 알파',
  'asia-b':'도시섬 - 브라보',
  'asia-c':'도시섬 - 찰리',
  'asia-d':'도시섬 - 델타',
  'asia-e':'도시섬 - 에코',
};

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
    activeUrban: null,
  }),
  computed: {
    renderGrid () {
      return !HIDE_GRID_WHEN_SCROLLING || !this.isScrolling;
    },
    selectedMap () {
      return this.$store.state.map.code;
    },
    islands () {
      return islands;
    }
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
    getUrbanName(urban){
      return URBAN_NAMES[urban];
    },
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
    },
    onClickUrban(urban){
      this.activeUrban = this.activeUrban === urban ? null : urban;
    },
    onClickMap(urban, code){
      this.$store.commit('changeMap', {
        urban, code
      });
      this.$nextTick(() => {
        this.setViewportToCenter();
      })
    },
  }
}
</script>

<style scoped>
.map-pos {
  position:absolute;
  right:255px;
  top:10px;
  font-size:14px;
  color:#fff;
  user-select:none;
  text-align:right;
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

.map-selector {
  position:absolute;
  left:10px;
  top:10px;
  width:150px;
  font-size:12px;
  user-select:none;
  background-color:rgba(255,255,255,1);
  border-radius:3px;
  color:#000;
  border:1px solid #000;
}

.map-selector ul {
  list-style:none;
  margin:0;
  padding:0;
}

.urban-list {

}

.urban-list .urban-item {
  position:relative;
}

.urban-list .urban-item>span {
  display:block;
  padding:10px;
  border-top:1px solid #ccc;
  cursor:pointer;
}

.urban-list .urban-item:first-child>span{
  border-top:none;
}

.urban-list .urban-item::after {
  content:"+";
  position:absolute;
  right:10px;
  top:5px;
  font-size:25px;
  color:#666;
}

.urban-list .urban-item.active::after {
  content:"-";
}

.map-list {
  max-height:400px;
  overflow-y:auto;
  background-color:#f0f0f0;
}

.map-list .map-item {
  display:none;
}

.map-list .map-item a {
  display:block;
  padding:5px;
  border-top:1px solid #ccc;
  font-size:11px;
  color:#333;
  text-decoration:none;
}

.map-list .map-item a:hover {
  background-color:#eee;
}

.map-list .map-item a::before {
  content: "-";
  display:inline-block;
  padding:0 5px;
}

.urban-list .urban-item.active .map-item {
  display:block;
}

.map-list .map-item.active {
  display:block;
}

.map-list .map-item.active a {
  background-color:#e5e5e5;
}

.map-list .map-item.active a::before {
  content: ">";
}
</style>
