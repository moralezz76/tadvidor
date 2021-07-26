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
import { buildPathWithParams } from '../../../../utils/Helpers';
import { t } from '../../../../config/i18n';
import { PercentLine } from '../../../../components/Common';
import routes from '../../../../config/routesAndViews';

const InternetIndexPage = (props: any) => {
  let match = useRouteMatch<any>();
  let history = useHistory();

  const { id_asn, callUrlService } = props;
  const [waiting, setAwaiting] = useState(true);

  const {
    params: { menu },
  } = match;

  const [viewByMarkets, setViewByMarkets] = useState<any>({});
  const [viewByRankings, setViewByRankings] = useState<any>({});
  const [blocks, setBlocks] = useState<any>({});

  const {
    params: { country_code = 'global' },
  } = match;

  useEffect(() => {
    const {
      params: { country_code = 'global', find_by = 'markets' },
    } = match;
    callUrlService('internet_index', { find_by, country_code }, 'get', ({ data }: any) => {
      if (!data) return;
      const { menu_markets, menu_rankings, blocks } = data;
      setViewByMarkets(menu_markets);
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

  const render: any = [
    (v: any) => <b>{v}</b>,
    (v: any) => {
      if (v == 0) return '';
      if (v > 0)
        return (
          <>
            <FaLongArrowAltUp color="green" />
            <b>{v}</b>
          </>
        );
      return (
        <>
          <FaLongArrowAltDown color="red" />
          <b>{-v}</b>
        </>
      );
    },
    (v: any) => {
      if (v !== 0) return <AiFillStar className="yelow-star" />;
      return <AiOutlineStar />;
    },
    null,
    (v: any) => {
      return <div className="as-box">{v}</div>;
    },
    (v: any) => <PercentLine percent={v} />,
  ];

  return (
    <>
      {waiting && <Loading />}
      <div className="internet-index">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-9">
              <ZoneView active="data">
                <CardContainer
                  title={t('titleGlobalIPV4')}
                  id="data"
                  className="form block-container"
                >
                  <BlockList data={blocks} render={render} className="col-6" />
                </CardContainer>
              </ZoneView>
            </div>
            <div className="col-md-3 menu-zone">
              <div className="alert alert-primary" role="alert">
                {t('textProviderReport')} <b>{country_code}</b>
              </div>
              <CardContainer title={t('titleViewByMarkets')} className="form">
                <MenuList
                  list={viewByMarkets}
                  onClick={(x: any) => handleMenuClick(x, 'markets')}
                  asBlue={true}
                  useTrans={false}
                  selected={country_code.toUpperCase()}
                  expanded={['Global']}
                />
              </CardContainer>
              <CardContainer title={t('titleViewByRankings')} className="form">
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
