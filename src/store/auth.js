import firebase from 'firebase/app';

import store from './index';
import { errorsCodes } from './errorsCodes';

const state = { user: null, accessToken: null, refreshToken: null };
const getters = {
  user: state => state.user,
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken
};
const mutations = {
  setUser: (state, payload) => (state.user = payload),
  setAccessToken: (state, payload) => (state.accessToken = payload),
  setRefreshToken: (state, payload) => (state.refreshToken = payload)
};
const actions = {
  loginUserWithEmailAndPassword: async (context, { email, password }) => {
    try {
      const data = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      console.log(data.user);
      context.commit('setUser', { email: data.user.email, id: data.user.uid });
      context.commit('setAccessToken', data.user.ra);
      context.commit('setRefreshToken', data.user.refreshToken);
    } catch (error) {
      switch (error.code) {
        case errorsCodes.userNotFound:
          store.dispatch('pushNotification', 'User not found!');
          throw new Error('User not found');

        case errorsCodes.wrongPassword:
          store.dispatch('pushNotification', 'Wrong password!');

          throw new Error('Wrong password');

        case errorsCodes.tooManyUnsuccessfulLoginRequest:
          store.dispatch('pushNotification', 'Too many unsuccessful requests!');

          throw new Error('Too many unsuccessful requests');

        default:
          store.dispatch('pushNotification', 'Server error!');

          throw new Error('Server error');
      }
    }
  },

  logout: async () => {
    await firebase.auth().signOut();
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};