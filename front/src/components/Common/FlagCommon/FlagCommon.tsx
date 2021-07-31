import classNames from 'classnames';
import _ from 'lodash';
import React from 'react';
import { Icon } from '..';
import { t } from '../../../config/i18n';
import { getCodePath } from '../../../utils/Helpers';
import './FlagCommon.scss';

const FlagCommon = (props: any) => {
  const { filterValue, withFlag, source, findBy } = props;

  const codePath = filterValue === 'global' ? ['Global'] : getCodePath(source, filterValue);

  codePath.unshift(`FilterBy${_.upperFirst(findBy)}`);

  return (
    <div className="flag-common">
      {withFlag ? (
        <img src={`/svg/countries/${filterValue}.svg`} alt="Country"></img>
      ) : (
        <>
          <span className="filter-icon">
            <Icon type={filterValue} />
          </span>
        </>
      )}
      {withFlag && <Icon className="icon-safe" type="safe" />}
      <div className="country-info">
        {codePath.map((i: string, n: number) => {
          const separ = n < codePath.length - 2 ? <Icon type="caret" /> : null;
          const cn = n === codePath.length - 1 ? 'last' : 'zone';
          return (
            <div className={classNames(cn, 'codepath')}>
              {t(`text${i}`, i)} {separ}&nbsp;
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlagCommon;
