import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Drugs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Drugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [newDrug, setNewDrug] = useState({
    drugName: '',
    location: '',
    Cost: '',
    CapsulesPerPack: '',
    Company: '',
    image: null,
  });
  const [view, setView] = useState('');
  const [drugToUpdate, setDrugToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Create refs for each section
  const addRef = useRef(null);
  const updateRef = useRef(null);
  const deleteRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/drugs');
      setDrugs(response.data);
    } catch (error) {
      console.error('Error fetching drugs:', error);
      toast.error('Failed to fetch drugs.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDrug({ ...newDrug, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewDrug({ ...newDrug, image: e.target.files[0] });
  };

  const handleAddDrug = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newDrug).forEach((key) => {
      formData.append(key, key === 'location' ? JSON.stringify(newDrug[key].split(',')) : newDrug[key]);
    });

    try {
      await axios.post('http://localhost:3000/drugs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchDrugs();
      toast.success('Drug added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error adding drug:', error);
      toast.error('Failed to add drug.');
    }
  };

  const handleUpdateDrug = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    Object.keys(newDrug).forEach((key) => {
      if (key === 'location') {
        // Only apply split if it's a string
        if (typeof newDrug[key] === 'string') {
          formData.append(key, JSON.stringify(newDrug[key].split(',')));
        } else {
          formData.append(key, JSON.stringify(newDrug[key]));
        }
      } else if (key === 'image' && newDrug.image) {
        formData.append(key, newDrug.image);
      } else {
        // Ensure other fields are appended correctly without calling split
        formData.append(key, newDrug[key]);
      }
    });
  
    try {
      const response = await axios.put(`http://localhost:3000/drugs/${drugToUpdate.drugName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Update Response:', response.data);
      fetchDrugs();
      toast.success('Drug updated successfully!');
      resetForm();
    } catch (error) {
      console.error('Error updating drug:', error);
      toast.error('Failed to update drug: ' + (error.response?.data?.message || 'Unknown error.'));
    }
  };
  
  const handleDeleteDrug = async (drugName) => {
    try {
      await axios.delete(`http://localhost:3000/drugs/${drugName}`);
      fetchDrugs();
      toast.success('Drug deleted successfully!');
    } catch (error) {
      console.error('Error deleting drug:', error);
      toast.error('Failed to delete drug.');
    }
  };

  const handleSelectDrugForUpdate = (drug) => {
    setNewDrug(drug);
    setDrugToUpdate(drug);
    setView('add');
  };

  const resetForm = () => {
    setNewDrug({
      drugName: '',
      location: '',
      Cost: '',
      CapsulesPerPack: '',
      Company: '',
      image: null,
    });
    setDrugToUpdate(null);
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="drugs-container">
      <ToastContainer />
      <div className="actions-container">
        <button onClick={() => { setView('add'); scrollToSection(addRef); }} className="action-button">Add</button>
        <button onClick={() => { setView('update'); scrollToSection(updateRef); }} className="action-button">Update</button>
        <button onClick={() => { setView('delete'); scrollToSection(deleteRef); }} className="action-button">Delete</button>
        <button onClick={() => { setView('view'); scrollToSection(viewRef); }} className="action-button">View All</button>
      </div>

      {/* Add Drug Section */}
      <div ref={addRef}>
        {view === 'add' && (
          <form onSubmit={drugToUpdate ? handleUpdateDrug : handleAddDrug} className="drugs-form">
            <input type="text" name="drugName" placeholder="Drug Name" required value={newDrug.drugName} onChange={handleInputChange} />
            <input type="text" name="location" placeholder="Location (comma-separated)" required value={newDrug.location} onChange={handleInputChange} />
            <input type="number" name="Cost" placeholder="Cost" required value={newDrug.Cost} onChange={handleInputChange} />
            <input type="number" name="CapsulesPerPack" placeholder="Capsules Per Pack" required value={newDrug.CapsulesPerPack} onChange={handleInputChange} />
            <input type="text" name="Company" placeholder="Company" required value={newDrug.Company} onChange={handleInputChange} />
            <label htmlFor="image">Image</label>
            <label className="custom-file-upload">
              <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
              Choose Image
            </label>
            <button type="submit" className="add-drug-button">{drugToUpdate ? 'Update Drug' : 'Add Drug'}</button>
          </form>
        )}
      </div>

      {/* Update Drug Section */}
      <div ref={updateRef}>
        {view === 'update' && (
          <div>
            <input
              type="text"
              placeholder="Search Drug by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <div className="drugs-list">
              {drugs.filter(drug => drug.drugName.toLowerCase().includes(searchTerm.toLowerCase())).map((drug) => (
                <div key={drug._id} className="drug-card">
                  <img src={`http://localhost:3000/${drug.image}`} alt={drug.drugName} className="drug-image" />
                  <h4>{drug.drugName}</h4>
                  <button onClick={() => handleSelectDrugForUpdate(drug)} className="update-button">Update</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Drug Section */}
      <div ref={deleteRef}>
        {view === 'delete' && (
          <div>
            <input
              type="text"
              placeholder="Search Drug by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <div className="drugs-list">
              {drugs.filter(drug => drug.drugName.toLowerCase().includes(searchTerm.toLowerCase())).map((drug) => (
                <div key={drug._id} className="drug-card">
                  <img src={`http://localhost:3000/${drug.image}`} alt={drug.drugName} className="drug-image" />
                  <h4>{drug.drugName}</h4>
                  <button onClick={() => handleDeleteDrug(drug.drugName)} className="delete-button">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View All Section */}
      <div ref={viewRef}>
        {view === 'view' && (
          <div className="drugs-list">
            {drugs.map((drug) => (
              <div key={drug._id} className="drug-card">
                <img src={`http://localhost:3000/${drug.image}`} alt={drug.drugName} className="drug-image" />
                <h4>{drug.drugName}</h4>
                <p><strong>Company:</strong> {drug.Company}</p>
                <p><strong>Cost:</strong> {drug.Cost}</p>
                <p><strong>Location:</strong> {JSON.parse(drug.location).join(', ')}</p>
                <p><strong>Capsules per Pack:</strong> {drug.CapsulesPerPack}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};