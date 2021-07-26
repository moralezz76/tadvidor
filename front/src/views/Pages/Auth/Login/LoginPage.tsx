import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';

import { FormFields } from '../../../../components/Formik';
import { t } from '../../../../config/i18n';
import { IRequestResult } from '../../../../config/interfaces';
import { ReactComponent as KentikLogo } from '../../../../../src/assets/img/kentik.svg';
import './LoginPage.scss';

interface ILoginProps extends RouteComponentProps {}

const LoginPage = (props: ILoginProps) => {
  const { dialog } = window;
  const [loginError, setLoginError] = useState(0);

  const registerUser = () => {
    dialog.modal({
      title: t('textRegisterAccount'),
      maxWidth: 700,
      children: (
        <FormFields
          fields={{
            name: {
              required: true,
            },
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
              sitekey: '6LcOl68bAAAAAOmroe4FOvUJVB7pCVPFHgOhkias',
            },
          }}
          panels={[
            { items: ['name', 'email', 'recaptcha'] },
            { items: ['password', 'password_confirmation'] },
          ]}
          endpoint="register"
          inColumns
        />
      ),

      buttons: [
        {
          text: 'Crear usuario',
          isSubmit: true,
        },
      ],
      onClose: () => {
        //////console.log('cerrando');
      },
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center login-row">
        <div className="login-column">
          <div className="col-md-12 login-box">
            <div className="col-md-12 login-title">
              <div className="logo">
                <KentikLogo />
              </div>
              <span className="logo-text">&#9679; Transit Advisor</span>
            </div>
            <FormFields
              formValues={(values: any) => {
                //console.log(values.country);
              }}
              fields={{
                email: {
                  type: 'email',
                  required: true,
                },
                password: {
                  required: true,
                  type: 'password',
                  toggleIcon: true,
                },
                recaptcha: {
                  type: 'recaptcha',
                  sitekey: '6LcOl68bAAAAAOmroe4FOvUJVB7pCVPFHgOhkias',
                },
              }}
              endFormCode={
                // show this code at end of form (credential incorrect)
                <>
                  {loginError === 401 && (
                    <div className="alert alert-danger text-center" role="alert">
                      {t('textErrorCredentials')}
                    </div>
                  )}
                  {loginError === 500 && (
                    <div className="alert alert-warning text-center" role="alert">
                      {t('textErrorServer')}
                    </div>
                  )}
                </>
              }
              endpoint="login"
              submitText={t('labelStartSession')}
              validateSubmit={(values: any, fn: (v: any) => void) => {
                setLoginError(0); // start request, hide message error before
                fn(values); // validateSubmit require call fn with values to continue
              }}
              requestResult={({ status }: IRequestResult) => {
                setLoginError(status); // show message error
              }}
            />
            {false && (
              <div className="text-center">
                {t('textNoAccount')}{' '}
                <Link to="" onClick={registerUser}>
                  {t('textRegister')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const routerLogin = withRouter(LoginPage);
export default routerLogin;
