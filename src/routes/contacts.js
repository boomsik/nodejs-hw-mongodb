const express = require('express');
const contactsController = require('../controllers/contactsController');
const router = express.Router();

router.get('/', contactsController.getAllContacts);

router.post('/', contactsController.createContact);

router.get('/:contactId', contactsController.getContactById);

router.patch('/:contactId', contactsController.updateContact);

router.delete('/:contactId', contactsController.deleteContact);

module.exports = router;
