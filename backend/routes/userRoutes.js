
const express = require('express');
const router = express.Router();
const { addUser, getUsers, updateAddressStatus, deleteAddresses, updateUser , deleteUser} = require('../controllers/userController');

router.post('/', addUser);
router.get('/', getUsers);
router.patch('/addresses/status', updateAddressStatus);
router.delete('/addresses', deleteAddresses);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


module.exports = router;
