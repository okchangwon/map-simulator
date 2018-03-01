export default {
  state: {
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
  mutations: {
    addOwner (state, payload) {
      const newOwnerSeq = state.owners.length ? Math.max.apply(null, state.owners.map(owner => owner.id)) + 1 : 1;

      state.owners.push({
        id: newOwnerSeq,
        name: payload.name.replace('{seq}', newOwnerSeq) || newOwnerSeq,
        color: payload.color,
      });

      if(state.owners.length === 1) {
        state.selectedOwnerId = newOwnerSeq;
      }
    },
    removeOwner (state, payload) {
      const findedOwner = state.owners.find(owner => owner.id===payload.ownerId);
      const findedAreas = state.areas.filter(area => area.ownerId===payload.ownerId);

      state.owners.splice(state.owners.indexOf(findedOwner), 1);

      findedAreas.forEach(area => {
        state.areas.splice(state.areas.indexOf(area), 1);
      });
    },
    selectOwner (state, payload) {
      state.selectedOwnerId = payload.ownerId;
    },
    toggleArea (state, payload) {
      const findedArea = state.areas.find(area => area.x === payload.x && area.y === payload.y);

      if(findedArea){
        state.areas.splice(state.areas.indexOf(findedArea), 1);
      }

      if(!findedArea || findedArea.ownerId !== state.selectedOwnerId) {
        state.areas.push({
          ownerId: state.selectedOwnerId,
          x: payload.x,
          y: payload.y,
        });
      }
    },
  }
};
