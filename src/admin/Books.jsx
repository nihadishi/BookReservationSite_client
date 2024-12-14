import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './components/Header';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ Title: '', Year: '', Price: '', ISBN: '', Category: '' });
  const [editingBook, setEditingBook] = useState(null); // Book currently being edited

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/admin/data/books');
      setBooks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/data/books/add', formData);
      alert('Book added successfully');
      setBooks((prev) => [...prev, response.data]);
      setFormData({ Title: '', Year: '', Price: '', ISBN: '', Category: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding book');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData(book);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/data/books/edit/${editingBook.BookID}`, formData);
      alert('Book updated successfully');
      setBooks((prev) =>
        prev.map((book) => (book.BookID === editingBook.BookID ? { ...book, ...formData } : book))
      );
      setEditingBook(null);
      setFormData({ Title: '', Year: '', Price: '', ISBN: '', Category: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating book');
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`/admin/data/books/delete/${id}`);
      alert('Book deleted successfully');
      setBooks((prev) => prev.filter((book) => book.BookID !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting book');
    }
  };

  if (loading) {
    return (
      <><AdminHeader/><div className="text-center mt-5">
      <div className="spinner-border" role="status" />
    </div></>
    );
  }

  return (
    <><AdminHeader/><div className="container mt-4">
    <h2>Manage Books</h2>

    {error && <div className="alert alert-danger">{error}</div>}

    <form onSubmit={editingBook ? handleSaveEdit : handleAddBook} className="mb-4">
      <h5>{editingBook ? 'Edit Book' : 'Add New Book'}</h5>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Title"
          value={formData.Title}
          onChange={(e) => handleInputChange('Title', e.target.value)}
        />
        <input
          type="number"
          className="form-control me-2"
          placeholder="Year"
          value={formData.Year}
          onChange={(e) => handleInputChange('Year', e.target.value)}
        />
        <input
          type="number"
          className="form-control me-2"
          placeholder="Price"
          value={formData.Price}
          onChange={(e) => handleInputChange('Price', e.target.value)}
        />
        <input
          type="text"
          className="form-control me-2"
          placeholder="ISBN"
          value={formData.ISBN}
          onChange={(e) => handleInputChange('ISBN', e.target.value)}
        />
        <input
          type="text"
          className="form-control me-2"
          placeholder="Category"
          value={formData.Category}
          onChange={(e) => handleInputChange('Category', e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-success">
        {editingBook ? 'Save Changes' : 'Add Book'}
      </button>
    </form>

    <table className="table table-bordered">
      <thead>
        <tr>
          <th>BookID</th>
          <th>Title</th>
          <th>Year</th>
          <th>Price</th>
          <th>ISBN</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.BookID}>
            <td>{book.BookID}</td>
            <td>{book.Title}</td>
            <td>{book.Year}</td>
            <td>${book.Price}</td>
            <td>{book.ISBN}</td>
            <td>{book.Category}</td>
            <td>
              <button
                onClick={() => handleEditBook(book)}
                className="btn btn-warning btn-sm me-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteBook(book.BookID)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div></>
  );
};

export default AdminBooks;
