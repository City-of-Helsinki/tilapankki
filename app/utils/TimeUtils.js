import forEach from 'lodash/collection/forEach';
import map from 'lodash/collection/map';
import moment from 'moment';
import 'moment-range';

import { DATE_FORMAT, TIME_FORMAT } from 'constants/AppConstants';

export default {
  addToDate,
  getDateStartAndEndTimes,
  getDateString,
  formatDateString,
  getTimeSlots,
};

function addToDate(date, daysToIncrement) {
  const newDate = moment(date).add(daysToIncrement, 'days');

  return newDate.format(DATE_FORMAT);
}

function getDateStartAndEndTimes(date) {
  if (!date) {
    return {};
  }

  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59Z`;

  return { start, end };
}

function formatDateString(date) {
  return moment(date).format(DATE_FORMAT);
}

function getDateString(date) {
  if (!date) {
    return formatDateString(moment());
  }

  return date;
}

function getTimeSlots(start, end, period = '00:30:00', reservations = [], reservationsToEdit = []) {
  if (!start || !end) {
    return [];
  }

  const range = moment.range(moment.utc(start), moment.utc(end));
  const duration = moment.duration(period);
  const reservationRanges = map(reservations, reservation => {
    return moment.range(moment(reservation.begin), moment(reservation.end));
  });
  const editRanges = map(reservationsToEdit, reservation => {
    return moment.range(moment(reservation.begin), moment(reservation.end));
  });
  const slots = [];

  range.by(duration, (startMoment) => {
    const startUTC = moment.utc(startMoment);
    const endUTC = moment.utc(startMoment).add(duration);
    const startLocal = startUTC.local();
    const endLocal = endUTC.local();

    const asISOString = `${startUTC.toISOString()}/${endUTC.toISOString()}`;
    const asString = `${startLocal.format(TIME_FORMAT)}\u2013${endLocal.format(TIME_FORMAT)}`;

    const slotRange = moment.range(startLocal, endLocal);
    const editing = editRanges.some(
      editRange => editRange.overlaps(slotRange)
    );

    let reserved = false;
    let reservation = null;
    let reservationStarting = false;
    let reservationEnding = false;
    forEach(reservationRanges, (reservationRange, index) => {
      if (reservationRange.overlaps(slotRange)) {
        reserved = true;
        reservation = reservations[index];
        const [ reservationStart, reservationEnd ] = reservationRange.toDate();
        const [ slotStart, slotEnd ] = slotRange.toDate();
        reservationStarting = reservationStart.getTime() === slotStart.getTime();
        reservationEnding = reservationEnd.getTime() === slotEnd.getTime();
      }
    });

    slots.push({
      asISOString,
      asString,
      editing,
      reservation,
      reservationStarting,
      reservationEnding,
      reserved,
      start: startUTC.toISOString(),
      end: endUTC.toISOString(),
    });
  }, true);

  return slots;
}
