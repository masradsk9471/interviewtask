import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Profile.css"

const Profile = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/users/getAllUsers', {
                    headers: { authorization: `Bearer ${token}` },
                });
                setData(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (selectedUser) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.put(
                    'http://localhost:8000/api/users/updateProfile',
                    { fullName, username },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log('Update response:', response.data);
                setData(prevData =>
                    prevData.map(user =>
                        user._id === selectedUser._id
                            ? { ...user, fullName, username } 
                            : user
                    )
                );
                alert("Profile updated successfully");
                setFullName('');
                setUsername('');
                setSelectedUser(null);
            } catch (error) {
                console.log(error)
            }
        }
    };
    
    

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFullName(user.fullName);
        setUsername(user.username);
    };

    return (
        <div>
            <h1>Users List</h1>
           
            <table>
                <thead>
                    <tr>
                        <th>FullName</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(user => (
                        <tr key={user.id}>
                            <td>{user.fullName}</td>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => handleEditClick(user)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedUser && (
                <div>
                    <h2>Update User</h2>
                    <form onSubmit={handleUpdate}>
                        <label>
                            Full Name:
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Username:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <br />
                        <button type="submit">Update</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profile;
