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
import { ProviderNetwork, InternetIndex, Dashboard } from '../..';

import { IGenericObject } from '../../../config/interfaces';

import { StorageHelper } from '../../../utils/StorageHelper';
import { buildPathWithParams } from '../../../utils/Helpers';
import { BiPulse } from 'react-icons/bi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { BiPlanet } from 'react-icons/bi';
import { GrAction } from 'react-icons/gr';
import { Icon } from '../../../components/Common';

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

  const tabIndexRoutes: any = [[routes.INTERNET_INDEX], [routes.PROVIDER], [routes.DASHBOARD]];
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
            <div style={{ fontSize: 10 }}>SERVICE PROVIDER</div>
            <h2>
              <b>Transit Advisor</b>
            </h2>
          </div>
        </div>
        <div className="section-body">
          <Tabs name="tabmenu" activeIndex={activeTab} onClickTabItem={handleClickOnTab}>
            <Tabs.Tab title="Internet Index" icon="graph">
              <InternetIndex />
            </Tabs.Tab>
            <Tabs.Tab title="Provider Network" icon="provider" disabled={!currentAsn}>
              <ProviderNetwork id_asn={currentAsn} />
            </Tabs.Tab>
            <Tabs.Tab title="Search..." icon="search" className="at-right">
              <Dashboard onAsnClick={handleAsn} />
            </Tabs.Tab>
          </Tabs>
        </div>
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
