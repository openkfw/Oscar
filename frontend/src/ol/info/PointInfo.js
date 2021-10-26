import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'ol/Overlay';
import * as olExtent from 'ol/extent';

class PointInfo extends React.Component {
  constructor(props) {
    super(props);

    this.popup = React.createRef();
    this.popupHeader = React.createRef();
    this.popupContent = React.createRef();
    this.popupAction = React.createRef();

    this.style = {
      centerRight: false,
      topRight: false,
    };

    this.props.map.on('pointermove', async (evt) => {
      evt.preventDefault();
      const featuresWithLayers = [];
      await this.props.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (layer) {
          const layerProperties = layer.getProperties();
          featuresWithLayers.push({
            feature,
            layer: layerProperties.title,
            attribute: layerProperties.attribute,
            attributeDescription: layerProperties.attributeDescription,
            featureId: layerProperties.featureId,
          });
        }
      });
      if (featuresWithLayers && featuresWithLayers.length > 0) {
        await this.props.setPixel(featuresWithLayers, evt.coordinate, evt.pixel);
      } else {
        this.closePopup();
      }
    });

    this.popupOverlay = new Overlay({
      autoPan: false,
      autoPanAnimation: {
        duration: 250,
      },
      offset: [-50, -15],
      positioning: 'bottom-left',
    });
    this.props.map.addOverlay(this.popupOverlay);
  }

  componentDidUpdate() {
    if (this.props.descriptions && this.props.numberOfFeatures > 0 && this.props.coordinates) {
      this.updatePopup(this.props.descriptions.toJS());
    }
  }

  updatePopup = (descriptions) => {
    const popup = this.popup.current;

    popup.style.display = 'block';
    this.popupHeader.current.innerHTML = 'What is here:';
    let lines = '';
    for (let i = 0; i < 4 && i < descriptions.length; i++) {
      lines += `<p style="padding: 2px; margin: 0px">${descriptions[i]}</p>`;
    }
    if (descriptions.length > 4) {
      lines += `<p style="padding: 2px; margin: 0px">Please zoom in for ${descriptions.length - 4} more</p>`;
    }
    this.popupContent.current.innerHTML = lines;

    this.popupOverlay.setElement(document.getElementById('detailsPopup'));
    this.popupOverlay.setPosition(this.props.coordinates.toJS());

    const overlayPosition = this.popupOverlay.getPosition();
    const viewExtent = this.props.map.getView().calculateExtent(this.props.map.getSize());
    const overlayPointPosition = this.props.map.getPixelFromCoordinate(overlayPosition);
    const widthOverlayPositionWithPopup = [
      overlayPointPosition[0] + this.popup.current.getBoundingClientRect().width,
      overlayPointPosition[1],
    ];
    const heightOverlayPositionWithPopup = [
      overlayPointPosition[0],
      overlayPointPosition[1] - this.popup.current.getBoundingClientRect().height,
    ];
    const popupRightCornerCoordinates = this.props.map.getCoordinateFromPixel(widthOverlayPositionWithPopup);
    const popupTopCornerCoordinates = this.props.map.getCoordinateFromPixel(heightOverlayPositionWithPopup);

    const isPopupRightCornerInMap = olExtent.containsCoordinate(viewExtent, popupRightCornerCoordinates);
    const isPopupTopCornerInMap = olExtent.containsCoordinate(viewExtent, popupTopCornerCoordinates);

    if ((!isPopupRightCornerInMap && isPopupTopCornerInMap) || (!isPopupRightCornerInMap && !isPopupTopCornerInMap)) {
      this.style.centerRight = true;
      this.style.topRight = false;
      this.popupOverlay.setPositioning('center-right');
      return this.popupOverlay.setOffset([-10, 35]);
    }
    if (!isPopupTopCornerInMap && isPopupRightCornerInMap) {
      this.style.topRight = true;
      this.style.centerRight = false;
      this.popupOverlay.setPositioning('top-right');
      return this.popupOverlay.setOffset([40, 10]);
    }
    this.style.centerRight = false;
    this.style.topRight = false;
    this.popupOverlay.setPositioning('bottom-left');
    this.popupOverlay.setOffset([-50, -15]);
  };

  closePopup = () => {
    const popup = this.popup.current;
    popup.style.display = 'none';
  };

  render() {
    const centerRightClass = this.style.centerRight ? 'ol-popup-center-right' : '';
    const topRightClass = this.style.topRight ? 'ol-popup-top-right' : '';
    return (
      <div className={`ol-popup ${centerRightClass} ${topRightClass}`} id="detailsPopup" ref={this.popup}>
        <div className="popup-header" ref={this.popupHeader} />
        <div className="popup-content" ref={this.popupContent} />
      </div>
    );
  }
}

PointInfo.defaultProps = {
  coordinates: null,
  descriptions: null,
};

PointInfo.propTypes = {
  coordinates: PropTypes.objectOf(PropTypes.any),
  descriptions: PropTypes.objectOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  numberOfFeatures: PropTypes.number.isRequired,
  setPixel: PropTypes.func.isRequired,
};

export default PointInfo;
