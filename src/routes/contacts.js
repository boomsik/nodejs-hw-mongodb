const express = require('express');
const contactsController = require('../controllers/contactsController');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const { contactSchema } = require('../schemas/contactsSchema');

const router = express.Router();

router.get('/', contactsController.getAllContacts);
router.post('/', validateBody(contactSchema), contactsController.createContact);

router.get('/:contactId', contactsController.getContactById);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactSchema),
  contactsController.updateContact
);

router.delete('/:contactId', contactsController.deleteContact);

module.exports = router;
