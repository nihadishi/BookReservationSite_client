import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './components/Header';

const AdminInventories = () => {
  const [inventory, setInventory] = useState([]);
  const [books, setBooks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ BookID: '', WarehouseID: '', Number: '' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [inventoryRes, booksRes, warehousesRes] = await Promise.all([
        axios.get('/admin/data/inventories'),
        axios.get('/admin/data/books'),
        axios.get('/admin/data/warehouses'),
      ]);

      setInventory(inventoryRes.data);
      setBooks(booksRes.data);
      setWarehouses(warehousesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
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

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/data/inventories/add', formData);
      alert('Inventory added successfully');
      setInventory((prev) => [...prev, response.data]);
      setFormData({ BookID: '', WarehouseID: '', Number: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding inventory');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/data/inventories/edit/${editingItem.BookID}/${editingItem.WarehouseID}`, formData);
      alert('Inventory updated successfully');
      setInventory((prev) =>
        prev.map((item) =>
          item.BookID === editingItem.BookID && item.WarehouseID === editingItem.WarehouseID
            ? { ...item, ...formData }
            : item
        )
      );
      setEditingItem(null);
      setFormData({ BookID: '', WarehouseID: '', Number: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating inventory');
    }
  };

  const handleDeleteItem = async (bookID, warehouseID) => {
    try {
      await axios.delete(`/admin/data/inventories/delete/${bookID}/${warehouseID}`);
      alert('Inventory deleted successfully');
      setInventory((prev) => prev.filter((item) => item.BookID !== bookID || item.WarehouseID !== warehouseID));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting inventory');
    }
  };

  const getBookTitle = (id) => {
    const book = books.find((b) => b.BookID === id);
    return book ? book.Title : 'Unknown Book';
  };

  const getWarehouseAddress = (id) => {
    const warehouse = warehouses.find((w) => w.WarehouseID === id);
    return warehouse ? warehouse.Address : 'Unknown Warehouse';
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
        <h2>Manage Inventory</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={editingItem ? handleSaveEdit : handleAddItem} className="mb-4">
          <h5>{editingItem ? 'Edit Inventory' : 'Add New Inventory'}</h5>
          <div className="d-flex mb-3">
            <select
              className="form-control me-2"
              value={formData.BookID}
              onChange={(e) => handleInputChange('BookID', e.target.value)}
            >
              <option value="">Select Book</option>
              {books.map((book) => (
                <option key={book.BookID} value={book.BookID}>
                  {book.Title}
                </option>
              ))}
            </select>
            <select
              className="form-control me-2"
              value={formData.WarehouseID}
              onChange={(e) => handleInputChange('WarehouseID', e.target.value)}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.WarehouseID} value={warehouse.WarehouseID}>
                  {warehouse.Address}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="form-control me-2"
              placeholder="Quantity"
              value={formData.Number}
              onChange={(e) => handleInputChange('Number', e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success">
            {editingItem ? 'Save Changes' : 'Add Inventory'}
          </button>
        </form>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Book</th>
              <th>Warehouse</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={`${item.BookID}-${item.WarehouseID}`}>
                <td>{getBookTitle(item.BookID)}</td>
                <td>{getWarehouseAddress(item.WarehouseID)}</td>
                <td>{item.Number}</td>
                <td>
                  <button
                    onClick={() => handleEditItem(item)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.BookID, item.WarehouseID)}
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

export default AdminInventories;
