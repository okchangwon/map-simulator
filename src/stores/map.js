export default {
  state: {
    urban: localStorage.getItem('urban') || 'asia-b',
    code: localStorage.getItem('mapCode') || '0vYn9SgYzsczVrPMINT0Lg',
  },
  mutations: {
    changeMap(state, payload){
      state.urban = payload.urban;
      state.code = payload.code;

      localStorage.setItem('urban', payload.urban);
      localStorage.setItem('mapCode', payload.code);
    },
  },
};
