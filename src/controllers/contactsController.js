const contactsService = require('../services/contacts');
const ctrlWrapper = require('../utils/ctrlWrapper');
const createError = require('http-errors');

const getAllContacts = async (req, res) => {
  const contacts = await contactsService.getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const createContact = async (req, res) => {
  const newContact = await contactsService.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

const getContactById = async (req, res, next) => {
  const contact = await contactsService.getContactById(req.params.contactId);
  if (!contact) {
    return next(createError(404, 'Contact not found'));
  }
  res.json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

const updateContact = async (req, res) => {
  const updatedContact = await contactsService.updateContact(
    req.params.contactId,
    req.body
  );
  res.json({
    status: 200,
    message: 'Successfully patched a contact',
    data: updatedContact,
  });
};

const deleteContact = async (req, res) => {
  await contactsService.deleteContact(req.params.contactId);
  res.json({
    status: 200,
    message: 'Contact deleted',
  });
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  createContact: ctrlWrapper(createContact),
  getContactById: ctrlWrapper(getContactById),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
