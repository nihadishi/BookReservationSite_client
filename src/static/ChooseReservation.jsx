import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChooseReservation = ({ basketID, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const authToken = Cookies.get('authToken');
    console.log('BasketID',basketID);
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !time) {
      setMessage('Please select a date and time');
      return;
    }

    try {
      const response = await axios.post(
        '/reservations/create',
        {
          BasketID: basketID,
          ReservationDate: date,
          PickupTime: time,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessage(response.data.message);
      alert('Reservation created successfully!');
      onClose();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating reservation');
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Choose Reservation Time</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Reservation Date</label>
                <input
                  type="date"
                  id="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="time" className="form-label">Pickup Time</label>
                <input
                  type="time"
                  id="time"
                  className="form-control"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              {message && <div className="alert alert-info">{message}</div>}
              <button type="submit" className="btn btn-primary w-100">Confirm Reservation</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseReservation;
