const Contact = require('../models/Contact');

// const getAllContacts = async () => {
//   return await Contact.find();
// };

// const getAllContacts = async (page = 1, perPage = 10) => {
//   const skip = (page - 1) * perPage;
//   const totalItems = await Contact.countDocuments();
//   const contacts = await Contact.find().skip(skip).limit(perPage);
//   const totalPages = Math.ceil(totalItems / perPage);

//   return {
//     data: contacts,
//     page,
//     perPage,
//     totalItems,
//     totalPages,
//     hasPreviousPage: page > 1,
//     hasNextPage: page < totalPages,
//   };
// };
const getAllContacts = async (
  page,
  perPage,
  sortBy = 'name',
  sortOrder = 'asc',
  isFavourite = null
) => {
  const query = {};

  // Добавляем фильтрацию по полю isFavourite, если параметр был передан
  if (isFavourite !== null) {
    query.isFavourite = isFavourite;
  }

  const totalItems = await Contact.countDocuments(query);

  const contacts = await Contact.find(query)
    .sort({ [sortBy]: sortOrder }) // Добавляем сортировку
    .skip((page - 1) * perPage) // Пагинация
    .limit(perPage); // Лимит на количество записей на странице

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
