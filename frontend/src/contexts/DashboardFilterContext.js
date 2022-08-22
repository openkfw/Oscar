import React, { useState } from 'react';
import PropTypes from 'prop-types';

const { Consumer, Provider } = React.createContext();

const DashboardFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);

  return (
    <Provider
      value={{
        filters,
        setFilters,
      }}>
      {children}
    </Provider>
  );
};

DashboardFilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DashboardFilterProvider, Consumer as DashboardFilterConsumer };
