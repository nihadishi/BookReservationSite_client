import React, { useState } from "react";
import axios from "axios";
import CookiesCheck from "../controls/Cookies";
import Header from "../static/Header";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const GoDetail = (BookID) => {
    navigate(`/books/${BookID}`);
  };
  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search term");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`/books/search`, {
        params: { query },
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CookiesCheck>
      <Header />
      <div className="container mt-4">
        <h2>Search for Books</h2>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Book Name, Author, or Award"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        <div className="mt-3">
          {results.length > 0 ? (
            <ul className="list-group">
              {results.map((item) => (
                <li
                  key={item.BookID}
                  className="list-group-item"
                  onClick={() => {
                    GoDetail(item.BookID);
                  }}
                >
                  <h5>{item.Title}</h5>
                  <p>
                    Author: {item.AuthorName} <br />
                    Award: {item.AwardName || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p>No results found</p>
          )}
        </div>
      </div>
    </CookiesCheck>
  );
};

export default Search;
