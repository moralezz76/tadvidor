import React from 'react';
import { Icon } from '..';
import { t } from '../../../config/i18n';
import { FormFields } from '../../Formik';

import './UpDownArrowCommon.scss';

const UpDownArrowCommon = (props: any) => {
  const { value = 0 } = props;
  const type = value > 0 ? 'arrowup' : value < 0 ? 'arrowdown' : '';
  const sign = value > 0 ? '+' : '';
  return (
    <div className="up-down">
      {type !== '' && (
        <div className={type.toLocaleLowerCase()}>
          <Icon type={type} />
          {sign}
          {value}
        </div>
      )}
    </div>
  );
};

export default UpDownArrowCommon;
