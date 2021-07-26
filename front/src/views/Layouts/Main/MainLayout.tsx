import React, { useEffect, useState } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import _routes from '../../../config/routesAndViews';
import { t } from '../../../config/i18n';
import './MainLayout.scss';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { callUrlServiceAction } from '../../../bin/redux_session/actions';
import { getUser } from '../../../bin/redux_session/selectors';
import { RootState } from 'ReduxTypes';
import { ReactComponent as KentikLogo } from '../../../../src/assets/img/kentik.svg';
import classNames from 'classnames';
import { Tabs } from '../../../components/Containers';
import routes from '../../../config/routesAndViews';
import { ProviderNetwork, InternetIndex, Dashboard, ProviderReportPage } from '../..';

import { IGenericObject } from '../../../config/interfaces';

import { StorageHelper } from '../../../utils/StorageHelper';
import { buildPathWithParams } from '../../../utils/Helpers';
import { BiPulse } from 'react-icons/bi';

interface IMainLayoutProps {
  callUrlService: typeof callUrlServiceAction;
  user: any;
}

const MainLayout = (props: IMainLayoutProps) => {
  const { callUrlService, user } = props;

  const match = useRouteMatch<IGenericObject>();

  const storage = new StorageHelper();

  const {
    params: { id_asn },
  } = match;

  useEffect(() => {
    id_asn && setCurrentAsn(id_asn);
  }, [id_asn]);

  const [currentAsn, setCurrentAsn] = useState<any>(storage.get('asn_name'));

  let history = useHistory();

  const disconectAll = () => {
    const { dialog } = window;

    dialog.modal({
      type: 'confirmation',
      title: t('titleLogout'),
      children: t('textAreYouSure'),
      buttons: [
        {
          text: t('buttonYesLogoutNow'),
          handleClick: async () => {
            await callUrlService('disconnect', {}, 'post');
            const {
              LOGIN: { path },
            } = _routes;
            history.push(path);
            return true; // hide modal
          },
        },
      ],
    });
  };

  const tabIndexRoutes: any = [[routes.DASHBOARD], [routes.INTERNET_INDEX], [routes.PROVIDER]];
  const [activeTab, setActiveTab] = useState(0);

  /**/
  useEffect(() => {
    const { path } = match;
    let active = 0;

    tabIndexRoutes.forEach((arr: any, i: number) => {
      arr.forEach((_routes: any) => {
        if (_routes.path === path) {
          active = i;
        }
      });
    });

    setActiveTab(active);
  }, [match]);

  const handleClickOnTab = (i: number) => {
    const {
      params: { country_code = 'global', find_by = 'markets' },
    } = match;

    const route = buildPathWithParams(tabIndexRoutes[i][0].path, {
      ...tabIndexRoutes[i][0].defaultState,
      id_asn: currentAsn,
      country_code,
      find_by,
    });
    history.push(route);
  };

  const handleAsn = (asn_name: string) => {
    setCurrentAsn(asn_name);
    storage.add('asn_name', asn_name);
  };

  return (
    <div className={classNames('main-layout')}>
      <div className="main-layout-section layout-section-content">
        <div className="section-header">
          <div className="header-top">
            <div className="logo-content text-center">
              <div className="logo-image">
                <KentikLogo />
              </div>
            </div>
            <div className="text-right">
              <div className="saludation">
                {t('textSaludation')}&nbsp;
                <b>{user.name}</b>
              </div>
              <button className="btn btn-link" onClick={disconectAll}>
                {t('textDisconnect')}
              </button>
            </div>
          </div>
          <div className="core">
            <BiPulse color="#E05420" size="18" /> &nbsp;
            <b>CORE</b> &gt; <span>Transit Advisor</span>
          </div>
        </div>
        <Tabs name="tabmenu" activeIndex={activeTab} onClickTabItem={handleClickOnTab}>
          <Tabs.Tab title="Dashboard">
            <Dashboard onAsnClick={handleAsn} />
          </Tabs.Tab>
          <Tabs.Tab title="Internet index">
            <InternetIndex />
          </Tabs.Tab>
          <Tabs.Tab title="Provider Network" disabled={!currentAsn}>
            <ProviderNetwork id_asn={currentAsn} />
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    user: getUser(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      callUrlService: callUrlServiceAction,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
