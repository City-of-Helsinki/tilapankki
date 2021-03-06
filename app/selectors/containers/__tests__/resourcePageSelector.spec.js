import { expect } from 'chai';

import indexBy from 'lodash/collection/indexBy';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import resourcePageSelector from 'selectors/containers/resourcePageSelector';

function getState(resources = [], units = []) {
  return {
    api: Immutable({
      activeRequests: [],
    }),
    auth: {
      token: null,
      userId: null,
    },
    data: Immutable({
      resources: indexBy(resources, 'id'),
      units: indexBy(units, 'id'),
    }),
  };
}

function getProps(id = 'some-id') {
  return {
    location: {
      query: {
        date: '2015-12-12',
      },
    },
    params: {
      id,
    },
  };
}

describe('Selector: resourcePageSelector', () => {
  it('should return the date in props.location.date', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);
    const expected = props.location.query.date;

    expect(selected.date).to.equal(expected);
  });

  it('should return the id in router.params.id', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);
    const expected = props.params.id;

    expect(selected.id).to.equal(expected);
  });

  it('should return isFetchingResource', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.isFetchingResource).to.exist;
  });

  it('should return isLoggedIn', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.isLoggedIn).to.exist;
  });

  it('should return resource', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.resource).to.exist;
  });

  it('should return the unit corresponding to the resource.unit', () => {
    const unit = Unit.build();
    const resource = Resource.build({ unit: unit.id });
    const state = getState([resource], [unit]);
    const props = getProps(resource.id);
    const selected = resourcePageSelector(state, props);

    expect(selected.unit).to.deep.equal(unit);
  });

  it('should return an empty object as the unit if unit with the given id is not fetched', () => {
    const resource = Resource.build();
    const state = getState([resource], []);
    const props = getProps(resource.id);
    const selected = resourcePageSelector(state, props);

    expect(selected.unit).to.deep.equal({});
  });

  it('should return an empty object as the unit if resource is not fetched', () => {
    const state = getState([], []);
    const props = getProps('unfetched-id');
    const selected = resourcePageSelector(state, props);

    expect(selected.unit).to.deep.equal({});
  });
});
