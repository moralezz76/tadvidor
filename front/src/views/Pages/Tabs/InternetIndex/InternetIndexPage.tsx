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

  const [viewByRankings, setViewByRankings] = useState<any>({});
  const [blocks, setBlocks] = useState<any>([]);
  const [marketToggled, setMarketToggled] = useState('');

  const {
    params: { filter_value = 'global', find_by = 'markets' },
  } = match;

  useEffect(() => {
    setAwaiting(true);
    callUrlService('internet_index', { find_by, filter_value }, 'get', ({ data }: any) => {
      if (!data) return;
      const { menu_rankings, blocks } = data;

      setViewByRankings(menu_rankings);
      setBlocks(blocks);
      setAwaiting(false);
    });
  }, [match]);

  const handleMenuClick = (filter_value: any, find_by: any) => {
    const { path, defaultState } = routes.INTERNET_INDEX;
    const pathname = buildPathWithParams(path, {
      ...defaultState,
      find_by,
      filter_value,
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
      if (typeof className === 'string' && className.indexOf('toggled') !== -1) return false;
      target = target.parentNode;
    } while (target);
    setMarketToggled('');
  };

  const blockActions = (v: any) => [
    {
      label: 'action #1',
    },
  ];

  return (
    <>
      {waiting && <Loading />}
      <div className="internet-index" onClick={onPageClick}>
        <div className="col-md-12">
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <ZoneView active="data">
                <CardContainer id="data" className="block-container">
                  <FilterInfo filter_value={filter_value} find_by={find_by}>
                    <div className="filter-extra d-xl-none d-lg-none ">
                      <button className="btn btn-primary toggled" onClick={onMarketToggle}>
                        <Icon type="search" /> &nbsp;Filters Market...
                      </button>
                    </div>
                  </FilterInfo>
                  <BlockList data={blocks} className="col-md-6 col-sm-12" actions={blockActions} />
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
                  {t('textProviderReport')} <b>{filter_value}</b>
                </div>
                <CardContainer title={t('titleViewByMarkets')}>
                  <MenuList
                    list={CountryZones}
                    onClick={(x: any) => handleMenuClick(x, 'markets')}
                    asBlue={true}
                    useTrans={false}
                    selected={filter_value.toUpperCase()}
                    expanded={['Global']}
                    findText={t('textFindByCountry')}
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
