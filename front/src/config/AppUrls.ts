import { IEndpoint } from './interfaces';
import { SessionActions } from '../bin/redux_session/types';

// endpoints
const baseURL = process.env.REACT_APP_API_BASE_URL;

const endpoints: IEndpoint = {
  // Authentication
  login: {
    post: {
      url: '/auth/login',
      errorMessage: false,
      successDispatch: SessionActions.LOGIN,
      successMessage: 'successLogin',
    },
  },
  disconnect: {
    post: {
      url: '/auth/logout',
      successDispatch: SessionActions.DISCONNECT,
      successMessage: 'successLogout',
    },
  },
  register: {
    post: {
      url: '/auth/register',
      errorMessage: false,
      successMessage: 'successRegisterUser',
    },
  },
  recover: {
    post: {
      url: '/auth/recover/:urlToken',
      successMessage: 'successRegisterUser',
    },
    get: '/auth/recover/:urlToken',
  },
  asn_names: {
    get: {
      url: '/asn/list',
      errorMessage: false,
    },
  },

  asn_data: {
    get: '/asn/data',
    post: {
      url: '/asn/addfav',
      successMessage: 'successAddFav',
    },
    delete: {
      url: '/asn/removefav/:asnfav',
      successMessage: 'successRemoveFav',
    },
  },

  asn_info: {
    get: '/provider/:id_asn/:menu/:id_country',
  },

  internet_index: {
    get: '/internet/index',
  },

  asn_report: {
    get: '/report/:id_asn/:id_country',
  },
};

export { endpoints, baseURL };
