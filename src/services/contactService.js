const Contact = require('../models/Contact');

const getAllContacts = async (userId) => {
  return await Contact.find({ userId });
};

const getContactById = async (userId, contactId) => {
  return await Contact.findOne({ userId, _id: contactId });
};

const createContact = async (userId, contactData) => {
  return await Contact.create({ ...contactData, userId });
};

const updateContact = async (userId, contactId, contactData) => {
  return await Contact.findOneAndUpdate(
    { userId, _id: contactId },
    contactData,
    { new: true }
  );
};

const deleteContact = async (userId, contactId) => {
  return await Contact.findOneAndDelete({ userId, _id: contactId });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
