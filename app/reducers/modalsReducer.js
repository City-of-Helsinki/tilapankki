import without from 'lodash/array/without';
import includes from 'lodash/collection/includes';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  open: [],
});

function modalsReducer(state = initialState, action) {
  let modal;

  switch (action.type) {

  case types.UI.CLOSE_MODAL:
    modal = action.payload;

    if (includes(state.open, modal)) {
      return state.merge({ open: without(state.open, modal) });
    }

    return state;

  case types.UI.OPEN_MODAL:
    modal = action.payload;

    if (includes(state.open, modal)) {
      return state;
    }

    return state.merge({ open: [...state.open, modal] });

  default:
    return state;
  }
}

export default modalsReducer;
