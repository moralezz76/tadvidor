import { Permission } from '../utils/roles/AbilityContext';
import { permissionNames } from './permissions';

export type IPermissionType = typeof permissionNames[number];

export interface IGenericObject {
  [key: string]: any;
}

export interface IGenericReactNode {
  [key: string]: React.ReactNode | IGenericObject;
}

export interface IPermission {
  [key: string]: Permission;
}

export interface IRolesDef {
  startPage: IRoutesDef;
  permissions: IGenericObject[];
}

export interface IRoles {
  [key: string]: IRolesDef;
}

export interface IRolePermissions {
  [key: string]: Permission[];
}

export interface IRoutesDef {
  path: string;
  permission: Permission | null;
  view: React.ComponentType<any> | null;
  breadcrumbsTitle?: string;
  parent?: string;
  defaultState?: IGenericObject;
}

export interface IRoutes {
  [key: string]: IRoutesDef;
}

export interface IMethodDef {
  url: string;
  errorMessage?: false;
  successDispatch?: string;
  successMessage?: string;
  useLoading?: boolean | string;
  dispatchResponse?: boolean;
  removeEmptyData?: boolean;
}

export interface IEndpointDef {
  get?: IMethodDef | string;
  post?: IMethodDef | string;
  put?: IMethodDef | string;
  delete?: IMethodDef | string;
  update?: IMethodDef | string;
  url?: string;
  accept?: requestType[];
}
export interface IEndpoint {
  [key: string]: IEndpointDef;
}

export type requestType = 'put' | 'delete' | 'get' | 'post' | 'update';

export interface IRequestResult<T = IGenericObject> {
  status: number;
  message: string;
  step: number;
  errors: IGenericObject;
  data: T;
}
