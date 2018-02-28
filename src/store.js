import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    toolMode: 'area',
    area: {
      owners: [
        {id: 1, color: '#0000ff', name: '옥'},
        {id: 2, color: '#00ff00', name: '박'},
      ],
      areas: [
        {ownerId:1,x:1016,y:1013},
        {ownerId:1,x:1016,y:1014},
        {ownerId:2,x:1019,y:1020},
        {ownerId:2,x:1019,y:1021},
        {ownerId:2,x:1019,y:1022},
        {ownerId:2,x:1018,y:1021},
        {ownerId:2,x:1020,y:1021},
      ],
      selectedOwnerId: 1,
    },
  },
  mutations: {
    addOwner (state, payload) {
      const newOwnerSeq = state.area.owners.length ? Math.max.apply(null, state.area.owners.map(owner => owner.id)) + 1 : 1;

      state.area.owners.push({
        id: newOwnerSeq,
        name: payload.name.replace('{seq}', newOwnerSeq) || newOwnerSeq,
        color: payload.color,
      });

      if(state.area.owners.length === 1) {
        state.area.selectedOwnerId = newOwnerSeq;
      }
    },
    removeOwner (state, payload) {
      const findedOwner = state.area.owners.find(owner => owner.id===payload.ownerId);
      const findedAreas = state.area.areas.filter(area => area.ownerId===payload.ownerId);

      state.area.owners.splice(state.area.owners.indexOf(findedOwner), 1);

      findedAreas.forEach(area => {
        state.area.areas.splice(state.area.areas.indexOf(area), 1);
      });
    },
    selectOwner (state, payload) {
      state.area.selectedOwnerId = payload.ownerId;
    },
    toggleArea (state, payload) {
      const findedArea = state.area.areas.find(area => area.x===payload.x && area.y===payload.y);

      if(findedArea){
        state.area.areas.splice(state.area.areas.indexOf(findedArea), 1);
      }

      if(!findedArea || findedArea.ownerId !== state.area.selectedOwnerId) {
        state.area.areas.push({
          ownerId: state.area.selectedOwnerId,
          x: payload.x,
          y: payload.y,
        });
      }
    },
  }
});
