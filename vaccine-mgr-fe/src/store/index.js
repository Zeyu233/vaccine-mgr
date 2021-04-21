import { createStore, Store } from 'vuex';
import { character, user, vaccineClassify } from '@/service';
import { getCharacterInfoById } from '@/helpers/character';
import { result } from '@/helpers/utils';

export default createStore({
  state: {
    characterInfo: [],
    vaccineClassify: [],
    userInfo: {},
    userCharacter: {},
  },
  mutations: {
    setCharacterInfo(state, characterInfo) {
      state.characterInfo = characterInfo;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setUserCharacter(state, userCharacter) {
      state.userCharacter = userCharacter;
    },
    setVaccineClassify(state, vaccineClassify) {
      state.vaccineClassify = vaccineClassify;
    },
  },
  actions: {
    async getVaccineClassify(store) {
      const res = await vaccineClassify.list();

      result(res)
        .success(({data}) => {
          store.commit('setVaccineClassify', data);
        });
    },
    async getCharacterInfo(store) {
      const res = await character.list();

      result(res)
        .success(({ data }) => {
          store.commit('setCharacterInfo', data);
        });
    },
    async getUserInfo(store) {
      const res = await user.info();

      result(res)
        .success(({ data }) => {
          store.commit('setUserInfo', data);
          store.commit('setUserCharacter', getCharacterInfoById(data.character));

          console.log(store.state);
        });
    },
  },
});
