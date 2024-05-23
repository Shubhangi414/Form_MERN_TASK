import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Button, Grid, Paper, Container, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedAddresses, setSelectedAddresses] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleSelectAddress = (userId, addressId) => {
    setSelectedAddresses((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[userId]?.includes(addressId)) {
        newSelected[userId] = newSelected[userId].filter(id => id !== addressId);
        if (newSelected[userId].length === 0) delete newSelected[userId];
      } else {
        if (newSelected[userId]) {
          newSelected[userId].push(addressId);
        } else {
          newSelected[userId] = [addressId];
        }
      }
      return newSelected;
    });
  };

  const handleStatusChange = async (status) => {
    try {
      const requests = Object.keys(selectedAddresses).map(userId =>
        axios.patch('http://localhost:5000/api/users/addresses/status', {
          userId,
          addressIds: selectedAddresses[userId],
          status,
        })
      );
      await Promise.all(requests);
      setSelectedAddresses({});
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAddresses = async () => {
    try {
      const requests = Object.keys(selectedAddresses).map(userId =>
        axios.delete('http://localhost:5000/api/users/addresses', {
          data: { userId, addressIds: selectedAddresses[userId] },
        })
      );
      await Promise.all(requests);
      setSelectedAddresses({});
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'lightgrey', zIndex: 1, padding: '10px 0' }}>
        <Typography variant="h4" gutterBottom textAlign={'center'}>
          USER LIST
        </Typography>
        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleStatusChange('valid')}>
          Mark Selected as Valid
        </Button>
        <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => handleStatusChange('invalid')}>
          Mark Selected as Invalid
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteAddresses}>
          Delete Selected
        </Button>
      </div>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} key={user._id}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h4">{user.name}</Typography>
              <Typography variant="body1">Age: {user.age}</Typography>
              <Typography variant="h5">Addresses:</Typography>
              {user.addresses.map((address) => (
                <div key={address._id} style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={selectedAddresses[user._id]?.includes(address._id) || false}
                    onChange={() => handleSelectAddress(user._id, address._id)}
                  />
                  <Typography variant="body1">{`${address.houseNo}, ${address.city}, ${address.state}, ${address.country}`}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ ml: 'auto', fontStyle: 'italic', fontWeight: 'bold', color: address.status === 'valid' ? 'blue' : 'red' }}
                  >
                    Status: {address.status}
                  </Typography>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Link to={`/editUser/${user._id}`}>
                  <Button variant="contained" color="primary">Edit User</Button>
                </Link>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user._id)}>Delete User</Button>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserList;
