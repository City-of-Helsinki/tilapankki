import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

const cancelReservationEdit = createAction(types.UI.CANCEL_RESERVATION_EDIT);

const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

const clearReservations = createAction(types.UI.CLEAR_RESERVATIONS);

const closeDeleteReservationModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.DELETE_RESERVATION
);

const closeConfirmReservationModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.CONFIRM_RESERVATION
);

const openReservationDeleteModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.DELETE_RESERVATION
);

const openConfirmReservationModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.CONFIRM_RESERVATION
);

const selectReservationToDelete = createAction(
  types.UI.SELECT_RESERVATION_TO_DELETE
);

const selectReservationToEdit = createAction(
  types.UI.SELECT_RESERVATION_TO_EDIT
);

const toggleTimeSlot = createAction(types.UI.TOGGLE_TIME_SLOT);

export default {
  cancelReservationEdit,
  changeSearchFilters,
  clearReservations,
  closeDeleteReservationModal,
  closeConfirmReservationModal,
  openReservationDeleteModal,
  openConfirmReservationModal,
  selectReservationToDelete,
  selectReservationToEdit,
  toggleTimeSlot,
};
