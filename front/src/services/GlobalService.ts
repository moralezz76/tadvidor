import { IGenericObject } from '../config/interfaces';
import API from './ApiService';

export class GlobalService {
  static request = async (info: IGenericObject) => {
    const { url, data, type } = info;
    let result = null;

    switch (type) {
      case 'get':
        result = await API.get(url, data);
        break;
      case 'post':
        result = await API.post(url, data);
        break;
      case 'put':
        result = await API.put(url, data);
        break;
      case 'delete':
        result = await API.delete(url, data);
        break;
    }

    if (!result) {
      throw new Error('');
    }
    return result;
  };
}

export default GlobalService;
