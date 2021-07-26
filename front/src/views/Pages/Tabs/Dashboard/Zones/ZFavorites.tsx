import React, { useState } from 'react';
import { CardContainer, TableList } from '../../../../../components/Containers';
import { RootState } from 'ReduxTypes';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { callUrlServiceAction } from '../../../../../bin/redux_session/actions';
import { IoMdHeartDislike } from 'react-icons/io';
import { t } from '../../../../../config/i18n';

const ZFavorites = (props: any) => {
  const { callUrlService, onRowClick, asnfav } = props;
  const [asnFav, setAsnfav] = useState(asnfav);

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
          <IoMdHeartDislike
            onClick={(e: any) => handleRemoveFavClick(e, i)}
            title={t('titleRemoveFav')}
            color="#EE5050"
          />,
        ],
      ];
    }, []);
  };

  return (
    <CardContainer title="Favorites" className="fav-asn form" id="favorites">
      <TableList
        onRowClick={onRowClick}
        className="viewer"
        list={addFavOptions(asnFav)}
        title="Count"
        value={asnFav.length}
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
