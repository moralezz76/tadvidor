import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'ReduxTypes';
import { CardContainer, MenuList, ZoneView } from '../../../../components/Containers';
import Loading from '../../Loading/Loading';
import { bindActionCreators, Dispatch } from 'redux';
import { callUrlServiceAction } from '../../../../bin/redux_session/actions';
import { tabsMenu } from '../TabsHelpers';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { buildPathWithParams, CountryZones } from '../../../../utils/Helpers';
import ZProfile from './Zones/ZProfile';
import ZAsCustomer from './Zones/ZAsCustomer';
import { t } from '../../../../config/i18n';
import routes from '../../../../config/routesAndViews';
import './ProviderNetworkPage.scss';
import { fakeProfileData } from '../../../../utils/fakedata';

const ProviderNetworkPage = (props: any) => {
  let match = useRouteMatch<any>();
  let history = useHistory();

  const { id_asn, callUrlService } = props;
  const [waiting, setAwaiting] = useState(true);
  const [IPv4AsCustomers, SetIPv4AsCustomers] = useState<any>([]);

  const [menu, setMenu] = useState<any>('');
  const [id_country, setIdCountry] = useState<any>('');
  const [profileData, setData] = useState<any>({});

  useEffect(() => {
    const {
      params: { menu, id_country },
    } = match;
    setMenu(menu);
    setIdCountry(id_country);
  }, [match]);

  useEffect(() => {
    setAwaiting(true);
    if (id_asn && menu && id_country)
      callUrlService('asn_info', { id_asn, menu, id_country }, 'get', ({ data }: any) => {
        if (data) {
          const { profileData, IPv4AsCustomers } = data;
          profileData && setData(profileData);
          IPv4AsCustomers && SetIPv4AsCustomers(IPv4AsCustomers);
          setAwaiting(false);
        }
        setData(fakeProfileData);
      });
  }, [menu, id_country, id_asn, callUrlService]); //***

  const handleMenuClick = (menu: string) => {
    const {
      path,
      params: { id_country },
    } = match;
    const pathname = buildPathWithParams(path, { menu, id_asn, id_country });
    history.push(pathname);
  };

  const onRowClick = (item: any) => {
    const [, , [id_asn]] = item;

    const to = buildPathWithParams(routes.PROVIDER.path, {
      ...routes.PROVIDER.defaultState,
      id_asn: `AS${id_asn}`,
      id_country,
      menu: 'as_customers',
    });
    history.push(to);
  };

  const handleMarketsClick = (id_country: string) => {
    const { path, params } = match;
    const { id_asn, menu } = params;
    const pathname = buildPathWithParams(path, { id_asn, menu, id_country });
    history.push(pathname);
  };

  const { providerMenu } = tabsMenu;

  return (
    <>
      {waiting && <Loading />}
      <div className="provider-network">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-3">
              <CardContainer>
                <MenuList
                  list={providerMenu}
                  onClick={handleMenuClick}
                  selected={menu}
                  expanded={['Customers']}
                  asBlue={true}
                />
              </CardContainer>
            </div>
            <div className="col-md-6">
              <ZoneView active={menu}>
                <ZProfile
                  onRowClick={onRowClick}
                  profileData={profileData}
                  id_asn={id_asn}
                  id="profile"
                />
                <ZAsCustomer
                  profileData={profileData}
                  IPv4AsCustomers={IPv4AsCustomers}
                  id_asn={id_asn}
                  country={id_country}
                  id="as_customers"
                />
              </ZoneView>
            </div>
            <div className="col-md-3">
              <div className="alert alert-primary" role="alert">
                {t('textProviderReport')} <b>{id_country}</b>
              </div>
              <CardContainer title={t('titleViewByMarkets')}>
                <MenuList
                  list={CountryZones}
                  onClick={handleMarketsClick}
                  asBlue={true}
                  useTrans={false}
                  selected={id_country.toUpperCase()}
                  expanded={['Global']}
                  findText={t('textFindByCountry')}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProviderNetworkPage);
