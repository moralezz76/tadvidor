/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { FormFields } from '../../../../components/Formik';
import { t } from '../../../../config/i18n';
import { permissionObject } from '../../../../config/permissions';
import './RecoverPage.scss';
import { userHavePermissions } from '../../../../utils/roles/AbilityContext';
import { CardContainer } from '../../../../components/Containers/';
import { callUrlServiceAction } from '../../../../bin/redux_session/actions';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from 'ReduxTypes';
import { connect } from 'react-redux';

interface IRecoverPageProps {
  callUrlService: typeof callUrlServiceAction;
}
interface IRecoverPageMatch {
  id: string;
  token: string;
}

const RecoverPage = (props: IRecoverPageProps) => {
  const match = useRouteMatch<IRecoverPageMatch>();

  const { callUrlService } = props;
  const {
    params: { id, token },
  } = match;

  const { auth_user } = permissionObject;

  const [expired, setExpired] = useState(false);

  const userLoged = userHavePermissions(auth_user);

  useEffect(() => {
    callUrlService('recover', { urlToken: token }, 'get', ({ status }) => {
      if (status !== 200) setExpired(true);
    });
  }, []);

  return (
    <div className="recover-page">
      <div className="row justify-content-center align-items-center">
        <CardContainer isCard>
          <div className="recover-page-container">
            {userLoged || expired ? (
              <div>
                <h2>{t('textRecoverPasswordFailed')}</h2>
                <div className="text-motiv">{t('textRecoverPasswordFailedMotiv')}</div>
                <ul>
                  <li>{t('textTokenExpired')}</li>
                </ul>
              </div>
            ) : (
              <>
                <h2>{t('textRecoverPass')}</h2>
                <FormFields
                  fields={{
                    email: {
                      type: 'email',
                      required: true,
                    },
                    password: {
                      key: 'newPassword',
                      required: true,
                      type: 'password',
                      toggleIcon: true,
                    },
                    password_confirmation: {
                      required: true,
                      key: 'repeatPassword',
                      hint: 'repeat your password',
                      type: 'password',
                      toggleIcon: true,
                    },
                    recaptcha: {
                      type: 'recaptcha',
                    },
                  }}
                  endpoint="recover"
                  params={{ urlToken: token, token, id }}
                  submitText={t('buttonRecoverNow')}
                />
              </>
            )}
          </div>
        </CardContainer>
      </div>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecoverPage);
