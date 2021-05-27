import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Tooltip from '@material-ui/core/Tooltip';
import { IconButton, makeStyles, CircularProgress, ListItem, List, Collapse } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { accentColor } from '../../../oscarMuiTheme';
import SwipeableDrawer from '../../../components/SwipeableDrawer';
import LayerInfoModal from '../../../components/LayerInfoModal';

const useStyles = makeStyles(() => ({
  smallIcon: {
    padding: '2px',
    '& svg': {
      fontSize: 20,
    },
  },
  loader: {
    verticalAlign: 'middle',
    marginLeft: '10px',
  },
  expandButton: {
    paddingLeft: '14px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  list: {
    width: '100%',
  },
  arrow: {
    color: accentColor.main,
  },
}));

const SelectBar = ({ layers, staticLayersData, toggleStaticLayer, handleClose, isLoading }) => {
  const classes = useStyles();
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: '',
    data: {},
  });
  const handleModalOpen = (title, data) => {
    setModalData({ isOpen: true, title, data });
  };

  const handleModalClose = () => {
    setModalData({ isOpen: false, title: '', data: {} });
  };

  const reduceToCategories = (layers, data) => {
    const categorizedLayers = {};
    const createCategoryAndAdd = (categoryName, layer) => {
      if (categoryName in categorizedLayers) {
        categorizedLayers[categoryName].push(layer);
      } else {
        categorizedLayers[categoryName] = [layer];
      }
    };
    layers.forEach((layer) => {
      const title = layer.get('title');
      const currentLayer = data.find((l) => l.title === title);
      let hasAdditionalInfo = false;
      let additionalInfo = false;
      if (currentLayer) {
        additionalInfo = currentLayer.metadata || {};
        Object.keys(additionalInfo).forEach((propName) => {
          if (!additionalInfo[propName]) {
            delete additionalInfo[propName];
          }
        });
        hasAdditionalInfo = !!Object.values(additionalInfo).length;
      }
      const layerComponent = (
        <FormControlLabel
          key={title}
          control={
            <Tooltip title={title} placement="right-end" arrow>
              <Switch
                value={title}
                checked={layer.getVisible()}
                onChange={() => {
                  toggleStaticLayer(title);
                }}
                color="secondary"
              />
            </Tooltip>
          }
          label={
            <span>
              {title}
              {hasAdditionalInfo ? (
                <IconButton
                  className={classes.smallIcon}
                  color="inherit"
                  onClick={() => handleModalOpen(title, additionalInfo)}>
                  <InfoIcon />
                </IconButton>
              ) : null}
              {isLoading.some((item) => item.title === title) ? (
                <CircularProgress color="inherit" size={18} className={classes.loader} />
              ) : null}
            </span>
          }
        />
      );
      if (layer.get('category') || currentLayer.category) {
        createCategoryAndAdd(layer.get('category') || currentLayer.category, layerComponent);
      } else {
        createCategoryAndAdd('Other data', layerComponent);
      }
    });
    return categorizedLayers;
  };
  const layersCategories = reduceToCategories(layers, staticLayersData);

  const getLayerCategories = () => {
    const categories = {};
    Object.keys(layersCategories)
      .sort()
      .forEach((category) => {
        categories[category] = false;
      });
    return categories;
  };

  const [layerCategories, setLayerCategories] = React.useState(getLayerCategories());

  const handleLayerCategoryChange = (title) => {
    if (layerCategories[title] === false) {
      setLayerCategories({ ...layerCategories, [title]: true });
    } else {
      setLayerCategories({ ...layerCategories, [title]: false });
    }
  };

  const getSidebarCategories = (layersCategories) => {
    return Object.keys(layersCategories)
      .sort()
      .map((category) => {
        return (
          <Fragment key={category}>
            <Grid item xs={12}>
              <Divider />
              <ListItem
                className={classes.expandButton}
                button
                onClick={() => {
                  handleLayerCategoryChange(category);
                }}>
                <Typography variant="h6">{category}</Typography>
                {layerCategories[category] ? (
                  <ArrowDropUpIcon className={classes.arrow} />
                ) : (
                  <ArrowDropDownIcon className={classes.arrow} />
                )}
              </ListItem>
            </Grid>
            <Grid item xs={12}>
              <Collapse in={layerCategories[category]} timeout="auto" unmountOnExit>
                <FormGroup>{layersCategories[category]}</FormGroup>
              </Collapse>
            </Grid>
          </Fragment>
        );
      });
  };

  return (
    <SwipeableDrawer title={<div className="featureDetailTitle">Layers</div>} handleClose={handleClose}>
      <LayerInfoModal
        isOpen={modalData.isOpen}
        handleModalClose={handleModalClose}
        modalData={modalData.data}
        title={modalData.title}
      />

      <Grid container className="featureDetail">
        <List className={classes.list}>{getSidebarCategories(layersCategories)}</List>
      </Grid>
    </SwipeableDrawer>
  );
};

SelectBar.propTypes = {
  handleClose: PropTypes.func.isRequired,
  layers: PropTypes.arrayOf(PropTypes.object).isRequired,
  staticLayersData: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleStaticLayer: PropTypes.func.isRequired,
  isLoading: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default SelectBar;
