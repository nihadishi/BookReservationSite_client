import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CookiesCheck from '../controls/Cookies';
import Cookies from 'js-cookie';
import Header from '../static/Header';
import ChooseReservation from '../static/ChooseReservation';

const Basket = () => {
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationBasketID, setReservationBasketID] = useState(null); // Track the current basket for reservation
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    const fetchBaskets = async () => {
      try {
        const response = await axios.get('/books/baskets', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setBaskets(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching baskets');
      } finally {
        setLoading(false);
      }
    };

    fetchBaskets();
  }, []);

  const handleOpenReservationModal = (basketID) => {
    setReservationBasketID(basketID);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReservationBasketID(null);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <CookiesCheck>
      <Header />
      <div className="container mt-4">
        <h2>Your Baskets</h2>
        {baskets.length === 0 ? (
         <div
         className="d-flex justify-content-center align-items-center vh-100"
         style={{ width: '100%' }}
       >
         <div
           className="alert alert-info text-center"
           style={{ width: '200px' }}
         >
           You don't have any baskets. Continue to shopping, it will created automatically
         </div>
       </div>
        ) : (
          baskets.map((basket) => (
            <div key={basket.BasketID} className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5>Basket #{basket.BasketID}</h5>
                <p>Order Date: {basket.OrderDate}</p>
              </div>
              <div className="card-body">
                {basket.Books.length > 0 ? (
                  <ul className="list-group mb-3">
                    {basket.Books.map((book) => (
                      <li
                        key={book.BookID}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{book.Title}</strong> <br />
                          <span>Category: {book.Category}</span> <br />
                          <span>ISBN: {book.ISBN}</span>
                        </div>
                        <div>
                          <span>Price: ${book.Price}</span> <br />
                          <span>Quantity: {book.Quantity}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No books in this basket.</p>
                )}
                {/* Reservation Button */}
                <button
                  onClick={() => handleOpenReservationModal(basket.BasketID)}
                  className="btn btn-success"
                >
                  Reserve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showModal && (
        <ChooseReservation
          basketID={reservationBasketID}
          onClose={handleCloseModal}
        />
      )}
    </CookiesCheck>
  );
};

export default Basket;
