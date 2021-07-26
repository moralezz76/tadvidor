import React from 'react';
import { BaseField } from '../';
import classNames from 'classnames';
import ReCAPTCHA from 'react-google-recaptcha';
import { IGenericObject } from '../../../config/interfaces';
import './Recaptcha.scss';
import { IsDev } from '../../../utils/Helpers';

const Recaptcha = (props: any) => {
  const {
    field: { name },
    form: { setFieldValue, setFieldTouched, touched, isSubmitting },
    sitekey,
  } = props;

  const _sitekey: string = !sitekey || IsDev ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : sitekey;

  //alert(sitekey + ' ' + _sitekey);

  !touched[name] && isSubmitting && setFieldTouched(name);
  return (
    <BaseField {...props}>
      {({ classes }: IGenericObject) => {
        const isInvalid = classes.split(' ').includes('is-invalid');
        return (
          <div className={classNames({ 'is-invalid': isInvalid }, 'recaptcha-control')}>
            <ReCAPTCHA
              sitekey={_sitekey}
              onChange={v => {
                setFieldValue(name, v || '');
              }}
            />
          </div>
        );
      }}
    </BaseField>
  );
};

export default Recaptcha;
