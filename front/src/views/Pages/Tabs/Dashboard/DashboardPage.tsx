import React, { useState, useEffect } from 'react';
import { callUrlServiceAction } from '../../../../bin/redux_session/actions';
import { CardContainer, MenuList, ZoneView } from '../../../../components/Containers';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Loading from '../../Loading/Loading';
import './DashboardPage.scss';
import { RootState } from 'ReduxTypes';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { t } from '../../../../config/i18n';
import routes from '../../../../config/routesAndViews';
import { buildPathWithParams } from '../../../../utils/Helpers';
import ZSearch from './Zones/ZSearch';
import ZFavorites from './Zones/ZFavorites';
import { tabsMenu } from '../TabsHelpers';

const Dashboard = (props: any) => {
  const { callUrlService, onAsnClick = () => {} } = props;
  let history = useHistory();
  let match = useRouteMatch<any>();

  const {
    params: { menu },
  } = match;

  const [waiting, setAwaiting] = useState(true);
  const [asnFav, setAsnfav] = useState([]);

  useEffect(() => {
    //!asnFav.length &&
    callUrlService('asn_data', {}, 'get', ({ data }: any) => {
      if (data) {
        const { asnfav = [] } = data;
        setAsnfav(asnfav);
        setAwaiting(false);
      }
    });
  }, []);

  const handleMenuClick = (menu: string) => {
    const { path } = match;
    const pathname = buildPathWithParams(path, { menu });
    history.push(pathname);
  };

  const menuTitles = {
    Favorites: (
      <>
        {t('menuFavorites')} &nbsp;
        <b>({asnFav.length || 0})</b>
      </>
    ),
  };

  const handleRowClick = ([id_asn]: any) => {
    const to = buildPathWithParams(routes.PROVIDER.path, {
      ...routes.PROVIDER.defaultState,
      id_asn,
    });
    history.push(to);
    onAsnClick(id_asn);
  };

  const { dashboardMenu } = tabsMenu;

  return (
    <>
      {waiting && <Loading />}
      <div className="dashboard">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-3">
              <CardContainer className="form">
                <MenuList
                  list={dashboardMenu}
                  onClick={handleMenuClick}
                  selected={menu}
                  menuTitles={menuTitles}
                  expanded={['ProviderNetwork']}
                />
              </CardContainer>
            </div>
            <div className="col-md-5">
              <ZoneView active={menu}>
                <ZSearch onRowClick={handleRowClick} asnfav={asnFav} id="search" />
                <ZFavorites onRowClick={handleRowClick} asnfav={asnFav} id="favorites" />
              </ZoneView>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      callUrlService: callUrlServiceAction,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
