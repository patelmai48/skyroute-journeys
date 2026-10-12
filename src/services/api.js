export * from '../api';
import {
  api,
  fetchFlights,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  createBooking as postBookingToServer,
  fetchBookings as fetchServerBookings,
  fetchBooking,
  cancelBooking as cancelServerBooking,
} from '../api';

export {
  api,
  fetchFlights,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  postBookingToServer,
  fetchServerBookings,
  fetchBooking,
  cancelServerBooking,
};
