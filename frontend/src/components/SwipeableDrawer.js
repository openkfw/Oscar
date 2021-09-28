/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Icon, Typography } from '@material-ui/core';
import { mainBackgroundColor } from '../oscarMuiTheme';

const minHeight = 50;
const padding = 16;

class SwipeableDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: this.setInitialHeight(),
      swiping: false,
    };
  }

  setInitialHeight = () => {
    return window.innerHeight / 2 - padding;
  };

  handleTouchStart = (event) => {
    event.stopPropagation();
    const touchStart = event.touches.item(0);
    this.startY = touchStart.clientY;
  };

  handleTouchMove = (event) => {
    event.stopPropagation();
    this.setState({ swiping: true });
    const currentYposition = event.touches.item(0).clientY;
    const viewportHeight = window.innerHeight;

    const { height } = this.state;
    const newHeight = viewportHeight - currentYposition;
    const heightDiff = Math.abs(height - newHeight);

    if (newHeight <= minHeight || newHeight + padding >= viewportHeight || heightDiff < 10) {
      return;
    }

    this.endY = currentYposition;
    this.setState({ height: newHeight });
  };

  handleTouchEnd = () => {
    const currentHeight = this.state.height;
    const viewportHeight = window.innerHeight;
    const viewportHalfHeight = viewportHeight / 2;

    if (!this.endY) {
      return;
    }
    const upScroll = this.startY - this.endY > 0;
    this.startY = null;
    this.endY = null;

    const swiping = false;
    if (currentHeight < viewportHalfHeight && !upScroll) {
      this.setState({ height: minHeight, swiping });
    }

    if ((currentHeight >= viewportHalfHeight && !upScroll) || (currentHeight < viewportHalfHeight && upScroll)) {
      this.setState({ height: viewportHalfHeight - padding, swiping });
    }

    if (currentHeight > viewportHalfHeight && upScroll) {
      this.setState({ height: viewportHeight - padding, swiping });
    }
  };

  getStyles = () => {
    const { height } = this.state;
    const { isMobile } = this.props;

    const mobileStyles = {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      height,
      transition: 'height 0.3s ease-out',
      padding,
      paddingTop: 0,
      paddingBottom: height === minHeight ? 0 : padding,
      backgroundColor: mainBackgroundColor,
    };

    const desktopStyles = {
      boxSizing: 'border-box',
      position: 'fixed',
      top: '64px',
      left: 0,
      zIndex: 2,
      width: '330px',
      height: 'calc(100% - 64px)',
      overflowY: 'auto',
      padding,
      paddingLeft: '0px',
      paddingRight: '0px',
      backgroundColor: mainBackgroundColor,
    };

    return isMobile ? mobileStyles : desktopStyles;
  };

  render() {
    const { height } = this.state;
    const { isMobile } = this.props;
    const drawerContent = (
      <Grid container direction="column">
        <Grid item xs={12}>
          <Typography variant="h5" className="featureDetailTitle" style={{ textTransform: 'uppercase' }}>
            {this.props.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {this.props.children}
        </Grid>
      </Grid>
    );
    return (
      <Paper style={this.getStyles()} square>
        {isMobile ? (
          <div>
            <Grid
              container
              direction="row"
              justifyContent="center"
              onTouchStart={this.handleTouchStart}
              onTouchMove={this.handleTouchMove}
              onTouchEnd={this.handleTouchEnd}
              style={{ height: `${minHeight}px` }}>
              <Grid item style={{ padding: 0 }}>
                <Icon style={{ position: 'relative', top: '21px' }}>maximize</Icon>
              </Grid>
            </Grid>
            <div style={{ overflowY: 'scroll', height: height - minHeight, overflowX: 'hidden' }}>{drawerContent}</div>
          </div>
        ) : (
          drawerContent
        )}
      </Paper>
    );
  }
}

SwipeableDrawer.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
};

export default connect((state) => ({ isMobile: state.get('isMobile') }), null)(SwipeableDrawer);
