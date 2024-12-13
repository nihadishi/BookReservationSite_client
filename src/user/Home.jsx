import React, { useEffect, useState } from 'react';
import CookiesCheck from '../controls/Cookies';
import Header from '../static/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const GoDetail = (BookID) => {
    navigate(`/books/${BookID}`);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books'); // Replace with your API endpoint
        setBooks(response.data);
        console.log(response.data);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <CookiesCheck>
      <Header />
      <div className="container mt-5">
        <h1>Book List</h1>
        <div className="row">
          {books.map((book) => (
            <div key={book.BookID} className="col-md-4 mb-4" onClick={()=>{GoDetail(book.BookID)}}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{book.Title}</h5>
                  <p className="card-text">
                    Category: {book.Category}
                    <br />
                    Price: ${book.Price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CookiesCheck>
  );
};

export default Home;
