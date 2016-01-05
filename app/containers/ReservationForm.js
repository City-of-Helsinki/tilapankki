import forEach from 'lodash/collection/forEach';
import rest from 'lodash/array/rest';
import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { addNotification } from 'actions/notificationsActions';
import {
  deleteReservation,
  postReservation,
  putReservation,
} from 'actions/reservationActions';
import {
  cancelReservationEdit,
  clearReservations,
  closeConfirmReservationModal,
  openConfirmReservationModal,
  openReservationDeleteModal,
  selectReservationToDelete,
  selectReservationToEdit,
  toggleTimeSlot,
} from 'actions/uiActions';
import DateHeader from 'components/common/DateHeader';
import ConfirmReservationModal from 'components/reservation/ConfirmReservationModal';
import ReservationFormControls from 'components/reservation/ReservationFormControls';
import TimeSlots from 'components/reservation/TimeSlots';
import ReservationDeleteModal from 'containers/ReservationDeleteModal';
import reservationFormSelector from 'selectors/containers/reservationFormSelector';

export class UnconnectedReservationForm extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.handleReservation = this.handleReservation.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.clearReservations();
  }

  onDateChange(newDate) {
    const { actions, id } = this.props;
    actions.updatePath(`/resources/${id}/reservation?date=${newDate}`);
  }

  handleEdit(values = {}) {
    const {
      actions,
      reservationsToEdit,
      selectedReservations,
    } = this.props;

    if (selectedReservations.length) {
      // Edit the first selected reservation.
      actions.putReservation(Object.assign(
        {},
        selectedReservations[0],
        values,
        { url: reservationsToEdit[0].url }
      ));

      // Add new reservations if needed.
      // FIXME: This is very hacky and not bulletproof but use cases where user splits
      // one reservation into multiple reservations should be pretty rare.
      // Try to use something sequential in the future.
      // Use timeout to allow the PUT request to go through first and possibly free previously
      // reserved time slots.
      setTimeout(() => {
        forEach(rest(selectedReservations), (reservation) => {
          actions.postReservation(
            Object.assign({}, reservation, values)
          );
        });
      }, 800);
    } else {
      // Delete the edited reservation if no time slots were selected.
      forEach(reservationsToEdit, (reservation) => {
        actions.deleteReservation(reservation);
      });
    }
  }

  handleEditCancel() {
    this.props.actions.cancelReservationEdit();
  }

  handleReservation(values = {}) {
    const { actions, selectedReservations, isLoggedIn, id } = this.props;

    if (isLoggedIn) {
      selectedReservations.forEach(reservation => {
        actions.postReservation(
          Object.assign({}, reservation, values)
        );
      });
    } else {
      const pendingReservation = {
        selectedReservations,
        values,
      };
      localStorage.setItem('pendingReservation', JSON.stringify(pendingReservation));
      window.location.replace(`${window.location.origin}/login/helsinki/initiate/resources/${id}`);
    }
  }

  render() {
    const {
      actions,
      confirmReservationModalIsOpen,
      date,
      isFetchingResource,
      isLoggedIn,
      isMakingReservations,
      reservationsToEdit,
      resource,
      selected,
      selectedReservations,
      time,
      timeSlots,
      urlHash,
    } = this.props;
    const isEditing = Boolean(reservationsToEdit.length);

    const controls = (
      <ReservationFormControls
        addNotification={actions.addNotification}
        disabled={!resource.userPermissions.canMakeReservations || !selected.length || isMakingReservations}
        isEditing={isEditing}
        isLoggedIn={isLoggedIn}
        isMakingReservations={isMakingReservations}
        onCancel={this.handleEditCancel}
        onClick={actions.openConfirmReservationModal}
        resource={resource}
      />);

    return (
      <div>
        {controls}
        <TimeSlots
          addNotification={actions.addNotification}
          isEditing={isEditing}
          isFetching={isFetchingResource}
          isLoggedIn={isLoggedIn}
          onClick={actions.toggleTimeSlot}
          openReservationDeleteModal={actions.openReservationDeleteModal}
          updatePath={actions.updatePath}
          resource={resource}
          selected={selected}
          selectReservationToDelete={actions.selectReservationToDelete}
          selectReservationToEdit={actions.selectReservationToEdit}
          slots={timeSlots}
          time={time}
        />
        {controls}
        <ConfirmReservationModal
          isEditing={isEditing}
          isMakingReservations={isMakingReservations}
          isLoggedIn={isLoggedIn}
          onClose={actions.closeConfirmReservationModal}
          onConfirm={isEditing ? this.handleEdit : this.handleReservation}
          reservationsToEdit={reservationsToEdit}
          resource={resource}
          selectedReservations={selectedReservations}
          show={confirmReservationModalIsOpen}
        />
        <ReservationDeleteModal />
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  actions: PropTypes.object.isRequired,
  confirmReservationModalIsOpen: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  time: PropTypes.string,
  timeSlots: PropTypes.array.isRequired,
  urlHash: PropTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    clearReservations,
    closeConfirmReservationModal,
    deleteReservation,
    openConfirmReservationModal,
    openReservationDeleteModal,
    postReservation,
    updatePath,
    putReservation,
    selectReservationToDelete,
    selectReservationToEdit,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationFormSelector, mapDispatchToProps)(UnconnectedReservationForm);
