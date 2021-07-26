import { Dispatch } from 'redux';
import { GlobalActions } from './types';
import { IGenericObject } from '../../config/interfaces';

/* SAMPLE CODE */

export const endLoadingAction = () => async (dispatch: Dispatch) => {
  dispatch({ type: GlobalActions.LOADING, payload: false });
  //////console.log('action');
};

/* START REAL */

export const addToast = (data: IGenericObject) => async (dispatch: Dispatch) => {
  const { type = 'success', id = `toast${Math.random().toString().substr(1)}` } = data;
  const toast = {
    type,
    id,
    ...data,
  };
  dispatch({ type: GlobalActions.ADD_TOAST, payload: { toast } });
};

export const removeToast = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: GlobalActions.REMOVE_TOAST, payload: { id } });
};

export const addModal = (modal: IGenericObject) => async (dispatch: Dispatch) => {
  dispatch({ type: GlobalActions.ADD_MODAL, payload: { modal } });
};

export const removeModal = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: GlobalActions.REMOVE_MODAL, payload: { id } });
};
