import React from 'react';
import { Flag } from '..';
import { CountryZones, MenuRankings } from '../../../utils/Helpers';
import './FilterInfoCommon.scss';

const FilterInfoCommon = (props: any) => {
  const { children, filter_value, find_by } = props;

  const sources: any = {
    markets: CountryZones,
    rankings: MenuRankings,
  };

  return (
    <div className="filter-info">
      <div className="filter-main">
        <div>
          <b>MARKET FILTER</b>
        </div>
        <div className="country-info">
          <Flag
            source={sources[find_by]}
            withFlag={filter_value !== 'global' && find_by === 'markets'}
            filterValue={filter_value}
            findBy={find_by}
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default FilterInfoCommon;
