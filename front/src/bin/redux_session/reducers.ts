import { handleActions } from 'redux-actions';
import { User, SessionActions } from './types';
import { ActionType } from 'typesafe-actions';
import { StorageHelper } from '../../utils/StorageHelper';
import { IGenericObject } from '../../config/interfaces';
import { permissionsByRoles } from '../../config/permissions';
import { RootState } from 'ReduxTypes';

const storage = new StorageHelper();
const initialUser: User = {
  id: '',
  name: '',
  lang: 'en',
  roles: 'ANNONIMOUS',
  access_token: '',
  expires_in: 0,
  token_type: '',
};

const initialState = {
  user: initialUser,
  permissions: [],
};

export type SessionState = typeof initialState;

const sessionReducer = handleActions<SessionState, ActionType<any>>(
  {
    [SessionActions.LOGIN]: (state, { payload }: IGenericObject) => {
      const { user } = payload;
      return userInfo(state, user);
    },
    [SessionActions.DISCONNECT]: state => {
      return userInfo(state);
    },
    [SessionActions.AUTH_CHECK]: state => {
      return userInfo(state);
    },
  },
  initialState
);

const userInfo = (state: RootState, data = null, save = true) => {
  const user = data || storage.get('user') || initialState.user;

  const { roles } = user;
  data && storage.add('user', user);

  const permissions = roles.split(',').reduce((ret: string[], item: string) => {
    return [...ret, ...permissionsByRoles[item]];
  }, []);

  ////console.log(user);
  ////console.log(roles);
  ////console.log(permissions);

  return {
    ...state,
    user,
    permissions,
  };
};
export default sessionReducer;
