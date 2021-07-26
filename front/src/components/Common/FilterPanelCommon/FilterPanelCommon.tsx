import React from 'react';
import { t } from '../../../config/i18n';
import { FormFields } from '../../Formik';

import './FilterPanelCommon.scss';

const FilterPanelCommon = (props: any) => {
  const { filters, handleFilters = () => {} } = props;

  return (
    <div className="filter-table">
      <FormFields
        {...filters}
        validateSubmit={handleFilters}
        method="get"
        submitText={t('buttonFilter')}
        resetText={t('buttonReset')}
      />
    </div>
  );
};

export default FilterPanelCommon;
