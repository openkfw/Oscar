import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { ConfigContext } from '../../contexts/ConfigContext';
import DashboardTab from '../../components/layout/DashboardTabLayout';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3} style={{ paddingRight: '0px', paddingLeft: '0px' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  tabs: {
    borderBottom: '1px solid rgba(248, 248, 248, 0.11)',
    margin: '0 12px',
  },
  noDashboard: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgb(243, 150, 62)',
    backgroundColor: 'rgba(56, 63, 81)',
  },
}));

export const SimpleTabs = () => {
  const history = useHistory();
  const configContext = useContext(ConfigContext);
  const { tabs } = configContext.config;
  const classes = useStyles();
  const { tabName } = useParams();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(undefined);

  const handleTabChange = (event, newTab) => {
    const tabToSelect = tabs ? Object.values(tabs).find((tab) => tab.index === newTab) : {};
    if (newTab !== selectedTab && tabToSelect) {
      setSelectedTab(newTab);
      if (!location.pathname.includes(tabToSelect.urlIdentifier)) {
        history.replace(`/dashboard/${tabToSelect.urlIdentifier}`);
      }
    }
  };

  useEffect(() => {
    const currentTab = tabs ? Object.values(tabs).find((tab) => tab.urlIdentifier === tabName) : {};
    const currentTabLength = currentTab ? Object.keys(currentTab).length : 0;

    if (currentTab && Number.isInteger(currentTab.index) && currentTab.index !== selectedTab) {
      handleTabChange(null, currentTab.index);
    } else if (!tabName && tabs && Object.keys(tabs).length > 0) {
      handleTabChange(null, 0);
    } else if (currentTabLength === 0 && tabs) {
      handleTabChange(null, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName, tabs]);

  const renderTabs = () => {
    return (
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="dashboard tabs">
        {Object.keys(tabs).map((tab) => (
          <Tab key={tabs[tab].index} label={tabs[tab].label} {...a11yProps(tabs[tab].index)} />
        ))}
      </Tabs>
    );
  };

  const renderTabContent = () => {
    return (
      <>
        {Object.keys(tabs).map((tab) => (
          <TabPanel value={selectedTab} index={tabs[tab].index} key={tabs[tab].index}>
            <DashboardTab
              filters={tabs[tab].filters}
              graphs={tabs[tab].graphs}
              printGraphs={tabs[tab].printGraphs}
              isPrint={tabs[tab].printGraphs && tabs[tab].printGraphs.length ? 'print' : undefined}
            />
          </TabPanel>
        ))}
      </>
    );
  };

  return (
    <div className={classes.root} id="dashboard-content">
      {tabs ? (
        <>
          <AppBar className={classes.tabs} position="static" id="tabs-captions">
            {selectedTab !== undefined ? renderTabs() : <></>}
          </AppBar>
          {selectedTab !== undefined ? renderTabContent() : <></>}
        </>
      ) : (
        <div className={classes.noDashboard}>
          <h1>Dashboard not found, please reload the page or try again later.</h1>
        </div>
      )}
    </div>
  );
};

export default SimpleTabs;
