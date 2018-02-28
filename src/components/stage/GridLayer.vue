<template>
  <div class="grid-layer">
    <table ref="table" :style="{width:tableWidth+'px', height:tableHeight+'px', left:adjustLeft+'px', top:adjustTop+'px'}">
      <tr v-for="row in cells">
        <td class="cell" v-for="cell in row" :key="cell.key" :style="{width:cellWidth+'px', height:cellHeight+'px'}" @click="onClickCell(cell)" :title="cell.x + ', ' + cell.y">
          <area-cell :x="cell.x" :y="cell.y" v-if="isArea(cell)"></area-cell>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import AreaCell from './AreaCell.vue';

const CELL_WIDTH = 33;
const CELL_HEIGHT = 33;
const ADJUST_UNIT_X = 152.814;
const ADJUST_UNIT_Y = 87.603;
const ADJUST_X = -32;
const ADJUST_Y = 8;

export default {
  name: 'GridLayer',
  components: {AreaCell},
  props: {
    viewport: {
      type: Object,
    },
  },
  data: () => ({
    rowCount: 40,
    columnCount: 40,
    cellWidth: CELL_WIDTH,
    cellHeight: CELL_HEIGHT,
    cells: [],
  }),
  computed: {
    tableWidth() {
      return CELL_WIDTH * this.columnCount;
    },
    tableHeight() {
      return CELL_HEIGHT * this.rowCount;
    },
    adjustLeft() {
      return ADJUST_X - (this.viewport.left % ADJUST_UNIT_X);
    },
    adjustTop() {
      return ADJUST_Y - (this.viewport.top % ADJUST_UNIT_Y);
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.createCells();
      this.setPositionByViewport();
      this.updateCellXY();

      setTimeout(() => {
        $(this.$el).css({opacity: 1});
      }, 10);
    });
  },
  watch: {
    'viewport.left' () {
      $(this.$el).css({left: this.viewport.left});
      this.updateCellXY();
    },
    'viewport.top' () {
      $(this.$el).css({top: this.viewport.top});
      this.updateCellXY();
    },
  },
  methods: {
    setPositionByViewport() {
      $(this.$el).css({
        left: this.viewport.left,
        top: this.viewport.top,
      });
    },
    updateCellXY () {
      const cells = this.cells;

      for(let i=0;i<this.rowCount;i++){
        for(let j=0;j<this.columnCount;j++){
          let x = i + 1000;
          let y = j + 1000;

          x = x - Math.floor(this.viewport.left / ADJUST_UNIT_X) + Math.floor(this.viewport.top / ADJUST_UNIT_Y);
          y = y + Math.floor(this.viewport.left / ADJUST_UNIT_X) + Math.floor(this.viewport.top / ADJUST_UNIT_Y);

          cells[i][j] = {
            x,
            y,
            key: x + '_' + y,
          };
        }
      }
    },
    // 전체 셀 목록 생성
    createCells () {
      const cells = [];

      for(let i=0;i<this.rowCount;i++){
        for(let j=0;j<this.columnCount;j++){
          if(!cells[i]){
            cells[i] = {};
          }

          cells[i][j] = {x:0, y:0};
        }
      }

      this.cells = cells;
    },
    onClickCell(cell){
      this.$emit('click', cell);
    },
    isArea(cell){
      return this.$store.state.area.areas.find(area => area.x===cell.x && area.y===cell.y);
    }
  }
};
</script>

<style scoped>
.grid-layer {
  position: absolute;
  width:100%;
  height:100%;
  user-select:none;
  overflow: hidden;
  opacity:0;
  transition:opacity 0.5s;
}
table {
  position: absolute;
  left:0;
  top:0;
  border-collapse:collapse;
  table-layout:fixed;
  transform: scale(3, 1.725) rotate(45deg);
}
.cell {
  position:relative;
  border-width:1px;
  border-style:dotted;
  border-color:rgba(0,255,0,0.3);
  color:#fff;
  text-align:center;
  font-size:1px;
}
.cell:hover {
  background-color:rgba(255,255,255,0.2);
}
</style>