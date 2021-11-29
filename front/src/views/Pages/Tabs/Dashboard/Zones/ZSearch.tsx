import React, { useEffect, useState } from 'react';
import { CardContainer, TableList } from '../../../../../components/Containers';
import { FormFields } from '../../../../../components/Formik';
import { RootState } from 'ReduxTypes';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { callUrlServiceAction } from '../../../../../bin/redux_session/actions';
import { t } from '../../../../../config/i18n';
import { Icon } from '../../../../../components/Common';

const ZSearch = (props: any) => {
  const { callUrlService, onRowClick, asnfav = [], render = (v: any) => v } = props;
  const [findText, setFindText] = useState('');
  const [result, setResult] = useState([]);
  const [asnFav, setAsnfav] = useState([]);

  useEffect(() => {
    setAsnfav(asnfav);
  }, [asnfav]);

  const handleFavClick = (e: any, id: string) => {
    e.stopPropagation();
    callUrlService('asn_data', { id }, 'post', ({ data: { asnfav = [] } }: any) => {
      setAsnfav(asnfav);
    });
  };

  const asnOptions = (r: any) => {
    return r.reduce((ret: [], i: string[], n: number) => {
      const findFav = asnFav.reduce((r: boolean, arr: any) => {
        const [fav] = arr;
        console.log(fav, i[0]);
        return r || fav === i[0];
      }, false);

      console.log(findFav);
      return [
        ...ret,
        [
          <b>{n + 1}.</b>,
          findFav ? 'fav' : 'heartL',
          [i[0], i[1]],
          !findFav && (
            <Icon
              type="heartA"
              onClick={(e: any) => handleFavClick(e, i[0])}
              title={t('titleAddFav')}
              size="20px"
            />
          ),
        ],
      ];
    }, []);
  };

  return (
    <CardContainer title="Find ASN">
      <div className="result-find">
        <FormFields
          formValues={async v => {
            const { asnName } = v;
            if (asnName && asnName !== findText) {
              setFindText(asnName);
              // cancel before request
              //const { cancelRequest } = window;
              //cancelRequest && cancelRequest();

              await callUrlService(
                'asn_names',
                { asnName },
                'get',
                ({ data: { asnList } }: any) => {
                  asnList && setResult(asnList);
                }
              );
            } else if (!asnName && findText) {
              setFindText('');
              setResult([]);
            }
          }}
          fields={{
            asnName: {},
          }}
        />
      </div>
      <div className="result-div">
        <TableList
          onRowClick={onRowClick}
          className="result"
          title="Result"
          list={asnOptions(result)}
          render={render}
          emptyText={t('textNoResults')}
          maxItems={10}
        />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ZSearch);
