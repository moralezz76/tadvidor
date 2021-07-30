import React from 'react';
import { Flag, Icon } from '..';
import './FilterInfoCommon.scss';

const FilterInfoCommon = (props: any) => {
  const { children, country_code } = props;
  return (
    <div className="filter-info">
      <div className="filter-main">
        <div>
          <b>MARKET FILTER</b>
        </div>
        <div className="country-info">
          {country_code !== 'global' ? (
            <>
              <Flag countryCode={country_code} />
            </>
          ) : (
            <>
              <span className="country-flag">
                <Icon type="global" />
              </span>
              <div className="country-name">Global</div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default FilterInfoCommon;
