import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './components/Header';

const AdminContains = () => {
  const [contains, setContains] = useState([]);
  const [baskets, setBaskets] = useState([]); // For basket selection
  const [books, setBooks] = useState([]); // For book selection
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ BasketID: '', BookID: '', Number: '' });
  const [editingItem, setEditingItem] = useState(null); // Item currently being edited

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [containsRes, basketsRes, booksRes] = await Promise.all([
        axios.get('/admin/data/contains'),
      ]);

      setContains(containsRes.data);
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
      const response = await axios.post('/admin/data/contains/add', formData);
      alert('Item added successfully');
      setContains((prev) => [...prev, response.data]);
      setFormData({ BasketID: '', BookID: '', Number: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding item');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/data/contains/edit/${editingItem.BasketID}/${editingItem.BookID}`, formData);
      alert('Item updated successfully');
      setContains((prev) =>
        prev.map((item) =>
          item.BasketID === editingItem.BasketID && item.BookID === editingItem.BookID
            ? { ...item, ...formData }
            : item
        )
      );
      setEditingItem(null);
      setFormData({ BasketID: '', BookID: '', Number: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating item');
    }
  };

  const handleDeleteItem = async (basketID, bookID) => {
    try {
      await axios.delete(`/admin/data/contains/delete/${basketID}/${bookID}`);
      alert('Item deleted successfully');
      setContains((prev) => prev.filter((item) => item.BasketID !== basketID || item.BookID !== bookID));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting item');
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
   <><AdminHeader/> <div className="container mt-4">
   <h2>Manage Contains</h2>

   {error && <div className="alert alert-danger">{error}</div>}

   <form onSubmit={editingItem ? handleSaveEdit : handleAddItem} className="mb-4">
     <h5>{editingItem ? 'Edit Item' : 'Add New Item'}</h5>
     <div className="d-flex mb-3">
       <select
         className="form-control me-2"
         value={formData.BasketID}
         onChange={(e) => handleInputChange('BasketID', e.target.value)}
       >
         <option value="">Select Basket</option>
         {baskets.map((basket) => (
           <option key={basket.BasketID} value={basket.BasketID}>
             Basket #{basket.BasketID}
           </option>
         ))}
       </select>
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
       <input
         type="number"
         className="form-control me-2"
         placeholder="Quantity"
         value={formData.Number}
         onChange={(e) => handleInputChange('Number', e.target.value)}
       />
     </div>
     <button type="submit" className="btn btn-success">
       {editingItem ? 'Save Changes' : 'Add Item'}
     </button>
   </form>

   <table className="table table-bordered">
     <thead>
       <tr>
         <th>BasketID</th>
         <th>BookID</th>
         <th>Quantity</th>
         <th>Actions</th>
       </tr>
     </thead>
     <tbody>
       {contains.map((item) => (
         <tr key={`${item.BasketID}-${item.BookID}`}>
           <td>{item.BasketID}</td>
           <td>{item.BookID}</td>
           <td>{item.Number}</td>
           <td>
             <button
               onClick={() => handleEditItem(item)}
               className="btn btn-warning btn-sm me-2"
             >
               Edit
             </button>
             <button
               onClick={() => handleDeleteItem(item.BasketID, item.BookID)}
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

export default AdminContains;
