export enum SessionActions {
  LOGIN = 'LOGIN',
  AUTH_CHECK = 'AUTH_CHECK',
  DISCONNECT = 'DISCONNECT',
}

export interface User {
  access_token: string;
  expires_in: number;
  id: string;
  lang: string;
  name: string;
  roles: string;
  token_type: string;
}
