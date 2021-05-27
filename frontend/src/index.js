import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme, { backgroundColor } from './oscarMuiTheme';
import MobileHeader from './components/MobileHeader';
import PublicMap from './screens/Map/PublicMap';
import DeviceDetection from './DeviceDetection/DeviceDetectionContainer';
import './index.css';

import store from './redux/store';

import { MAP_PAGE, EXEC_DASHBOARD_PAGE } from './routes';
import DashboardTabs from './screens/Dashboard/DashboardTabs';
import Navbar from './components/layout/Navbar';
import { checkAuthorization } from './axiosRequests';
import { ConfigContextProvider } from './contexts/ConfigContext';

const useStyles = makeStyles((theme) => ({
  message: {
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
    },
    fontWeight: '400',
  },
  email: {
    color: 'rgb(242, 242, 242)',
  },
  content: {
    backgroundColor,
  },
  noAccess: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgb(243, 150, 62)',
    backgroundColor: 'rgba(56, 63, 81)',
  },
}));

export const App = () => {
  const classes = useStyles();
  const [appAccess, setAppAccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkAuthorization();
        setAppAccess(true);
      } catch (error) {
        if (error.message !== 'Request failed with status code 403') {
          window.location.assign(`${window.location.origin}/oauth2/start`);
        } else {
          setAppAccess(false);
          setMessage('Thank you for your registration: We will inform you once you have been authorized.');
        }
      }
    };
    checkAuth();
  }, []);

  return appAccess ? (
    <BrowserRouter>
      <Provider store={store}>
        <div className="app">
          <MuiThemeProvider theme={theme}>
            <ConfigContextProvider>
              <DeviceDetection />
              <MobileHeader />
              <div className={`content ${classes.content}`}>
                <Switch>
                  <Route exact path={MAP_PAGE} component={PublicMap} />
                  <Navbar>
                    <Route exact path={EXEC_DASHBOARD_PAGE} component={DashboardTabs} />
                  </Navbar>
                </Switch>
              </div>
            </ConfigContextProvider>
          </MuiThemeProvider>
        </div>
      </Provider>
    </BrowserRouter>
  ) : (
    <div className={classes.noAccess}>
      <h1>{message}</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// registerServiceWorker();
