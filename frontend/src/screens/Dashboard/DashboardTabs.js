import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { ConfigContext } from '../../contexts/ConfigContext';
import PublicTab from './PublicTab';

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
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const configContext = useContext(ConfigContext);
  const { tabs } = configContext.config;

  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  const renderTabs = () => {
    return (
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="simple tabs example">
        {tabs.PublicTab && <Tab label="Public" {...a11yProps(tabs.PublicTab.index)} />}
      </Tabs>
    );
  };

  const renderTabContent = () => {
    return (
      <>
        {tabs.PublicTab && (
          <TabPanel value={selectedTab} index={tabs.PublicTab.index}>
            <PublicTab config={tabs.PublicTab} />
          </TabPanel>
        )}
      </>
    );
  };

  return tabs ? (
    <div className={classes.root}>
      <AppBar className={classes.tabs} position="static">
        {renderTabs()}
      </AppBar>
      {renderTabContent()}
    </div>
  ) : (
    <div className={classes.noDashboard}>
      <h1>Failed to load dashboard settings, please reload the page or try again later.</h1>
    </div>
  );
};

export default SimpleTabs;
