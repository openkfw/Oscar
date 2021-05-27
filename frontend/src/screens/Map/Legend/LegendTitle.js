import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const style = {
  display: 'inline-block',
  float: 'left',
  marginTop: '10px',
  marginBottom: '4px',
  width: '280px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const LegendTitle = ({ title }) => (
  <Tooltip position="bottom-start" title={title}>
    <Typography variant="h5" style={style}>
      {title}
    </Typography>
  </Tooltip>
);

LegendTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default LegendTitle;
