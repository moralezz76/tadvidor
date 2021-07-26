import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import i18n, { locale } from './config/i18n';
import Loading from './views/Pages/Loading/Loading';
import { IntlProvider } from 'react-intl';
import ReactDOM from 'react-dom';
import store from './bin/store';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import './styles/index.scss';
import { SessionActions } from './bin/redux_session/types';
import { GlobalActions } from './bin/redux_global/types';

store.dispatch({ type: GlobalActions.LOADING, payload: true });
store.dispatch({ type: SessionActions.AUTH_CHECK });

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <IntlProvider locale={locale}>
      <Provider store={store}>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </Provider>
    </IntlProvider>
  </I18nextProvider>,
  document.getElementById('root')
);

//reportWebVitals();
