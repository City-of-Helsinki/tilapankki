import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedResourcesSchema, resourceSchema } from 'middleware/Schemas';
import { createAction } from 'redux-actions';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

const clearResources = createAction(types.API.RESOURCES_CLEAR);

export default {
  fetchResource,
  fetchResources,
  clearResources,
};

function fetchResource(id, params = {}) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCE_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCE_GET_SUCCESS,
          { schema: resourceSchema }
        ),
        getErrorTypeDescriptor(types.API.RESOURCE_GET_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}`, params),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function fetchResources(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCES_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCES_GET_SUCCESS,
          { schema: paginatedResourcesSchema }
        ),
        getErrorTypeDescriptor(types.API.RESOURCES_GET_ERROR),
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
//      bailout: (state) => {
//        return !state.api.shouldFetch.resources;
//      },
    },
  };
}
