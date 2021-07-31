import { IRoutes, IGenericObject } from './interfaces';
import permissionObject from './permissions';
import { LoginPage } from '../views';
import MainLayout from '../views/Layouts/Main/MainLayout';
import { tabsMenu } from '../views/Pages/Tabs/TabsHelpers';

////console.log('routes');

const { auth_user, annonimous_login } = permissionObject;

const getMenuItems = (mnu: IGenericObject, ret: any = []) => {
  Object.keys(mnu).forEach((v: any) => {
    if (typeof mnu[v] === 'string') ret = [...ret, mnu[v]];
    else ret = getMenuItems(mnu[v], ret);
  });
  return ret;
};

const generateMenu = (menuref: string) => {
  const items = getMenuItems(tabsMenu[menuref]);
  return `/:menu(${items.join('|')})`;
};

const routes: IRoutes = {
  HOME: {
    path: '/',
    permission: auth_user,
    view: MainLayout,
  },
  DASHBOARD: {
    path: '/dashboard' + generateMenu('dashboardMenu'),
    permission: auth_user,
    view: MainLayout,
    defaultState: {
      menu: 'search',
    },
  },

  PROVIDER: {
    path: '/provider/:id_asn' + generateMenu('providerMenu') + '/:id_country',
    permission: auth_user,
    view: MainLayout,
    defaultState: {
      menu: 'profile',
      id_country: 'global',
    },
  },

  INTERNET_INDEX: {
    path: '/internet/:find_by/:filter_value',
    permission: auth_user,
    view: MainLayout,
    defaultState: {
      menu: 'index',
      find_by: 'markets',
      filter_value: 'global',
    },
  },

  LOGIN: {
    path: '/login',
    permission: annonimous_login,
    view: LoginPage,
  },
};

export default routes;
