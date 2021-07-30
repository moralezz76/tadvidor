import React, { useState } from 'react';
import { CardContainer, TableList } from '../../../../../components/Containers';
import { RootState } from 'ReduxTypes';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { callUrlServiceAction } from '../../../../../bin/redux_session/actions';
import { IoMdHeartDislike } from 'react-icons/io';
import { t } from '../../../../../config/i18n';
import { useEffect } from 'react';
import { Icon } from '../../../../../components/Common';

const ZFavorites = (props: any) => {
  const { callUrlService, onRowClick, asnfav, render = (v: any) => v } = props;

  const [asnFav, setAsnfav] = useState([]);

  useEffect(() => {
    setAsnfav(asnfav);
  }, [asnfav]);

  const handleRemoveFavClick = (e: any, [asnfav]: any) => {
    e.stopPropagation();
    callUrlService('asn_data', { asnfav }, 'delete', ({ data: { asnfav = [] } }: any) => {
      setAsnfav(asnfav);
    });
  };

  const addFavOptions = (r: any) => {
    return r.reduce((ret: [], i: any) => {
      return [
        ...ret,
        [
          ...i,
          <Icon
            type="trash"
            onClick={(e: any) => handleRemoveFavClick(e, i)}
            title={t('titleRemoveFav')}
            fontSize="20px"
          />,
        ],
      ];
    }, []);
  };

  return (
    <CardContainer title="Favorites" className="fav-asn">
      <TableList
        onRowClick={onRowClick}
        list={addFavOptions(asnFav.map((i: any, n: number) => [`${n + 1}.`, 'fav', [i[0], i[1]]]))}
        title={`Count: ${asnFav.length}`}
        render={render}
        maxItems={10}
      />
    </CardContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(ZFavorites);
