import { createTheme } from '@material-ui/core/styles';
import { mainBoxShadow, muiSelectBackgroundColor, iconColor } from './colors';
import { darkPalette, darkDashboardColors } from './darkTheme';

export const getThemePalette = (theme) => {
  switch (theme) {
    case 'dark':
      return darkPalette;
    default:
      return darkPalette;
  }
};

export const getThemeDashboardColors = (theme) => {
  switch (theme) {
    case 'dark':
      return darkDashboardColors;
    default:
      return darkDashboardColors;
  }
};
const createOscarTheme = (paletteTheme) =>
  createTheme(paletteTheme, {
    typography: {
      fontFamily: 'Segoe UI, sans-serif',
      fontWeightMedium: 600,
      useNextVariants: true,
    },

    overrides: {
      MuiAppBar: {
        colorPrimary: {
          color: paletteTheme.palette.textColor.dark,
          backgroundColor: paletteTheme.palette.background.main,
          boxShadow: 'none',
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
          backgroundColor: paletteTheme.palette.background.light,
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
          color: paletteTheme.palette.textColor.dark,
          display: 'inline-flex',
        },
        option: {
          color: paletteTheme.palette.textColor.main,
          backgroundColor: paletteTheme.palette.background.dark,
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(29, 35, 49, 1)',
          },
          '&[data-focus="true"]': {
            backgroundColor: 'rgba(36, 42, 56, 1)',
          },
        },
      },
      MuiButton: {
        root: {
          paddingTop: '8px',
          paddingBottom: '8px',
          color: paletteTheme.palette.textColor.main,
        },
        containedPrimary: {
          margin: '6px',
          color: paletteTheme.palette.textColor.main,
          backgroundColor: paletteTheme.palette.background.dark,
        },
      },
      MuiChip: {
        root: {
          backgroundColor: 'rgba(0,0,0,0)',
          color: paletteTheme.palette.textColor.main,
        },
        outlined: {
          color: paletteTheme.palette.textColor.dark,
          boxShadow: mainBoxShadow,
        },
      },
      MuiDivider: {
        root: {
          marginBottom: '10px',
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
      MuiFormControlLabel: {
        root: {
          marginLeft: '-14px',
        },
      },
      MuiFormHelperText: {
        root: {
          color: 'red',
        },
      },
      MuiFormLabel: {
        root: {
          fontWeight: 600,
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
      MuiIconButton: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0)',
          },
        },
      },
      MuiInput: {
        root: {
          color: paletteTheme.palette.textColor.main,
          fontSize: '0.85rem',
          '&:hover': {
            color: paletteTheme.palette.textColor.main,
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
      MuiInputBase: {
        root: {
          color: 'white',
          fontSize: '0.8rem',
          padding: '4px',
          backgroundColor: paletteTheme.palette.primary.dark,
          fontWeight: '600',
          boxSizing: 'initial',
        },
        input: {
          backgroundColor: 'rgba(0,0,0,0)',
          padding: '10px 12px',
          color: 'rgba(248, 248, 248, 0.89)',
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${paletteTheme.palette.background.dark} inset`,
            WebkitTextFillColor: paletteTheme.palette.textColor.main,
          },
        },
      },
      MuiInputLabel: {
        root: {
          color: paletteTheme.palette.textColor.main,
          textTransform: 'uppercase',
          fontSize: '1.2rem',
          padding: '4px',
          width: '130%', // 130% because default 100% is shrunk (by mui attribute), thus not "really" utilizing 100% width
          '&$focused': {
            '&$focused': {
              color: paletteTheme.palette.textColor.main,
            },
          },
        },
        formControl: {
          position: 'static',
        },
      },
      MuiListItem: {
        root: {
          backgroundColor: 'transparent',
          '&$selected': {
            backgroundColor: paletteTheme.palette.primary.dark,
          },
          '&:hover': {
            backgroundColor: `${paletteTheme.palette.primary.dark} !important`,
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
      MuiMenuItem: {
        root: {
          zIndex: '3',
          color: paletteTheme.palette.textColor.main,
          fontSize: '0.8rem',
          paddingTop: '11px',
          paddingBottom: '11px',
          '@media (min-width: 600px)': {
            minHeight: '46px',
          },
        },
      },
      MuiPaper: {
        root: {
          backgroundColor: paletteTheme.palette.background.dark,
          color: paletteTheme.palette.primary.contrastText,
        },
        elevation0: {
          boxShadow: mainBoxShadow,
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
      MuiSlider: {
        root: {
          padding: '4px 0 4px 0',
          marginTop: '26px',
        },
        thumb: {
          backgroundColor: paletteTheme.palette.secondary.main,
        },
        track: {
          backgroundColor: paletteTheme.palette.secondary.main,
        },
      },
      MuiSnackbar: {
        root: {
          marginTop: '0px',
          opacity: '50',
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
      MuiTab: {
        textColorInherit: {
          '&[class*="Mui-selected"]': {
            color: paletteTheme.palette.secondary.main,
          },
        },
      },
      MuiTypography: {
        h2: {
          color: paletteTheme.palette.secondary.main,
          fontSize: '1.5em',
          fontWeight: 'bold',
          margin: '0.83em 0 0.83em 0',
        },
        h4: {
          color: paletteTheme.palette.textColor.main,
          fontSize: '1rem',
          fontWeight: '600',
          marginTop: '22px',
        },
        h5: {
          color: paletteTheme.palette.secondary.main,
          fontSize: '0.95rem',
          fontWeight: 'bold',
        },
        h6: {
          color: paletteTheme.palette.textColor.main,
          fontSize: '0.95rem',
          fontWeight: 'bold',
        },
        subtitle1: {
          color: paletteTheme.palette.textColor.main,
          fontSize: '0.85rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          lineHeight: '1.5em',
        },
        body1: {
          color: paletteTheme.palette.textColor.light,
          fontSize: '0.85rem',
          fontWeight: '600',
          lineHeight: '1.5em',
        },
        body2: {
          color: paletteTheme.palette.textColor.main,
          fontSize: '0.8rem',
          fontWeight: '600',
        },
      },
      PrivateSwitchBase: {
        root: {
          padding: '12px',
        },
      },
    },
  });

export default createOscarTheme;
