import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

const ConfigContext = createContext();

const ConfigContextProvider = ({ children }) => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await axios.get('/api/config');
        setConfig(response.data);
      } catch (error) {
        setConfig({});
      }
    }
    fetchConfig();
  }, []);

  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>;
};

export { ConfigContext, ConfigContextProvider };
