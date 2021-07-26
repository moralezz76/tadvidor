import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { GlobalActions } from './types';

const initialState = {
  loading: false,
  toasts: [],
  modals: [],
};

export type GlobalState = typeof initialState;

//////console.log('0');

const globalReducer = handleActions<GlobalState, ActionType<any>>(
  {
    [GlobalActions.LOADING]: (state, { payload: loading }) => {
      return { ...state, loading };
    },

    [GlobalActions.ADD_TOAST]: (state, { payload: { toast } }): any => {
      const { toasts } = state;
      return {
        ...state,
        toasts: [...toasts, toast],
      };
    },

    [GlobalActions.REMOVE_TOAST]: (state, { payload: { id } }): any => {
      const { toasts } = state;
      return {
        ...state,
        toasts: toasts.filter((i: any) => i.id !== id),
      };
    },

    [GlobalActions.ADD_MODAL]: (state, { payload: { modal } }): any => {
      const { modals } = state;

      return {
        ...state,
        modals: [...modals, modal],
      };
    },

    [GlobalActions.REMOVE_MODAL]: (state, { payload: { id } }): any => {
      const { modals } = state;
      return {
        ...state,
        modals: modals.filter((i: any) => i.id !== id),
      };
    },
  },

  initialState
);

export default globalReducer;
