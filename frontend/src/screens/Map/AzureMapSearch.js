/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Icon, IconButton } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { findPlace } from '../../axiosRequests';
import { selectedPlaceVectorSource } from '../../ol/place';
import FabIconButton from '../../components/FabIconButton';
import Place from '../../components/Place';
import { mainBackgroundColor, buttonBackgroundColor, iconColor } from '../../muiTheme/colors';
import { foundPointAddressString } from '../../utils/helpers';
import validations from '../../utils/validations';

const buttonStyle = {
  color: iconColor,
  position: 'fixed',
  height: 40,
  width: 40,
  margin: 6,
  top: 6,
  right: 6,
  borderRadius: '0',
  backgroundColor: buttonBackgroundColor,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
};

const resultsListStyle = {
  backgroundColor: mainBackgroundColor,
  margin: 18,
  padding: 6,
  zIndex: 1,
};

const placeStyle = {
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
};

const listStyle = {
  width: '100%',
};

class AzureMapSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedPlace: '',
      foundPlaces: undefined,
      selectedIndex: null,
      searching: false,
      isSearchBar: false,
    };
  }

  onOpenSearchBarClick = () => {
    this.setState((prevState) => ({ isSearchBar: !prevState.isSearchBar }));
  };

  setSearchedPlace = (event) => {
    if (validations.comment(event.target.value)) {
      this.setState({ searchedPlace: event.target.value });
    } else {
      this.setState({ searchedPlace: null });
    }
  };

  findPlace = () => {
    selectedPlaceVectorSource.refresh();
    const { searchedPlace } = this.state;
    this.setState({ searching: true });
    findPlace(searchedPlace).then((places) => {
      this.setState({ foundPlaces: places, searching: false });
    });
  };

  seePlaceOnMap = (place) => {
    const coordinates = fromLonLat(place.coordinates);
    const placeFeature = new Feature({
      geometry: new Point(coordinates),
      name: foundPointAddressString(place.address),
      category: 'selected place',
    });

    selectedPlaceVectorSource.refresh();
    selectedPlaceVectorSource.addFeature(placeFeature);

    this.props.map.getView().animate({
      center: coordinates,
      duration: 1000,
    });
  };

  clearSearchBar = () => {
    selectedPlaceVectorSource.refresh();
    const updatedState = {};
    updatedState.foundPlaces = undefined;
    updatedState.searchedPlace = '';
    updatedState.selectedIndex = null;
    this.setState(updatedState);
  };

  onEnter = (event) => {
    if (event.key === 'Enter' && this.state.searchedPlace) {
      event.preventDefault();
      this.findPlace();
    }
  };

  navigateToPlace = (index, place) => {
    this.setState({ selectedIndex: index });
    this.seePlaceOnMap(place);
  };

  render() {
    const { foundPlaces, selectedIndex, searching } = this.state;
    const { isMobile } = this.props;
    const searchResults = foundPlaces && foundPlaces.length > 1;
    const ref = React.createRef();

    let places;
    if (Array.isArray(foundPlaces)) {
      if (searchResults) {
        places = (
          <Grid xs={12} item style={resultsListStyle}>
            <List style={listStyle}>
              {foundPlaces.map((place, index) => (
                <Place
                  style={placeStyle}
                  key={index}
                  index={index}
                  selectedIndex={selectedIndex}
                  placeName={foundPointAddressString(place.address)}
                  navigateToPlace={() => this.navigateToPlace(index, place)}
                />
              ))}
            </List>
          </Grid>
        );
      } else {
        places = (
          <Grid item xs={12} style={resultsListStyle}>
            <Typography variant="subtitle1">No results</Typography>
          </Grid>
        );
      }
    }

    return isMobile ? null : !this.state.isSearchBar ? (
      <IconButton aria-label="open-search" onClick={this.onOpenSearchBarClick} size="small" style={buttonStyle}>
        <SearchIcon fontSize="inherit" />
      </IconButton>
    ) : (
      <>
        <Paper className="search-bar" square>
          <Grid container direction="row">
            <Grid item xs={12} style={{ paddingTop: '0px' }}>
              <InputBase
                autoFocus
                fullWidth
                style={{ marginTop: 'auto', backgroundColor: buttonBackgroundColor }}
                id="bing-search"
                placeholder="Find place"
                onChange={this.setSearchedPlace}
                onKeyPress={this.onEnter}
                endAdornment={
                  searching ? (
                    <CircularProgress size={24} style={{ marginLeft: '10px' }} />
                  ) : (
                    <Tooltip title={searchResults ? 'Close' : 'Search'}>
                      <FabIconButton
                        ref={ref}
                        style={{ color: iconColor, padding: '2px' }}
                        onClick={
                          searchResults ? this.clearSearchBar : this.state.searchedPlace ? this.findPlace : () => null
                        }>
                        <Icon>{searchResults ? 'close' : 'search'}</Icon>
                      </FabIconButton>
                    </Tooltip>
                  )
                }
              />
            </Grid>
            {places}
          </Grid>
        </Paper>
        <IconButton aria-label="open-search" onClick={this.onOpenSearchBarClick} size="small" style={buttonStyle}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </>
    );
  }
}

AzureMapSearch.propTypes = {
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isMobile: state.get('isMobile'),
});

export default connect(mapStateToProps, null)(AzureMapSearch);
