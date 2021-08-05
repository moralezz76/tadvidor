/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'ReduxTypes';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Redirect, BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';

import './App.css';
import AbilityContext, {
  ability,
  userHavePermissions,
  Permission,
} from './utils/roles/AbilityContext';
import { getUserPermission } from './bin/redux_session/selectors';
import { isLoading } from './bin/redux_global/selectors';
import Loading from './views/Pages/Loading/Loading';
import { bindActionCreators, Dispatch } from 'redux';
import { endLoadingAction } from './bin/redux_global/actions';
import { permissionObject } from './config/permissions';
import routesAndViews from './config/routesAndViews';
import { AccessDeniedPage } from './views';
import Dialog from './components/Dialog/Dialog';
import { StorageHelper } from './utils/StorageHelper';
import { callUrlServiceAction } from './bin/redux_session/actions';
import { buildPathWithParams } from './utils/Helpers';

interface appProps extends WithTranslation {
  permissions: Permission[];
  isLoading: boolean;
  endLoading: typeof endLoadingAction;
  callUrlService: typeof callUrlServiceAction;
}

const App = (props: appProps) => {
  const { isLoading, permissions, endLoading } = props;
  const storage = new StorageHelper();
  const { auth_user } = permissionObject;

  const [userLogued, setUserLogued] = useState(false);

  useEffect(() => {
    ability.update(permissions);
    setUserLogued(userHavePermissions(auth_user));
  }, [permissions]);

  useEffect(() => {
    endLoading();
  }, [endLoading]);

  const {
    LOGIN: { path: loginPath },
    HOME: { path: homePath },
  } = routesAndViews;
  return (
    <AbilityContext.Provider value={ability}>
      <Dialog />
      <BrowserRouter>
        {isLoading ? (
          <Loading />
        ) : (
          <Switch>
            {Object.keys(routesAndViews).map((routeName, i) => {
              const { permission: userPermission, path, view: View } = routesAndViews[routeName];
              return (
                <Route
                  exact
                  key={`route_${i}`}
                  path={path}
                  render={() => {
                    if (userLogued && (path === loginPath || path === homePath)) {
                      const appStartPath = routesAndViews.INTERNET_INDEX;
                      const { path, defaultState } = appStartPath;
                      const pathname = buildPathWithParams(path, defaultState);
                      return (
                        <Redirect
                          to={{
                            pathname,
                            state: { denied: true },
                          }}
                        />
                      );
                    }
                    if (userPermission && userHavePermissions(userPermission)) {
                      userLogued && storage.add('lastPath', path);
                      return View && <View />;
                    } else {
                      if (path !== loginPath) {
                        return (
                          <Redirect
                            to={{
                              pathname: loginPath,
                              state: { denied: true },
                            }}
                          />
                        );
                      }
                    }
                  }}
                ></Route>
              );
            })}
            <Route component={AccessDeniedPage} />
          </Switch>
        )}
      </BrowserRouter>
    </AbilityContext.Provider>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    permissions: getUserPermission(state),
    isLoading: isLoading(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      endLoading: endLoadingAction,
      callUrlService: callUrlServiceAction,
    },
    dispatch
  );

const appTranslated = withTranslation()(App);

export default connect(mapStateToProps, mapDispatchToProps)(appTranslated);
