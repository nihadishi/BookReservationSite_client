import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './components/Header';

const AdminAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ Name: '', Address: '', URL: '' });
  const [editingAuthor, setEditingAuthor] = useState(null); // Author currently being edited

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('/admin/data/authors');
      setAuthors(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching authors');
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

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/data/authors/add', formData);
      alert('Author added successfully');
      setAuthors((prev) => [...prev, response.data]);
      setFormData({ Name: '', Address: '', URL: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding author');
    }
  };

  const handleEditAuthor = (author) => {
    setEditingAuthor(author);
    setFormData(author);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/data/authors/edit/${editingAuthor.AuthorID}`, formData);
      alert('Author updated successfully');
      setAuthors((prev) =>
        prev.map((author) =>
          author.AuthorID === editingAuthor.AuthorID ? { ...author, ...formData } : author
        )
      );
      setEditingAuthor(null);
      setFormData({ Name: '', Address: '', URL: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating author');
    }
  };

  const handleDeleteAuthor = async (id) => {
    try {
      await axios.delete(`/admin/data/authors/delete/${id}`);
      alert('Author deleted successfully');
      setAuthors((prev) => prev.filter((author) => author.AuthorID !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting author');
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
    <>
    <AdminHeader/>
    <div className="container mt-4">
      <h2>Manage Authors</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={editingAuthor ? handleSaveEdit : handleAddAuthor} className="mb-4">
        <h5>{editingAuthor ? 'Edit Author' : 'Add New Author'}</h5>
        <div className="d-flex mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Name"
            value={formData.Name}
            onChange={(e) => handleInputChange('Name', e.target.value)}
          />
          <input
            type="text"
            className="form-control me-2"
            placeholder="Address"
            value={formData.Address}
            onChange={(e) => handleInputChange('Address', e.target.value)}
          />
          <input
            type="text"
            className="form-control me-2"
            placeholder="URL"
            value={formData.URL}
            onChange={(e) => handleInputChange('URL', e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">
          {editingAuthor ? 'Save Changes' : 'Add Author'}
        </button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>AuthorID</th>
            <th>Name</th>
            <th>Address</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.AuthorID}>
              <td>{author.AuthorID}</td>
              <td>{author.Name}</td>
              <td>{author.Address}</td>
              <td>{author.URL || 'N/A'}</td>
              <td>
                <button
                  onClick={() => handleEditAuthor(author)}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAuthor(author.AuthorID)}
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

export default AdminAuthors;
