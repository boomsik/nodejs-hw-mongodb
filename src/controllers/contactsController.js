const contactsService = require('../services/contacts');
const ctrlWrapper = require('../utils/ctrlWrapper');
const createError = require('http-errors');

const getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'asc';
    const isFavourite = req.query.isFavourite
      ? req.query.isFavourite === 'true'
      : null;

    const { contacts, totalItems } = await contactsService.getAllContacts(
      page,
      perPage,
      sortBy,
      sortOrder,
      isFavourite
    );

    const totalPages = Math.ceil(totalItems / perPage);

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
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
  res.status(204).send();
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  createContact: ctrlWrapper(createContact),
  getContactById: ctrlWrapper(getContactById),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
