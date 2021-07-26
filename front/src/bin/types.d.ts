declare module 'ReduxTypes' {
  import { StateType, ActionType } from 'typesafe-actions';

  let StateType = import('./index').default;
  let ActionType = import('./root-action').default;
  let RootType = import('./root-reducer').default;

  export type Store = StateType<typeof StateType>;
  export type RootAction = ActionType<typeof ActionType>;
  export type RootState = StateType<typeof RootType>;
}

interface Window {
  dialog: any;
  cancelRequest: any;
}
