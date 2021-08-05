import classNames from 'classnames';
import _ from 'lodash';
import React from 'react';
import { Icon } from '../../../Common';
import { t } from '../../../../config/i18n';
import { FormFields } from '../../../Formik';

import './MenuLinerCommon.scss';

const MenuLinerCommon = (props: any) => {
  const { type = 'radio', className, margin = 24, level = 0 } = props;
  return (
    <div className="item-padding menu-liner">
      {_.range(level).map((l: number) => (
        <div className={`level level-${l}`} style={{ minWidth: margin }} />
      ))}
      <div
        style={{ minWidth: margin + 1, maxWidth: margin + 1 }}
        className={classNames('level-main', className)}
      >
        <Icon className="icon" type={type} />
        <div className="menu-bock1" />
        <div className="menu-bock2" />
      </div>
    </div>
  );
};

export default MenuLinerCommon;
