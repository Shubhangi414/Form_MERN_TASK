
const express = require('express');
const router = express.Router();
const { addUser, getUsers, updateAddressStatus, deleteAddresses } = require('../controllers/userController');

router.post('/', addUser);
router.get('/', getUsers);
router.patch('/addresses/status', updateAddressStatus);
router.delete('/addresses', deleteAddresses);


module.exports = router;
