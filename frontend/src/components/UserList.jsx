import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Button, Grid, Paper, Container } from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState([]);

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

  const handleStatusChange = async (userId, addressId, status) => {
    try {
      await axios.patch('http://localhost:5000/api/users/addresses/status', {
        userId,
        addressIds: [addressId],
        status,
      });
      const updatedUsers = users.map((user) =>
        user._id === userId
          ? {
              ...user,
              addresses: user.addresses.map((address) =>
                address._id === addressId ? { ...address, status } : address
              ),
            }
          : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAddresses = async (userId, addressIds) => {
    try {
      await axios.delete('http://localhost:5000/api/users/addresses', {
        data: { userId, addressIds },
      });
      const updatedUsers = users.map((user) =>
        user._id === userId
          ? {
              ...user,
              addresses: user.addresses.filter((address) => !addressIds.includes(address._id)),
            }
          : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
   <Container>
   <Typography variant="h4" gutterBottom textAlign={'center'}>
   USER LIST
 </Typography>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} key={user._id}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h4">{user.name}</Typography>
              <Typography variant="body1">Age: {user.age}</Typography>
              <Typography variant="h5">Addresses:</Typography>
              {user.addresses.map((address) => (
                <div key={address._id}>
                  <Typography variant="body1">{`${address.houseNo}, ${address.city}, ${address.state}, ${address.country}`}</Typography>
                  <Typography variant="body2">Status: {address.status}</Typography>
                  <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleStatusChange(user._id, address._id, 'valid')}>
                    Mark as Valid
                  </Button>
                  <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => handleStatusChange(user._id, address._id, 'invalid')}>
                    Mark as Invalid
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDeleteAddresses(user._id, [address._id])}>
                    Delete
                  </Button>
                </div>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
      </Container>
  );
};

export default UserList;
