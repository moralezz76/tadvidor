import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from 'redux';
import { StorageHelper } from '../../utils/StorageHelper';
import { SessionActions } from './types';

const SessionMiddleware: Middleware<Dispatch> = (api: MiddlewareAPI) => next => (
  action: AnyAction
) => {
  const storage = new StorageHelper();

  //////console.log(action);
  //////console.log(api.getState());

  // Clean local storage in logout
  if (action.type === SessionActions.DISCONNECT) {
    const {
      payload: { expired = false },
    } = action;
    if (expired) {
      const lastPath = storage.get('lastPath');
      storage.clear();
      storage.add('lastPath', lastPath);
    } else storage.clear();
  }

  next(action);
};

export default SessionMiddleware;
