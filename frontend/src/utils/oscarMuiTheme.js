import { createTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const mainTextColor = 'rgb(248, 248, 248)';
export const lightTextColor = 'rgb(242, 242, 242)';
export const greyTextColor = 'rgba(248, 248, 248, 0.7)';
export const lightGreyTextColor = 'rgba(248, 248, 248, 0.39)';
export const accentColor = {
  main: 'rgb(243, 150, 62)',
};

export const mainBackgroundColor = 'rgb(56, 63, 81)';
export const backgroundColor = 'rgb(53, 60, 77)';
export const buttonBackgroundColor = 'rgb(34, 40, 54)';
export const activeButtonBackgroundColor = 'rgb(21, 25, 34)';
export const dropdownBackgroundColor = 'rgb(34, 40, 54)';
export const inputBackgroundColor = 'rgba(0,0,0,0.2)';
export const autocompleteBackgroundColor = 'rgb(56, 63, 81)';
export const muiSelectBackgroundColor = 'rgb(70,75,88)';
export const muiListItemBackgroundColor = 'rgba(0, 0, 0, 0.14)';

export const inputColor = 'rgba(248, 248, 248, 0.89)';
export const dashboardDateColor = 'rgba(248, 248, 248, 0.38)';
export const dashboardChartAxisColor = 'rgba(255, 255, 255, 0.64)';
export const dashboardCardGreyColor = 'rgba(255, 255, 255, 0.3)';
export const dashboardChartGridColor = 'rgba(248, 248, 248, 0.11)';
export const dashboardChartRedColor = 'rgb(243, 62, 62)';
export const dashboardChartLightRedColor = 'rgb(228, 83, 83)';
export const dashboardChartGreenColor = 'rgb(87, 243, 62)';
export const dashboardChartYellowColor = 'rgb(220, 195, 64)';
export const dashboardChartBlueColor = 'rgb(64, 70, 220)';
export const dashboardChartPurpleColor = 'rgb(229, 62, 243)';
export const dashboardChartLightBlueColor = 'rgb(64, 220, 220)';
export const iconColor = 'rgb(248, 248, 248)';

export const mainBoxShadow = '0px 1px 34px 2px rgba(39, 44, 55, 0.41)';

export const actionButtonStyles = () => ({
  actionButton: {
    width: '165px',
    color: mainTextColor,
    background: buttonBackgroundColor,
    textTransform: 'none',
    fontSize: '0.75rem',
    borderRadius: '8px',
    marginRight: '0px',
    marginLeft: '0px',
    height: '40px',
    boxShadow: '0px 4px 13px rgba(0, 0, 0, 0.33)',
    '&:active': {
      backgroundColor: activeButtonBackgroundColor,
      color: accentColor.main,
    },
    '&:focus': {
      backgroundColor: activeButtonBackgroundColor,
      color: accentColor.main,
    },
  },
});

export const clickableStyles = (theme) => ({
  clickable: {
    color: theme.palette.secondary.main,
    cursor: 'pointer',
  },
});

export const customSnackbarStyles = (theme) => ({
  snackbar: {
    marginTop: '0px',
    opacity: '50',
    [theme.breakpoints.down('md')]: {
      marginLeft: '60px',
      marginRight: '60px',
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      light: 'white',
      main: 'rgba(0, 0, 0, 0.8)',
      dark: 'black',
      contrastText: lightTextColor,
    },
    secondary: accentColor,
    error: red,
  },
  typography: {
    fontFamily: 'Segoe UI, sans-serif',
    fontWeightMedium: 600,
    useNextVariants: true,
  },

  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: dropdownBackgroundColor,
        color: lightTextColor,
      },
      elevation0: {
        boxShadow: mainBoxShadow,
      },
    },
    MuiButton: {
      root: {
        paddingTop: '8px',
        paddingBottom: '8px',
        color: mainTextColor,
      },
      containedPrimary: {
        margin: '6px',
        color: mainTextColor,
        backgroundColor: buttonBackgroundColor,
      },
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0)',
        },
      },
    },
    MuiSnackbar: {
      root: {
        marginTop: '0px',
        opacity: '50',
      },
    },
    MuiGrid: {
      item: {
        paddingTop: '10px',
      },
      'grid-xs-12': {
        display: 'flex',
        flexWrap: 'wrap',
      },
    },
    MuiMenuItem: {
      root: {
        zIndex: '3',
        color: mainTextColor,
        fontSize: '0.8rem',
        paddingTop: '11px',
        paddingBottom: '11px',
        '@media (min-width: 600px)': {
          minHeight: '46px',
        },
      },
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0)',
        color: mainTextColor,
      },
      outlined: {
        color: lightGreyTextColor,
        boxShadow: mainBoxShadow,
      },
    },
    MuiDivider: {
      root: {
        marginBottom: '10px',
      },
    },
    MuiInputLabel: {
      root: {
        color: mainTextColor,
        textTransform: 'uppercase',
        fontSize: '1.2rem',
        padding: '4px',
        width: '130%', // 130% because default 100% is shrunk (by mui attribute), thus not "really" utilizing 100% width
        '&$focused': {
          '&$focused': {
            color: mainTextColor,
          },
        },
      },
    },
    MuiInputBase: {
      root: {
        color: 'white',
        fontSize: '0.8rem',
        padding: '4px',
        backgroundColor: inputBackgroundColor,
        marginTop: '26px',
        fontWeight: '600',
        boxSizing: 'initial',
      },
      input: {
        backgroundColor: 'rgba(0,0,0,0)',
        padding: '10px 12px',
        color: inputColor,
        '&:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 100px ${buttonBackgroundColor} inset`,
          WebkitTextFillColor: mainTextColor,
        },
      },
    },
    MuiSlider: {
      root: {
        padding: '4px 0 4px 0',
        marginTop: '26px',
      },
      thumb: {
        backgroundColor: accentColor.main,
      },
      track: {
        backgroundColor: accentColor.main,
      },
    },
    MuiInput: {
      root: {
        color: mainTextColor,
        fontSize: '0.85rem',
        '&:hover': {
          color: mainTextColor,
        },
      },
      underline: {
        '&:before': {
          borderBottom: '0px',
        },
        '&:after': {
          borderBottom: '0px',
        },
        '&:hover:before': {
          borderBottom: ['0px', '!important'],
        },
      },
    },
    MuiSelect: {
      root: {
        backgroundColor: muiSelectBackgroundColor,
        color: 'white',
      },
      select: {
        paddingTop: '12px',
        paddingBottom: '16px',
        color: 'white',
        overflowWrap: 'normal',
        '&:focus': {
          backgroundColor: muiSelectBackgroundColor,
        },
      },
      selectMenu: {
        whiteSpace: 'normal',
      },
      icon: {
        color: 'white',
      },
    },
    MuiTypography: {
      h2: {
        color: accentColor.main,
        fontSize: '1.5em',
        fontWeight: 'bold',
        margin: '0.83em 0 0.83em 0',
      },
      h4: {
        color: mainTextColor,
        fontSize: '1rem',
        fontWeight: '600',
        marginTop: '22px',
      },
      h5: {
        color: accentColor.main,
        fontSize: '0.95rem',
        fontWeight: 'bold',
      },
      h6: {
        color: mainTextColor,
        fontSize: '0.95rem',
        fontWeight: 'bold',
      },
      subtitle1: {
        color: mainTextColor,
        fontSize: '0.85rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        lineHeight: '1.5em',
      },
      body1: {
        color: greyTextColor,
        fontSize: '0.85rem',
        fontWeight: '600',
        lineHeight: '1.5em',
      },
      body2: {
        color: mainTextColor,
        fontSize: '0.8rem',
        fontWeight: '600',
      },
    },
    MuiFab: {
      primary: {
        margin: '6px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        '&:hover': {
          backgroundColor: 'black',
        },
      },
    },
    MuiListItemText: {
      root: {
        padding: '0 16px 0 0',
        marginTop: '0',
        marginBottom: '0',
      },
      primary: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
      },
    },
    MuiFormControlLabel: {
      root: {
        marginLeft: '-14px',
      },
    },
    PrivateSwitchBase: {
      root: {
        padding: '12px',
      },
    },
    MuiSwitch: {
      root: {
        width: '62px',
        padding: '0px',
        height: '48px',
      },
      track: {
        position: 'absolute',
        top: '50%',
        marginTop: '-7px',
        marginLeft: '-17px',
        left: '50%',
        width: '34px',
        height: '14px',
        backgroundColor: 'rgb(38, 40, 52)',
      },
      switchBase: {
        padding: 0,
        top: 'initial',
        left: 'initial',
        position: 'initial',
        width: '48px',
        height: '48px',
        '&[class*="Mui-checked"]': {
          '& + [class*="MuiSwitch-track"]': {
            opacity: '0.8',
          },
        },
      },
      thumb: {
        color: iconColor,
      },
    },
    MuiFormLabel: {
      root: {
        fontWeight: 600,
      },
    },
    MuiListItem: {
      root: {
        backgroundColor: 'transparent',
        '&$selected': {
          backgroundColor: muiListItemBackgroundColor,
        },
        '&:hover': {
          backgroundColor: `${muiListItemBackgroundColor} !important`,
        },
      },
    },
    MuiAutocomplete: {
      root: {
        marginTop: '10px',
      },
      listbox: {
        backgroundColor: 'rgba(34, 40, 54, 1)',
      },
      inputRoot: {
        backgroundColor: autocompleteBackgroundColor,
        marginTop: '0px',
        boxSizing: 'border-box',
        minHeight: '58px',
        boxShadow: mainBoxShadow,
        '& $input': {
          width: '20%',
        },
        '&[class*="MuiInput-root"]': {
          '& $input': {
            padding: '10px 12px',
          },
          '& $input:first-child': {
            padding: '10px 12px',
          },
        },
      },
      input: {
        color: lightGreyTextColor,
        display: 'inline-flex',
      },
      option: {
        color: mainTextColor,
        backgroundColor: dropdownBackgroundColor,
        '&[aria-selected="true"]': {
          backgroundColor: 'rgba(29, 35, 49, 1)',
        },
        '&[data-focus="true"]': {
          backgroundColor: 'rgba(36, 42, 56, 1)',
        },
      },
    },
    MuiAppBar: {
      colorPrimary: {
        color: lightGreyTextColor,
        backgroundColor,
        boxShadow: 'none',
      },
    },
    MuiTab: {
      textColorInherit: {
        '&[class*="Mui-selected"]': {
          color: accentColor.main,
        },
      },
    },
    MuiFormHelperText: {
      root: {
        color: 'red',
      },
    },
  },
});

export default theme;
