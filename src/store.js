import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: {
      loggedIn: false,
      data: null
    },
    theme: {
      dark: false,
      editorTheme: "chrome"
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    theme(state) {
      return state.theme;
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    SET_THEME(state, value) {
      state.theme.dark = value;
    },
    SET_EDITOR_THEME(state, data) {
      state.theme.editorTheme = data;
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          id: user.uid,
          fullName: user.name
        });
      } else {
        commit("SET_USER", null);
      }
    }
  }
});

export default store;

