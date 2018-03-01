<template>
  <div class="grid-layer">
    <table ref="table" :class="{transparent:!visible}" :style="{width:tableWidth+'px', height:tableHeight+'px', left:adjustLeft+'px', top:adjustTop+'px'}">
      <tr v-for="row in cells">
        <td class="cell" v-for="cell in row" :key="cell.key" :style="{width:cellWidth+'px', height:cellHeight+'px'}" @click="onClickCell(cell)" :title="cell.x + ', ' + cell.y">
          <area-cell :x="cell.x" :y="cell.y" v-if="isArea(cell)" />
          <dimmed-cell v-if="isDimmed(cell)" />
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import AreaCell from './AreaCell.vue';
import DimmedCell from './DimmedCell.vue';

const CELL_WIDTH = 33;
const CELL_HEIGHT = 33;
const ADJUST_UNIT_X = 152.814;
const ADJUST_UNIT_Y = 87.603;
const ADJUST_X = -32;
const ADJUST_Y = 8;

export default {
  name: 'GridLayer',
  components: {AreaCell,DimmedCell},
  props: {
    viewport: {
      type: Object,
    },
    visible: {
      type: Boolean,
    }
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

          cells[i][j].x = x;
          cells[i][j].y = y;
          cells[i][j].i = i;
          cells[i][j].j = j;
          cells[i][j].key = x + '_' + y;
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

          cells[i][j] = {x:0, y:0, i, j};
        }
      }

      this.cells = cells;
    },
    onClickCell(cell){
      if(this.$store.state.area.selectedOwnerId) {
        if (this.isDimmed(cell)) {
          return;
        }

        this.$store.commit('toggleArea', {
          x: cell.x,
          y: cell.y
        });
      }
    },
    isArea(cell, areas){
      areas = areas || this.$store.state.area.areas;
      return areas.find(area => area.x===cell.x && area.y===cell.y);
    },
    isDimmed(cell) {
      // 현재 오너의 영역이 없으면 false
      // 있고 인접하지 않은 셀이면 true
      if(!this.$store.state.area.selectedOwnerId){
        return false;
      }

      const state = this.$store.state;
      const ownerAreas = state.area.areas.filter(area => area.ownerId === state.area.selectedOwnerId);
      const otherAreas = state.area.areas.filter(area => area.ownerId !== state.area.selectedOwnerId);
      let dimmed = true;

      if (ownerAreas.length && !this.isArea(cell, otherAreas)) {
        if (this.isArea(cell, ownerAreas)) {
          dimmed = false;
        } else if (this.cells[cell.i][cell.j - 1] && this.isArea(this.cells[cell.i][cell.j - 1], ownerAreas)) {
          dimmed = false;
        } else if (this.cells[cell.i][cell.j + 1] && this.isArea(this.cells[cell.i][cell.j + 1], ownerAreas)) {
          dimmed = false;
        } else if (this.cells[cell.i - 1] && this.cells[cell.i - 1][cell.j] && this.isArea(this.cells[cell.i - 1][cell.j], ownerAreas)) {
          dimmed = false;
        } else if (this.cells[cell.i + 1] && this.cells[cell.i + 1][cell.j] && this.isArea(this.cells[cell.i + 1][cell.j], ownerAreas)) {
          dimmed = false;
        }
      } else if (!this.isArea(cell, otherAreas) && !this.isArea(cell, ownerAreas)) {
        dimmed = false;
      }

      return dimmed;
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
table.transparent .cell{
  border-color:transparent;
}
</style>
