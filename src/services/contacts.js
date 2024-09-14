const Contact = require('../models/Contact');

const getAllContacts = async () => {
  return await Contact.find();
};

const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const updateContact = async (contactId, contactData) => {
  return await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
};

const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

module.exports = {
  getAllContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
