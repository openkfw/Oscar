import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Modal from '@material-ui/core/Modal';

import { mainBackgroundColor } from '../../../muiTheme/colors';
import LegendItem from './LegendItem';
import LegendTitle from './LegendTitle';

const useStyles = makeStyles(() => ({
  legendPaper: {
    position: 'fixed',
    margin: '0px',
    padding: '2px',
    paddingLeft: '10px',
    paddingTop: '0px',
    right: 0,
    top: '54px',
    backgroundColor: mainBackgroundColor,
  },
  legendTitleBar: {
    clear: 'both',
    float: 'left',
    width: '100%',
  },
  legendItemDiv: {
    margin: '10px',
    marginBottom: '0px',
  },
  cancelButton: {
    float: 'right',
  },
  legendButton: {
    position: 'fixed',
    left: 0,
    bottom: '78px',
  },
}));

const MobilLegendLayout = ({ data }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  if (data.length) {
    if (open) {
      return (
        <Modal open={open} onClose={() => setOpen(false)}>
          <Paper className={classes.legendPaper}>
            <CancelIcon onClick={() => setOpen(false)} style={{ float: 'right', margin: '4px' }} />
            {data.map((item) => (
              <div key={item.layerTitle} className={classes.legendItemDiv}>
                <div className={classes.legendTitleBar}>
                  <LegendTitle title={item.layerTitle} />
                </div>
                {item.legends.map((legend) => (
                  <LegendItem key={legend.description} legend={legend} classes={classes} />
                ))}
              </div>
            ))}
          </Paper>
        </Modal>
      );
    }
    return (
      <Tooltip title={open ? 'Close legend' : 'View legend'}>
        <Fab className={classes.legendButton} color="primary" onClick={() => setOpen(!open)}>
          <Icon>format_list_bulleted</Icon>
        </Fab>
      </Tooltip>
    );
  }
  return null;
};
MobilLegendLayout.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
};
export default MobilLegendLayout;
