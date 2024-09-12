const Contact = require('../models/Contact');

const getAllContacts = async () => {
  return await Contact.find();
};

// Функция для получения контакта по ID
const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

module.exports = {
  getAllContacts,
  getContactById,
};
