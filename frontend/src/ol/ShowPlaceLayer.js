/* eslint-disable react/require-default-props */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

class ShowPlaceLayer extends Component {
  constructor(props) {
    super(props);
    this.source = new VectorSource();
    this.layer = new VectorLayer({
      title: 'Selected Place',
      source: this.source,
      style: [
        new Style({
          image: new Icon({
            src: './location.png',
          }),
        }),
      ],
    });

    this.props.map.addLayer(this.layer);
    if (this.props.coordinates) {
      this.createFeature();
      this.seePlaceOnMap();
    }
  }

  // here we update against the props
  componentDidUpdate(prevProps) {
    if (this.props.coordinates !== prevProps.coordinates) {
      this.source.refresh();
      if (this.props.coordinates) {
        this.createFeature();
        this.seePlaceOnMap();
      }
    }
  }

  createFeature = () => {
    const feature = new Feature({
      geometry: new Point(fromLonLat(this.props.coordinates)),
      name: this.props.name || 'point',
    });
    this.source.addFeature(feature);
  };

  seePlaceOnMap = () =>
    this.props.map.getView().animate({
      center: fromLonLat(this.props.coordinates),
      duration: 1000,
    });

  // no rendering, as we are adding things to map
  render() {
    return null;
  }
}

ShowPlaceLayer.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number),
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  name: PropTypes.string,
};

const mapStateToProps = (state) => ({
  coordinates: state.getIn(['overview', 'pointOfInterest']),
});

export default connect(mapStateToProps)(ShowPlaceLayer);
