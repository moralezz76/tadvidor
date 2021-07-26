import { createSelector } from 'reselect';
import { RootState } from 'ReduxTypes';
import { SessionState } from './reducers';
const getSessionState: (s: RootState) => SessionState = state => state.session;

export const getUser = createSelector(getSessionState, state => {
  return state.user;
});

export const getUserPermission = createSelector(getSessionState, state => {
  return state.permissions;
});

export const getUserRoles = createSelector(getSessionState, state => {
  return state.user.roles;
});
