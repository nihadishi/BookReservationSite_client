import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CookiesCheck from '../controls/Cookies';
import Header from '../static/Header';
import Cookies from 'js-cookie';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/reservations', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setReservations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleUpdateStatus = async (reservationID, status) => {
    try {
      const response = await axios.put(
        `/reservations/${reservationID}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      alert(response.data.message);
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.ReservationID === reservationID
            ? { ...reservation, Status: status }
            : reservation
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating reservation status');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <CookiesCheck>
      <Header />
      <div className="container mt-4">
        <h2>Your Reservations</h2>
        {reservations.length === 0 ? (
          <div className="alert alert-info mt-4">No reservations found.</div>
        ) : (
          reservations.map((reservation) => (
            <div key={reservation.ReservationID} className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5>Reservation #{reservation.ReservationID}</h5>
                <p>Date: {reservation.ReservationDate}</p>
                <p>Pickup Time: {reservation.PickupTime}</p>
                <p>Status: <span className={`badge bg-${getStatusClass(reservation.Status)}`}>{reservation.Status}</span></p>
              </div>
              <div className="card-body">
                <h6>Book Details</h6>
                <ul className="list-group mb-3">
                  <li className="list-group-item">
                    <strong>Title:</strong> {reservation.BookTitle}
                  </li>
                  <li className="list-group-item">
                    <strong>Category:</strong> {reservation.Category}
                  </li>
                  <li className="list-group-item">
                    <strong>ISBN:</strong> {reservation.ISBN}
                  </li>
                  <li className="list-group-item">
                    <strong>Price:</strong> ${reservation.Price}
                  </li>
                </ul>
                {/* Action Buttons */}
                <button
                  onClick={() => handleUpdateStatus(reservation.ReservationID, 'Cancelled')}
                  className="btn btn-danger"
                  disabled={reservation.Status !== 'Pending'}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </CookiesCheck>
  );

  function getStatusClass(status) {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'warning';
    }
  }
};

export default Reservation;
