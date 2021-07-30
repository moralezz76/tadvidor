import { Dispatch } from 'redux';
import { endpoints } from '../../config/AppUrls';
import { t } from '../../config/i18n';
import { IMethodDef, IGenericObject, IRequestResult, requestType } from '../../config/interfaces';
import GlobalService from '../../services/GlobalService';
import { GlobalActions } from '../redux_global/types';
import { SessionActions } from './types';
//import AuthService from '../../services/AuthService';

export const callUrlServiceAction =
  <T = IGenericObject>(
    urlIndex: keyof typeof endpoints,
    data: IGenericObject,
    type: requestType = 'get',
    cb?: (data: IRequestResult<T>) => void
  ) =>
  async (dispatch: Dispatch) => {
    const { dialog } = window;

    const urlRef = endpoints[urlIndex];

    if (!urlRef) {
      dialog.toast({
        message: `${t('errorNoDataFor')}: ${urlIndex}[${type}]`,
        type: 'error',
      });
      return;
    }

    const { accept, url } = urlRef;

    if (accept && url) {
      accept.forEach((item: requestType) => {
        urlRef[item] = url;
      });
    }

    const urlInfo = (
      typeof urlRef[type] === 'string' ? { url: urlRef[type] } : urlRef[type]
    ) as IMethodDef;

    if (urlInfo) {
      const {
        useLoading = false,
        dispatchResponse = true,
        successDispatch = GlobalActions.RESPONSE_DATA,
        removeEmptyData = false,
        url,
        successMessage = false,
        errorMessage = 'Invalid request',
      } = urlInfo;

      useLoading && dispatch({ type: useLoading, payload: true });
      try {
        // add path vars and remove empty data

        let finalPath = url;
        Object.keys(data).forEach(key => {
          const hasDataPath = finalPath.replace(`:${key}`, data[key]);
          if (hasDataPath !== finalPath || (removeEmptyData && data[key] === '')) delete data[key];
          finalPath = hasDataPath;
        });

        console.log(finalPath, data, type);
        // call servive, return data or generate error...
        const payload = await GlobalService.request({
          url: finalPath,
          data,
          type,
        });

        dispatchResponse && successDispatch && dispatch({ type: successDispatch, payload });
        successMessage &&
          dialog.toast({
            message: t(successMessage),
            type: 'success',
          });
        //
        cb && cb(payload);
      } catch (e) {
        // INFO: error generate from -> GlobalService.request
        const { message } = e;

        if (e.status === 506)
          dispatch({ type: SessionActions.DISCONNECT, payload: { expired: true } });
        errorMessage &&
          dialog.toast({
            message: message || errorMessage,
            type: 'error',
          });

        ////console.log(e);
        cb && cb(e);
      } finally {
        useLoading && dispatch({ type: useLoading, payload: false });
      }
    } else {
      // no existe informacion de tipo de request
    }

    /*
  try {
    dispatch({ type: SessionActions.LOADING });
    const loginResult = await AuthService.login(loginData);
    dispatch({ type: SessionActions.LOGIN_SUCCESS, payload: loginResult });
    callback && callback();
  } catch (e) {
    dispatch({ type: SessionActions.LOGIN_FAILURE });
    dispatch(showError('errorLogin'));
  }*/
  };

export const disconnectAction = () => async (dispatch: Dispatch) => {
  dispatch({ type: SessionActions.DISCONNECT, payload: {} });
};
