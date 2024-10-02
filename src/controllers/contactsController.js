const contactService = require('../services/contactService');

// Получение всех контактов
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactService.getAllContacts(req.user._id);
    res.json({ status: 'success', data: contacts });
  } catch (error) {
    next(error);
  }
};

// Получение контакта по ID
const getContactById = async (req, res, next) => {
  try {
    const contact = await contactService.getContactById(
      req.user._id,
      req.params.id
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ status: 'success', data: contact });
  } catch (error) {
    next(error);
  }
};

// Создание нового контакта
const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact(req.user._id, req.body);
    res.status(201).json({ status: 'success', data: contact });
  } catch (error) {
    next(error);
  }
};

// Обновление контакта
const updateContact = async (req, res, next) => {
  try {
    const contact = await contactService.updateContact(
      req.user._id,
      req.params.id,
      req.body
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ status: 'success', data: contact });
  } catch (error) {
    next(error);
  }
};

// Удаление контакта
const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactService.deleteContact(
      req.user._id,
      req.params.id
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
