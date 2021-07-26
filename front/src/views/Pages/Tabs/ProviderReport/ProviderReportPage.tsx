import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'ReduxTypes';
import { CardContainer, MenuList, ZoneView } from '../../../../components/Containers';

import Loading from '../../Loading/Loading';
import './ProviderReportPage.scss';
import { bindActionCreators, Dispatch } from 'redux';
import { callUrlServiceAction } from '../../../../bin/redux_session/actions';
import { tabsMenu } from '../TabsHelpers';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { buildPathWithParams } from '../../../../utils/Helpers';
import ZAsCustomer from './Zones/ZAsCustomer';
import { t } from '../../../../config/i18n';

const ProviderReportPage = (props: any) => {
  const { id_asn, callUrlService } = props;

  let match = useRouteMatch<any>();
  let history = useHistory();

  const [waiting, setAwaiting] = useState(true);

  const {
    params: { menu, id_country = 'global' },
  } = match;

  const [IPv4AsCustomers, SetIPv4AsCustomers] = useState<any>({});
  const [viewByMarkets, setViewByMarkets] = useState<any>({});

  useEffect(() => {
    callUrlService('asn_report', { id_asn, id_country }, 'get', ({ data }: any) => {
      const { menu_markets, IPv4AsCustomers } = data;
      //setData(IPv4AsCustomers);
      setViewByMarkets(menu_markets);
      setAwaiting(false);
    });
  }, []);

  const handleMenuClick = (menu: string) => {
    const { path, params } = match;
    const { id_asn, id_country } = params;
    const pathname = buildPathWithParams(path, { id_asn, menu, id_country });
    history.push(pathname);
  };

  const handleMarketsClick = (id_country: string) => {
    const { path, params } = match;
    const { id_asn, menu } = params;
    const pathname = buildPathWithParams(path, { id_asn, menu, id_country });
    history.push(pathname);
  };

  const { providerReport } = tabsMenu;

  return (
    <>
      {waiting && <Loading />}
      <div className="provider-report">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-3">
              <CardContainer className="form">
                <MenuList
                  list={providerReport}
                  onClick={handleMenuClick}
                  selected={menu}
                  expanded={['Profile', 'Customers']}
                />
              </CardContainer>
            </div>
            <div className="col-md-5"></div>
            <div className="col-md-4">
              <CardContainer title={t('titleViewByMarkets')} className="form">
                <MenuList
                  list={viewByMarkets}
                  onClick={handleMarketsClick}
                  asBlue={true}
                  useTrans={false}
                  selected={id_country.toUpperCase()}
                  expanded={['Global']}
                  findTextBox={true}
                />
              </CardContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProviderReportPage);
