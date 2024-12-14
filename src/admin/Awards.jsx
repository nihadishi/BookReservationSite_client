import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './components/Header';

const AdminAwards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ Name: '', Year: '' });
  const [editingAward, setEditingAward] = useState(null); // Award currently being edited

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await axios.get('/admin/data/awards');
      setAwards(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching awards');
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

  const handleAddAward = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/data/awards/add', formData);
      alert('Award added successfully');
      setAwards((prev) => [...prev, response.data]);
      setFormData({ Name: '', Year: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding award');
    }
  };

  const handleEditAward = (award) => {
    setEditingAward(award);
    setFormData(award);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/data/awards/edit/${editingAward.AwardID}`, formData);
      alert('Award updated successfully');
      setAwards((prev) =>
        prev.map((award) =>
          award.AwardID === editingAward.AwardID ? { ...award, ...formData } : award
        )
      );
      setEditingAward(null);
      setFormData({ Name: '', Year: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating award');
    }
  };

  const handleDeleteAward = async (id) => {
    try {
      await axios.delete(`/admin/data/awards/delete/${id}`);
      alert('Award deleted successfully');
      setAwards((prev) => prev.filter((award) => award.AwardID !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting award');
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
    <h2>Manage Awards</h2>

    {error && <div className="alert alert-danger">{error}</div>}

    <form onSubmit={editingAward ? handleSaveEdit : handleAddAward} className="mb-4">
      <h5>{editingAward ? 'Edit Award' : 'Add New Award'}</h5>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Name"
          value={formData.Name}
          onChange={(e) => handleInputChange('Name', e.target.value)}
        />
        <input
          type="number"
          className="form-control me-2"
          placeholder="Year"
          value={formData.Year}
          onChange={(e) => handleInputChange('Year', e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-success">
        {editingAward ? 'Save Changes' : 'Add Award'}
      </button>
    </form>

    <table className="table table-bordered">
      <thead>
        <tr>
          <th>AwardID</th>
          <th>Name</th>
          <th>Year</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {awards.map((award) => (
          <tr key={award.AwardID}>
            <td>{award.AwardID}</td>
            <td>{award.Name}</td>
            <td>{award.Year}</td>
            <td>
              <button
                onClick={() => handleEditAward(award)}
                className="btn btn-warning btn-sm me-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAward(award.AwardID)}
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

export default AdminAwards;
