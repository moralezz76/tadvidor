import { Permission } from '../utils/roles/AbilityContext';
import { IGenericObject, IPermission, IRolePermissions } from './interfaces';

// list of all permission names
export const permissionNames = [
  'auth_user',
  'annonimous_login',
  'annonimous_signup',
  'client_home',
  'admin_page',
  'all_roles',
] as const;

//list of all permission object
export const permissionObject: IPermission = permissionNames.reduce(
  (ret: IGenericObject, item: string) => {
    const [subject, action] = item.split('_');
    const np = new Permission(subject, action);
    return {
      ...ret,
      [item]: np,
    };
  },
  {}
);

const {
  auth_user,
  annonimous_login,
  annonimous_signup,
  client_home,
  admin_page,
  all_roles,
} = permissionObject;

const auth_permission: Permission[] = [auth_user, all_roles];

//permissions by roles
export const permissionsByRoles: IRolePermissions = {
  ANNONIMOUS: [all_roles, annonimous_login, annonimous_signup],
  CLIENT: [...auth_permission, client_home],
  ADMIN: [...auth_permission, admin_page],
};

export default permissionObject;
