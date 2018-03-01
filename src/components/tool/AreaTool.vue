<template>
  <div class="area-tool">
    <h2 class="tool-title">영역 설정</h2>
    <ul class="tool-body">
      <li class="add"><button @click="onClickAddOwner">추가</button></li>
      <li v-for="owner in owners" class="owner"
          :key="owner.id"
          :class="{selected:selectedOwnerId===owner.id}"
          @click="onClickOwner(owner)"
          @dblclick="onDblclick(owner)">
        <button :style="{'background-color':owner.color}">{{owner.name}}</button>
        <span class="remove-btn" @click.stop="onClickRemoveOwner(owner)" @dblclick.stop="">삭제</span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'AreaTool',
    computed: {
      owners () {
        return this.$store.state.area.owners;
      },
      selectedOwnerId () {
        return this.$store.state.area.selectedOwnerId;
      }
    },
    methods: {
      onClickOwner (owner) {
        this.$store.commit('toggleOwner', {
          ownerId: owner.id
        });
      },
      onDblclick (owner) {
        const name = prompt('이름을 변경하세요.', owner.name);

        if(name){
          // TODO : 스토어 사용하도록
          owner.name = name;
        }
      },
      onClickAddOwner () {
        const rgb = Array(3).fill(null).map(v => Math.floor(51 + Math.random() * 153).toString(16));

        this.$store.commit('addOwner', {
          name: 'user{seq}',
          color: '#' + rgb.join(''),
        });
      },
      onClickRemoveOwner (owner) {
        this.$store.commit('removeOwner', {
          ownerId: owner.id,
        });
      }
    }
  }
</script>

<style scoped>
  .tool-title {
    margin:10px;
    font-size:12px;
    color:#fff;
  }

  .tool-body {
    margin:5px 10px;
    padding:0px;
    list-style:none;
  }

  .area-tool {

  }

  .area-tool .tool-body {

  }

  .area-tool .tool-body::after {
    content:"";
    display:block;
    clear:both;
  }

  .area-tool li {
    float:left;
    position:relative;
  }

  .area-tool li button {
    display:block;
    width:51px;
    height:51px;
    margin:0 2px 5px 2px;
    border:0;
    border-radius:10px;
    background-color:#000;
    color:#fff;
    outline:none;
    cursor:pointer;
  }

  .area-tool li.add button {
    border:3px solid #fff;
  }

  .area-tool li.selected button {
    border:3px dashed #fff;
  }

  .area-tool .remove-btn {
    position:absolute;
    top:-5px;
    right:0px;
    width:15px;
    height:15px;
    border-radius:15px;
    background-color:#000;
    overflow:hidden;
    text-indent:-100px;
    font-size:0;
    cursor:pointer;
    display:none;
  }
  .area-tool li:hover .remove-btn {
    display:block;
  }

  .area-tool .remove-btn:hover {
    background-color:#444;
  }
  .area-tool .remove-btn::after {
    display:block;
    content:"x";
    font-size:7px;
    color:#fff;
    text-indent:0;
    text-align:center;
    line-height:15px;
  }
</style>
