import { IGenericObject } from '../config/interfaces';
import routes from '../config/routesAndViews';
import _ from 'lodash';

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeKey = (obj: IGenericObject, id: string) => {
  return Object.keys(obj).reduce((ret, i) => {
    return { ...ret, ...(i !== id && { [i]: obj[i] }) };
  }, {});
};

export const buildPathWithParams = (path: string, params: any) => {
  let finalPath = path;
  Object.keys(params).forEach(key => {
    finalPath = finalPath.replace(`:${key}`, params[key]);
  });

  return finalPath.replace(/\([^\)\(]*\)/, '');
};

export const decodeURItoJson = (data: string) => {
  try {
    return JSON.parse(atob(data.split(',')[1]));
  } catch (e) {
    return null;
  }
};

export const decodeTextToScatter = (_data: string) => {
  let data = atob(_data.split(',')[1]);
  try {
    if (data.length === 0) throw new Error('');
    const pt = data.split('\n');
    const line1pt = pt[0].split(' ');
    if (line1pt.length !== 4) throw new Error('');
    return line1pt;
  } catch (e) {
    return null;
  }
};

export const isPrefix = (prefix: string): boolean => {
  if (prefix) {
    const pt = prefix.split('/');
    const [ip, sec] = pt;
    const ptip = ip.split('.');
    const areDiff = [...ptip, sec].reduce((ret, item) => {
      return ret || item !== parseInt(item).toString();
    }, false);

    if (!sec || areDiff || ptip.length !== 4) return false;
  }
  return true;
};

export const firstKeyOf = (data: IGenericObject, level = 1, current = 1): any => {
  const [first] = Object.keys(data);
  if (level === current) return data[first];
  return firstKeyOf(data[first], level, current + 1);
};

const findPath = (path: any, ret: any = []): [] => {
  const routeIndex: any = Object.keys(routes).find((i: any) => routes[i].path === path);
  const inRoutes = routes[routeIndex];
  const { breadcrumbsTitle = `breadcrumb${_.capitalize(routeIndex)}`, parent } = inRoutes;
  ret = [
    {
      breadcrumbsTitle,
      path,
    },
    ...ret,
  ];
  return parent ? findPath(routes[parent].path, ret) : ret;
};

export const getPath = (p: any) => {
  //console.log(p);
  return findPath(p);
};

export const isEqual = (s1: any, s2: any) => {
  return s1 && s2 && s1.toString().toLowerCase() === s2.toString().toLowerCase();
};

export const C = {
  _FORCE_VALUE: 'FORCE_VALUE',
  _DATA: 'data',
  _FIXED: 'fixed',
};

export const IsDev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
