import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { baseURL } from '../config/AppUrls';
import { StorageHelper } from '../utils/StorageHelper';

export interface ApiResponse<T = any> {
  data: T;
  hasError?: boolean;
  error?: any;
}

export interface ApiError {
  code: number;
  description: string;
  status: number;
  hasError: boolean;
  detail?: any;
}

export class ApiService {
  instance: any | AxiosInstance = null;

  constructor() {
    var CancelToken = axios.CancelToken;
    if (this.instance === null) {
      this.instance = axios.create({
        baseURL,
        withCredentials: true,
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          window.cancelRequest = c;
        }),
      });
    }
    this.instance.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError): ApiResponse<ApiError> => {
        const {
          response = { status: 500, data: { code: 0, description: '', status: 500 } },
        } = error;
        const { status, data } = response;
        return { data: { ...data, status, hasError: true } };
      }
    );

    this.instance.interceptors.request.use(
      function (config: any) {
        const storage = new StorageHelper();
        const { access_token } = storage.get('user') || {};

        if (access_token) {
          config.headers['Authorization'] = `Bearer ${access_token}`;
        }
        return config;
      },
      function (error: AxiosError) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
  }

  static get logoutStatus(): number[] {
    return [401];
  }

  resolveResponse<T = any>(promise: AxiosPromise<T | ApiError>) {
    return new Promise<T>(async (resolve, reject) => {
      const response = await promise;
      const { data } = response as any;
      if (data.hasError) {
        reject(data);
      }
      resolve(data as T);
    });
  }

  resolveResponseWithHeaders<T = any>(promise: AxiosPromise<any>) {
    return new Promise<T>(async (resolve, reject) => {
      const response = await promise;
      const { data, headers } = response as any;
      if (response.data.hasError) {
        reject(data);
      }
      const dataWithHeaders = {
        data,
        headers,
      };
      resolve(dataWithHeaders as any);
    });
  }

  request<T = any>(options: AxiosRequestConfig): Promise<T> {
    return this.resolveResponse(this.instance.request(options));
  }

  get<T = any>(
    url: string,
    params: any = {},
    options?: AxiosRequestConfig,
    responseWithHeaders: boolean = false
  ): Promise<T> {
    let join: string = '';
    let qs: string = '';
    if (Object.keys(params).length) {
      qs = this.queryString(params);
      join = url.includes('?') ? '&' : '?';
    }

    if (responseWithHeaders) {
      return this.resolveResponseWithHeaders(this.instance.get(url + join + qs, options));
    } else {
      return this.resolveResponse(
        this.instance.get(url + join + qs, {
          ...options,
        })
      );
    }
  }

  all = async (requests: any[]): Promise<any[]> => {
    return await Promise.all(requests);
  };

  post<T = any>(url: string, params: any = {}): Promise<T> {
    return this.resolveResponse(this.instance.post(url, params));
  }

  postMultipart<T = any>(url: string, params: any = {}): Promise<T> {
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const file = params.file;
    delete params.file;
    const data = new FormData();
    data.append('file', file);
    if (Object.keys(params).length) {
      const request = new Blob([JSON.stringify(params)], {
        type: 'application/json',
      });
      data.append('request', request);
    }
    return this.resolveResponse(this.instance.post(url, data, options));
  }

  put<T = any>(url: string, params: any = {}): Promise<T> {
    return this.resolveResponse(this.instance.put(url, params));
  }

  delete<T = any>(url: string, params: any = {}): Promise<T> {
    return this.resolveResponse(this.instance.delete(url, { data: params }));
  }

  queryString = (params: any): string =>
    Object.keys(params)
      .map(key => {
        if (params[key] instanceof Array) {
          return params[key]
            .map((value: string) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
      })
      .join('&');
}

const apiServiceInstance = new ApiService();

export default apiServiceInstance;
