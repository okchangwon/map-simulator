<template>
  <table class="map-layer" :style="{width:mapWidth+'px', height:mapHeight+'px'}" @dragstart.prevent="">
    <tr v-for="(row) in tiles">
      <td v-for="(tile) in row" class="tile" :style="{width:tileWidth+'px', height:tileHeight+'px'}">
        <img v-if="isVisibleTile(tile)" :src="getSourceURL(tile.x, tile.y)" @load="onLoadImage(tile)" @error="onErrorLoadImage(tile)" :key="tile.key" :style="{opacity:tile.loaded ? 1 : 0}"/>
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  name: 'MapLayer',
  props: {
    viewport: {
      type: Object
    }
  },
  data: () => ({
    columnCount: 41,
    rowCount: 41,
    tileWidth: 960,
    tileHeight: 540,
    tileImagePath: 'static/map/bravo/enchiladacoke',
    mapWidth: 0,
    mapHeight: 0,
    tiles: [],
  }),
  mounted () {
    this.mapWidth = (this.columnCount * this.tileWidth);
    this.mapHeight = (this.rowCount * this.tileHeight);

    this.$nextTick(() => {
      this.createTiles();
    });
  },
  computed: {
    // 화면에 보여지고 있는 타일들의 목록을 배열로 반환
    visibleTiles () {
      const tiles = [];
      const columnIdx = Math.floor(this.viewport.left / this.tileWidth);
      const columnCnt = Math.ceil(this.viewport.width / this.tileWidth) + 1;
      const rowIdx = Math.floor(this.viewport.top / this.tileHeight);
      const rowCnt = Math.ceil(this.viewport.height / this.tileHeight) + 1;

      for(let i=rowIdx;i<rowIdx+rowCnt;i++){
        for(let j=columnIdx;j<columnIdx+columnCnt;j++){
          if(this.tiles[i] && this.tiles[i][j]) {
            tiles.push(this.tiles[i][j]);
          }
        }
      }

      return tiles;
    }
  },
  methods: {
    isVisibleTile (tile) {
      return this.visibleTiles.indexOf(tile) !== -1 && !tile.disabled;
    },
    // 전체 타일 목록 생성
    createTiles () {
      const tiles = [];

      for(let i=0;i<this.rowCount;i++){
        for(let j=0;j<this.columnCount;j++){
          if(!tiles[i]){
            tiles[i] = {};
          }

          const x = j;
          const y = this.rowCount - i - 1;
          const loaded = false;
          const disabled = false;
          const key = x + '_' + y;

          tiles[i][j] = {key, x, y, i, j, loaded, disabled};
        }
      }

      this.tiles = tiles;
    },
    getSourceURL(x, y) {
      return `${this.tileImagePath}/${x}_${y}.jpeg`;
    },
    onLoadImage(tile) {
      tile.loaded = true;
    },
    onErrorLoadImage(tile) {
      tile.disabled = true;
    }
  }
}
</script>

<style scoped>
  .map-layer {
    table-layout:fixed;
    border-collapse:collapse;
    user-select:none;
  }

  .map-layer img {
    transition: opacity 0.5s;
  }

  .tile {
    width:100px;
    height:100px;
    padding:0;
    font-size:0;
  }
</style>
