import { combineReducers } from 'redux';
import { SessionActions } from './redux_session/types';
import { RootState } from 'ReduxTypes';
import { ActionType } from 'typesafe-actions';
import sessionReducer from './redux_session/reducers';
import globalReducer from './redux_global/reducers';

const appReducer = combineReducers({
  session: sessionReducer,
  global: globalReducer,
});

const root_reducer = (state: RootState, action: ActionType<any>) => {
  const newState = action.type === SessionActions.DISCONNECT ? undefined : state;
  return appReducer(newState, action);
};

export default root_reducer;
