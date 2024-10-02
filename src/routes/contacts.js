const express = require('express');
const contactsController = require('../controllers/contactsController');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const authenticate = require('../middlewares/authenticate');
const { contactSchema } = require('../schemas/contactSchemas');

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.getAllContacts);

router.get('/:id', isValidId, contactsController.getContactById);

router.post('/', validateBody(contactSchema), contactsController.createContact);

router.put(
  '/:id',
  isValidId,
  validateBody(contactSchema),
  contactsController.updateContact
);

router.delete('/:id', isValidId, contactsController.deleteContact);

module.exports = router;
