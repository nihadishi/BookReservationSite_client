import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Detail = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null); // Selected warehouse
  const [count, setCount] = useState(1); // State to track selected count
  const navigate = useNavigate();

  const authToken = Cookies.get('authToken'); // Assuming authToken contains CustomerID or token

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/books/${id}`);
        setBook(response.data);
        // Set default warehouse as the first available
        if (response.data.Warehouses.length > 0) {
          setSelectedWarehouse(response.data.Warehouses[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleAddToBasket = async () => {
    try {
      if (!selectedWarehouse) {
        alert('Please select a warehouse');
        return;
      }

      const response = await axios.post(
        '/books/basket/add',
        {
          BookID: book.BookID,
          WarehouseID: selectedWarehouse.WarehouseID,
          Count: count,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }, // Pass token for authentication
        }
      );
      alert(`${book.Title} added to your basket from ${selectedWarehouse.Address}!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding book to basket');
    }
  };

  const handleWarehouseChange = (e) => {
    const warehouse = book.Warehouses.find(
      (wh) => wh.WarehouseID === parseInt(e.target.value)
    );
    setSelectedWarehouse(warehouse);
    setCount(1); // Reset count to default when warehouse changes
  };

  const handleCountChange = (e) => {
    const value = Math.min(Number(e.target.value), selectedWarehouse?.Stock || 1);
    setCount(value > 0 ? value : 1);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container mt-4">
      {book ? (
        <>
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title">{book.Title}</h2>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Book Details Section */}
                <div className="col-md-8 mb-3">
                  <h5>Details</h5>
                  <p><strong>Category:</strong> {book.Category}</p>
                  <p><strong>Price:</strong> ${book.Price}</p>
                  <p><strong>Author:</strong> {book.AuthorName || 'Unknown'}</p>
                  <p><strong>Award:</strong> {book.AwardName || 'None'}</p>
                  <p><strong>Year:</strong> {book.Year}</p>
                  <p><strong>ISBN:</strong> {book.ISBN}</p>
                </div>

                {/* Stock and Warehouse Section */}
                <div className="col-md-4">
                  <h5>Warehouse Stock</h5>
                  {book.Warehouses.length > 0 ? (
                    <>
                      <select
                        className="form-select mb-3"
                        onChange={handleWarehouseChange}
                        value={selectedWarehouse?.WarehouseID || ''}
                      >
                        {book.Warehouses.map((warehouse) => (
                          <option
                            key={warehouse.WarehouseID}
                            value={warehouse.WarehouseID}
                          >
                            {warehouse.Address} ({warehouse.Stock} in stock)
                          </option>
                        ))}
                      </select>
                      <div className="d-flex align-items-center">
                        <input
                          type="number"
                          min="1"
                          max={selectedWarehouse?.Stock || 1}
                          value={count}
                          onChange={handleCountChange}
                          className="form-control me-2"
                          style={{ width: '100px' }}
                        />
                        <button onClick={handleAddToBasket} className="btn btn-success">
                          Add to Basket
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-danger">No stock available in any warehouse</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleBack} className="btn btn-secondary mt-4">
            Back to List
          </button>
        </>
      ) : (
        <div className="alert alert-warning mt-4">Book details not available.</div>
      )}
    </div>
  );
};

export default Detail;
