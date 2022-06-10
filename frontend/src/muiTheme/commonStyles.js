import { activeButtonBackgroundColor } from './colors';

export const actionButtonStyles = (theme) => ({
  actionButton: {
    width: '165px',
    color: theme.palette.textColor.main,
    background: theme.palette.background.dark,
    textTransform: 'none',
    fontSize: '0.75rem',
    borderRadius: '8px',
    marginRight: '0px',
    marginLeft: '0px',
    height: '40px',
    boxShadow: '0px 4px 13px rgba(0, 0, 0, 0.33)',
    '&:active': {
      backgroundColor: activeButtonBackgroundColor,
      color: theme.palette.secondary.main,
    },
    '&:focus': {
      backgroundColor: activeButtonBackgroundColor,
      color: theme.palette.secondary.main,
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
