import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import { Button, Input, Modal } from 'react-bootstrap';

import TimeRange from 'components/common/TimeRange';

class ConfirmReservationModal extends Component {
  constructor(props) {
    super(props);
    this.onConfirm = this.onConfirm.bind(this);
    this.renderModalBody = this.renderModalBody.bind(this);
  }

  onConfirm() {
    const { onClose, onConfirm, resource } = this.props;
    const isAdmin = resource.userPermissions.isAdmin;
    const values = isAdmin ? { comments: this.refs.commentInput.getValue() } : {};
    onClose();
    onConfirm(values);
  }

  renderModalBody() {
    const {
      isEditing,
      isLoggedIn,
      reservationsToEdit,
      resource,
      selectedReservations,
    } = this.props;
    const isAdmin = resource.userPermissions.isAdmin;

    let defaultValue;
    if (isEditing) {
      defaultValue = reservationsToEdit.length ? reservationsToEdit[0].comments : '';
    } else {
      defaultValue = selectedReservations.length ? selectedReservations[0].comments : '';
    }

    const commentInput = (
      <Input
        defaultValue={defaultValue}
        label="Kommentit"
        placeholder="Varauksen mahdolliset lisätiedot"
        ref="commentInput"
        type="textarea"
      />
    );

    if (isEditing) {
      return (
        <div>
          <p><strong>Oletko varma että haluat muuttaa varaustasi?</strong></p>
          <p>Ennen muutoksia:</p>
          <ul>
            {map(reservationsToEdit, this.renderReservation)}
          </ul>
          <p>Muutosten jälkeen:</p>
          <ul>
            {map(selectedReservations, this.renderReservation)}
          </ul>
          {isAdmin && commentInput}
        </div>
      );
    }

    let loginMsg = null;
    if (!isLoggedIn) {
      loginMsg = <p>Varauksen vahvistamiseksi sinut ohjataan kirjautumissivulle.</p>;
    }

    return (
      <div>
        <p><strong>Oletko varma että haluat tehdä seuraavat varaukset?</strong></p>
        <ul>
          {map(selectedReservations, this.renderReservation)}
        </ul>
        {isAdmin && commentInput}
        {loginMsg}
      </div>
    );
  }

  renderReservation(reservation) {
    return (
      <li key={reservation.begin}>
        <TimeRange begin={reservation.begin} end={reservation.end} />
      </li>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      onClose,
      show,
    } = this.props;

    let buttonLabel;
    if (isMakingReservations) {
      buttonLabel = 'Tallennetaan...';
    } else if (isEditing) {
      buttonLabel = 'Tallenna';
    } else {
      buttonLabel = 'Tee varaus';
    }

    return (
      <Modal
        animation={false}
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Muutosten vahvistus' : 'Varauksen vahvistus'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderModalBody()}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={onClose}
          >
            Peruuta
          </Button>
          <Button
            bsStyle="primary"
            disabled={isMakingReservations}
            onClick={this.onConfirm}
          >
            {buttonLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ConfirmReservationModal.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ConfirmReservationModal;
