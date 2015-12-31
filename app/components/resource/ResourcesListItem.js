import isEmpty from 'lodash/lang/isEmpty';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Label, ListGroupItem } from 'react-bootstrap';

import TimeRange from 'components/common/TimeRange';
import {
  getAvailableTime,
  getCaption,
  getMainImage,
  getName,
  getOpeningHours,
} from 'utils/DataUtils';


class ResourcesListItem extends Component {
  constructor(props) {
    super(props);
  }

  renderAvailableTime(availableTime) {
    let bsStyle = 'success';
    if (availableTime === '0 tuntia') {
      bsStyle = 'danger';
    }
    return (
      <Label bsStyle={bsStyle}>{availableTime}</Label>
    );
  }

  renderDistance(distance) {
    let bsStyle = 'success';
    return (
      <Label bsStyle={bsStyle}>{distance}</Label>
    );
  }

  renderImage(image) {
    if (image && image.url) {
      const src = `${image.url}?dim=40x40`;
      return <img alt={getCaption(image)} src={src} />;
    }
    return null;
  }

  render() {
    const {
      time,
      geolocation,
      resource,
      unit,
    } = this.props;

    const nameSeparator = isEmpty(resource) || isEmpty(unit) ? '' : ',';
    const availableTime = getAvailableTime(getOpeningHours(resource), resource.reservations);
    const distance = "0";
    const link = `/resources/${resource.id}`

    return (
      <ListGroupItem href={link}>
        <h4>{getName(resource)}</h4>
        <div className="unit-name"><p>
          {this.renderImage(getMainImage(resource.images))}
          {getName(unit)}
          {this.renderDistance(distance)}
          {this.renderAvailableTime(availableTime)}
        </p></div>
      </ListGroupItem>
    );
  }
}

ResourcesListItem.propTypes = {
  time: PropTypes.object,
  geolocation: PropTypes.object,
  updatePath: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ResourcesListItem;