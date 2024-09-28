const Contact = require('../models/Contact');

const getAllContacts = async (
  page,
  perPage,
  sortBy = 'name',
  sortOrder = 'asc',
  isFavourite = null
) => {
  const query = {};

  if (isFavourite !== null) {
    query.isFavourite = isFavourite;
  }

  const totalItems = await Contact.countDocuments(query);

  const contacts = await Contact.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * perPage)
    .limit(perPage);

  return { contacts, totalItems };
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
