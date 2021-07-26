import React, { useState } from 'react';
import { CardContainer, TableList } from '../../../../../components/Containers';
import { FormFields } from '../../../../../components/Formik';
import { RootState } from 'ReduxTypes';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { callUrlServiceAction } from '../../../../../bin/redux_session/actions';
import { RiHeartAddLine } from 'react-icons/ri';
import { t } from '../../../../../config/i18n';
import axios from 'axios';

const ZSearch = (props: any) => {
  const { callUrlService, onRowClick, asnfav } = props;
  const [findText, setFindText] = useState('');
  const [result, setResult] = useState([]);
  const [asnFav, setAsnfav] = useState(asnfav);

  const handleFavClick = (e: any, id: string) => {
    e.stopPropagation();
    callUrlService('asn_data', { id }, 'post', ({ data: { asnfav = [] } }: any) => {
      setAsnfav(asnfav);
    });
  };

  const asnOptions = (r: any) => {
    return r.reduce((ret: [], i: string) => {
      const findFav = asnFav.reduce((r: boolean, asn: string[]) => {
        return r || i === asn[0];
      }, false);

      return [
        ...ret,
        [
          i,
          !findFav && (
            <RiHeartAddLine
              onClick={(e: any) => handleFavClick(e, i)}
              title={t('titleAddFav')}
              color="#00FF00"
            />
          ),
        ],
      ];
    }, []);
  };

  return (
    <CardContainer title="Find ASN" className="find-asn form" id="search">
      <FormFields
        formValues={async v => {
          const { asnName } = v;
          if (asnName && asnName !== findText) {
            setFindText(asnName);
            // cancel before request
            const { cancelRequest } = window;
            cancelRequest && cancelRequest();

            await callUrlService('asn_names', { asnName }, 'get', ({ data }: any) => {
              data && setResult(data);
            });
          } else if (!asnName && findText) {
            setFindText('');
            setResult([]);
          }
        }}
        fields={{
          asnName: {},
        }}
      />
      <div className="result-div">
        <TableList
          onRowClick={onRowClick}
          className="result"
          title="Result"
          list={asnOptions(result)}
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
