const contactsService = require('../services/contacts');

const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch contacts',
    });
  }
};

const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch contact',
    });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
};
