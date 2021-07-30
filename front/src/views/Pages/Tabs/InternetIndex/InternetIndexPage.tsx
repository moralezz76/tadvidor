import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'ReduxTypes';
import { CardContainer, MenuList, ZoneView, BlockList } from '../../../../components/Containers';
import { FaLongArrowAltUp, FaLongArrowAltDown } from 'react-icons/fa';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import Loading from '../../Loading/Loading';
import './InternetIndexPage.scss';
import { bindActionCreators, Dispatch } from 'redux';
import { callUrlServiceAction } from '../../../../bin/redux_session/actions';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { buildPathWithParams, CountryZones } from '../../../../utils/Helpers';
import { t } from '../../../../config/i18n';
import { Asn, FilterInfo, Icon, PercentLine } from '../../../../components/Common';
import routes from '../../../../config/routesAndViews';
import classNames from 'classnames';

const InternetIndexPage = (props: any) => {
  let match = useRouteMatch<any>();
  let history = useHistory();

  const { id_asn, callUrlService } = props;
  const [waiting, setAwaiting] = useState(true);

  const {
    params: { menu },
  } = match;

  const [viewByRankings, setViewByRankings] = useState<any>({});
  const [blocks, setBlocks] = useState<any>([]);
  const [marketToggled, setMarketToggled] = useState('');

  const {
    params: { country_code = 'global' },
  } = match;

  useEffect(() => {
    const {
      params: { country_code = 'global', find_by = 'markets' },
    } = match;

    setAwaiting(true);
    callUrlService('internet_index', { find_by, country_code }, 'get', ({ data }: any) => {
      if (!data) return;
      const { menu_rankings, blocks } = data;

      setViewByRankings(menu_rankings);
      setBlocks(blocks);
      setAwaiting(false);
    });
  }, [match]);

  const handleMenuClick = (country_code: any, find_by: any) => {
    const { path, defaultState } = routes.INTERNET_INDEX;
    const pathname = buildPathWithParams(path, {
      find_by,
      country_code,
      ...defaultState,
    });
    history.push(pathname);
  };

  const onMarketToggle = () => {
    setMarketToggled(marketToggled === '' ? 'expanded' : '');
  };

  const onPageClick = (e: any) => {
    let { target } = e;
    do {
      const { className = '' } = target;
      if (className.indexOf('toggled') !== -1) return false;
      target = target.parentNode;
    } while (target);
    setMarketToggled('');
  };
  return (
    <>
      {waiting && <Loading />}
      <div className="internet-index" onClick={onPageClick}>
        <div className="col-md-12">
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <ZoneView active="data">
                <CardContainer id="data" className="block-container">
                  <FilterInfo country_code={country_code}>
                    <div className="filter-extra d-xl-none d-lg-none ">
                      <button className="btn btn-primary toggled" onClick={onMarketToggle}>
                        <Icon type="search" /> &nbsp;Filters Market...
                      </button>
                    </div>
                  </FilterInfo>
                  <BlockList data={blocks} className="col-6" />
                </CardContainer>
              </ZoneView>
            </div>
            <div className={classNames(marketToggled, 'col-lg-3 menu-zone float-at-right')}>
              <div className="toggled">
                <div className="text-right d-xl-none d-lg-none">
                  <button
                    className="btn btn-primary toggled "
                    onClick={onMarketToggle}
                    style={{ marginBottom: 8 }}
                  >
                    Hide Filters... <Icon type="hideR" />
                  </button>
                </div>
                <div className="alert alert-primary" role="alert">
                  {t('textProviderReport')} <b>{country_code}</b>
                </div>
                <CardContainer title={t('titleViewByMarkets')}>
                  <MenuList
                    list={CountryZones}
                    onClick={(x: any) => handleMenuClick(x, 'markets')}
                    asBlue={true}
                    useTrans={false}
                    selected={country_code.toUpperCase()}
                    expanded={['Global']}
                  />
                </CardContainer>
                <CardContainer title={t('titleViewByRankings')}>
                  <MenuList
                    list={viewByRankings}
                    onClick={(x: any) => handleMenuClick(x, 'rankings')}
                    asBlue={true}
                    expanded={['AllRankings']}
                  />
                </CardContainer>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(InternetIndexPage);
