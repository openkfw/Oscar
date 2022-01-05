import React from 'react';

import FetchedAutocomplete from './FetchedAutocomplete';

const DashboardFilter = ({ config }) => {
  const filters = {
    autocomplete: FetchedAutocomplete,
  };
  const FilterName = filters[config.type];
  return <FilterName {...config} />;
};

export default DashboardFilter;
