// Delivery.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Delivery.css';

export const Delivery = () => {
    const [action, setAction] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
    });

    // Fetch users from backend
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users');
            setUsers(response.data);
            setFilteredUsers(response.data); // Initialize filtered users
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = users.filter((user) =>
            user.username.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleSelectUserForUpdate = (user) => {
        setSelectedUserId(user._id);
        setFormData({ ...user, password: '' });
        setAction('edit');
    };

    const handleAddUser = async () => {
        try {
            await axios.post('http://localhost:3000/users', formData);
            alert('User added successfully!');
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            await axios.put(`http://localhost:3000/users/${selectedUserId}`, formData);
            alert('User updated successfully!');
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            alert('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const resetForm = () => {
        setFormData({ username: '', email: '', password: '', role: 'user' });
        setSelectedUserId(null);
        setAction('');
    };

    const renderUsers = () => (
        <>
            <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar"
            />
            <div className="users-grid">
                {filteredUsers.map((user) => (
                    <div className="user-card" key={user._id}>
                        <h3>{user.username}</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        {action === 'update' && (
                            <button onClick={() => handleSelectUserForUpdate(user)}>
                                Update
                            </button>
                        )}
                        {action === 'delete' && (
                            <button 
                            className='delete-button'
                            onClick={() => handleDeleteUser(user._id)}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <div className="delivery-page"> {/* Unique class for Delivery page */}
            <div className="delivery-container">
                <h2>Manage Delivery Boys</h2>
                <div className="button-group">
                    <button onClick={() => setAction('add')}>Add</button>
                    <button onClick={() => setAction('update')}>Update</button>
                    <button onClick={() => setAction('delete')}>Delete</button>
                    <button onClick={() => setAction('view')}>View All</button>
                </div>

                {action === 'add' && (
                    <div className="form-container">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="deliveryboy">Delivery Boy</option>
                        </select>
                        <button onClick={handleAddUser}>Submit</button>
                    </div>
                )}

                {['update', 'delete', 'view'].includes(action) && renderUsers()}

                {action === 'edit' && (
                    <div className="form-container">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password (Leave blank to keep unchanged)"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            {/* <option value="user">User</option>
                            <option value="admin">Admin</option> */}
                            <option value="delivery boy">Delivery Boy</option>
                        </select>
                        <button onClick={handleUpdateUser}>Update</button>
                    </div>
                )}
            </div>
        </div>
    );
};
