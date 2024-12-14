import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminEdit = ({ type, id, currentData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(currentData); // Populate with existing data
  }, [currentData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/data/${type}/edit/${id}`, formData);
      alert(`${type.slice(0, -1)} updated successfully`);
      onUpdate(); // Trigger a refresh in the parent component
      onClose(); // Close the edit modal
    } catch (err) {
      alert(err.response?.data?.message || `Error updating ${type.slice(0, -1)}`);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit {type.slice(0, -1)}</h5>
            <button onClick={onClose} className="btn-close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {Object.keys(currentData).map((key) => (
                <div key={key} className="mb-3">
                  <label className="form-label">{key}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary w-100">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEdit;
