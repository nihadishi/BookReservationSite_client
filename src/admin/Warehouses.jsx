import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "./components/Header";

const AdminWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    Address: "",
    Phone: "",
    Code: "",
  });
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get("/admin/data/warehouses");
      setWarehouses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching warehouses");
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

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/data/warehouses/add", formData);
      alert("Warehouse added successfully");
      setWarehouses((prev) => [...prev, response.data]);
      setFormData({ Address: "", Phone: "", Code: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error adding warehouse");
    }
  };

  const handleEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData(warehouse);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/admin/data/warehouses/edit/${editingWarehouse.WarehouseID}`,
        formData
      );
      alert("Warehouse updated successfully");
      setWarehouses((prev) =>
        prev.map((warehouse) =>
          warehouse.WarehouseID === editingWarehouse.WarehouseID
            ? { ...warehouse, ...formData }
            : warehouse
        )
      );
      setEditingWarehouse(null);
      setFormData({ Address: "", Phone: "", Code: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error updating warehouse");
    }
  };

  const handleDeleteWarehouse = async (id) => {
    try {
      await axios.delete(`/admin/data/warehouses/delete/${id}`);
      alert("Warehouse deleted successfully");
      setWarehouses((prev) =>
        prev.filter((warehouse) => warehouse.WarehouseID !== id)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting warehouse");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="container mt-4">
        <h2>Manage Warehouses</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={editingWarehouse ? handleSaveEdit : handleAddWarehouse}
          className="mb-4"
        >
          <h5>{editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}</h5>
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Address"
              value={formData.Address}
              onChange={(e) => handleInputChange("Address", e.target.value)}
            />
            <input
              type="text"
              className="form-control me-2"
              placeholder="Phone"
              value={formData.Phone}
              onChange={(e) => handleInputChange("Phone", e.target.value)}
            />
            <input
              type="text"
              className="form-control me-2"
              placeholder="Code"
              value={formData.Code}
              onChange={(e) => handleInputChange("Code", e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success">
            {editingWarehouse ? "Save Changes" : "Add Warehouse"}
          </button>
        </form>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>WarehouseID</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr key={warehouse.WarehouseID}>
                <td>{warehouse.WarehouseID}</td>
                <td>{warehouse.Address}</td>
                <td>{warehouse.Phone}</td>
                <td>{warehouse.Code}</td>
                <td>
                  <button
                    onClick={() => handleEditWarehouse(warehouse)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteWarehouse(warehouse.WarehouseID)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminWarehouses;
