const User = require('../models/User');

const addUser = async (req, res) => {
  const { name, age, addresses } = req.body;
  try {
    const user = new User({ name, age, addresses });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAddressStatus = async (req, res) => {
  const { userId, addressIds, status } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.map((address) => {
      if (addressIds.includes(address._id.toString())) {
        address.status = status;
      }
      return address;
    });

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAddresses = async (req, res) => {
  const { userId, addressIds } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter(
      (address) => !addressIds.includes(address._id.toString())
    );

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addUser, getUsers, updateAddressStatus, deleteAddresses };
