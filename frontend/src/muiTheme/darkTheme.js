import { createTheme } from '@material-ui/core';
import red from '@material-ui/core/colors/red';

// dashboard colors
export const dashboardBlue = 'rgb(9, 126, 220)';
export const dashboardGreen = 'rgba(87, 243, 62, 1)';
export const dashboardYellow = 'rgba(243, 214, 62, 1)';
export const dashboardOrange = 'rgba(243, 150, 62, 1)';
export const dashboardRed = 'rgba(243, 62, 62, 1)';

export const darkDashboardColors = {
  semaphore: {
    green: dashboardGreen,
    yellow: dashboardYellow,
    red: dashboardRed,
  },
  colors: {
    blue: dashboardBlue,
    green: dashboardGreen,
    yellow: dashboardYellow,
    orange: dashboardOrange,
    red: dashboardRed,
  },
  colorsArray: [],
};

// mui colors
export const darkPalette = {
  primary: {
    light: 'white',
    main: 'rgb(53, 60, 77)', // 'rgba(0, 0, 0, 0.8)',
    dark: 'rgba(0,0,0,0.2)', // 'black',
    contrastText: 'rgb(242, 242, 242)',
  },
  secondary: {
    main: 'rgb(243, 150, 62)',
  },
  error: red,
  background: {
    light: 'rgb(56, 63, 81)',
    main: 'rgb(53, 60, 77)',
    dark: 'rgb(34, 40, 54)',
  },
  textColor: {
    light: 'rgba(248, 248, 248, 0.7)',
    main: 'rgb(248, 248, 248)',
    dark: 'rgba(248, 248, 248, 0.38)',
  },
  dashboard: {
    blue: dashboardBlue,
    green: dashboardGreen,
    yellow: dashboardYellow,
    orange: dashboardOrange,
    red: dashboardRed,
  },
};

const darkTheme = createTheme({
  palette: darkPalette,
});

export default darkTheme;
