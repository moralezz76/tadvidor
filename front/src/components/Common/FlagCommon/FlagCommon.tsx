import classNames from 'classnames';
import React from 'react';
import { Icon } from '..';
import { countryCodePath } from '../../../utils/Helpers';
import './FlagCommon.scss';

const FlagCommon = (props: any) => {
  const { countryCode } = props;

  const country_code_path = countryCodePath(countryCode);

  return (
    <div className="flag-common">
      <img src={`/svg/countries/${countryCode}.svg`} alt="Country"></img>
      <Icon className="icon-safe" type="safe" />
      <div className="country-info">
        {country_code_path.map((i: string, n: number) => {
          const separ = n < country_code_path.length - 2 ? <Icon type="caret" /> : null;
          const cn = n === country_code_path.length - 1 ? 'last' : 'zone';
          return (
            <div className={classNames(cn, 'codepath')}>
              {i} {separ}&nbsp;
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlagCommon;
