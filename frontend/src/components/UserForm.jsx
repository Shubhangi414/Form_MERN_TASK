import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Grid, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link, useParams, useNavigate } from 'react-router-dom';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [addresses, setAddresses] = useState([
    { city: '', state: '', houseNo: '', country: '', status: 'invalid' },
  ]);
  const [errors, setErrors] = useState({ name: '', age: '', addresses: [] });

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${id}`);
          const user = response.data;
          setName(user.name);
          setAge(user.age);
          setAddresses(user.addresses);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUser();
    }
  }, [id]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', age: '', addresses: [] };

    if (!name.trim() || !/^[a-zA-Z\s]*$/.test(name.trim())) {
      newErrors.name = 'Name must contain alphabets and spaces only';
      isValid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
      isValid = false;
    }

    if (isNaN(age) || parseInt(age) < 6) {
      newErrors.age = 'Age must be a number greater than 5';
      isValid = false;
    }

    const addressErrors = addresses.map((address) => {
      const errors = {};
      if (!address.city.trim() || !/^[a-zA-Z\s]*$/.test(address.city.trim())) {
        errors.city = 'City must contain alphabets and spaces only';
        isValid = false;
      }
      if (!address.state.trim() || !/^[a-zA-Z\s]*$/.test(address.state.trim())) {
        errors.state = 'State must contain alphabets and spaces only';
        isValid = false;
      }
      if (!address.country.trim() || !/^[a-zA-Z\s]*$/.test(address.country.trim())) {
        errors.country = 'Country must contain alphabets and spaces only';
        isValid = false;
      }
      if (!address.city.trim()) {
        errors.city = 'City is required';
        isValid = false;
      }
      if (!address.state.trim()) {
        errors.state = 'State is required';
        isValid = false;
      }
      if (!address.houseNo.trim()) {
        errors.houseNo = 'House No is required';
        isValid = false;
      }
      if (!address.country.trim()) {
        errors.country = 'Country is required';
        isValid = false;
      }
      return errors;
    });

    newErrors.addresses = addressErrors;
    setErrors(newErrors);
    return isValid;
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      { city: '', state: '', houseNo: '', country: '', status: 'invalid' },
    ]);
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const newAddresses = [...addresses];
    newAddresses[index][name] = value;
    setAddresses(newAddresses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (id) {
          // Update existing user
          await axios.put(`http://localhost:5000/api/users/${id}`, {
            name,
            age,
            addresses,
          });
        } else {
          // Create new user
          await axios.post('http://localhost:5000/api/users', {
            name,
            age,
            addresses,
          });
        }
        // Reset form
        setName('');
        setAge('');
        setAddresses([{ city: '', state: '', houseNo: '', country: '', status: 'invalid' }]);
        navigate('/userList'); // Navigate back to the user list
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" textAlign={'center'} gutterBottom>
        {id ? 'Edit User' : 'User Form'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              fullWidth
              error={!!errors.age}
              helperText={errors.age}
            />
          </Grid>
          {addresses.map((address, index) => (
            <Grid container spacing={2} key={index} sx={{ m: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={(e) => handleAddressChange(index, e)}
                  required
                  fullWidth
                  error={!!errors.addresses[index]?.city}
                  helperText={errors.addresses[index]?.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={(e) => handleAddressChange(index, e)}
                  required
                  fullWidth
                  error={!!errors.addresses[index]?.state}
                  helperText={errors.addresses[index]?.state}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="House No"
                  name="houseNo"
                  value={address.houseNo}
                  onChange={(e) => handleAddressChange(index, e)}
                  required
                  fullWidth
                  error={!!errors.addresses[index]?.houseNo}
                  helperText={errors.addresses[index]?.houseNo}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country"
                  name="country"
                  value={address.country}
                  onChange={(e) => handleAddressChange(index, e)}
                  required
                  fullWidth
                  error={!!errors.addresses[index]?.country}
                  helperText={errors.addresses[index]?.country}
                />
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <IconButton onClick={handleAddAddress} color="primary">
              <AddIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <br />
            <br />
            <Link to="/userList">
              <Button variant="contained" color="secondary">
                SHOW USER LIST
              </Button>
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default UserForm;
