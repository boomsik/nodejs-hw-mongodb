const contactService = require('../services/contactService');
const cloudinary = require('../utils/cloudinary');
const Contact = require('../models/Contact');
const streamifier = require('streamifier');

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactService.getAllContacts(req.user._id);
    res.json({ status: 'success', data: contacts });
  } catch (error) {
    next(error);
  }
};

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

const createContact = async (req, res, next) => {
  try {
    console.log('Тело запроса (req.body):', req.body);

    if (req.file) {
      console.log('Файл успешно получен через form-data:');
      console.log('Имя файла:', req.file.originalname); // Логируем имя файла
      console.log('Размер файла:', req.file.size); // Логируем размер файла

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) {
              reject(new Error('Ошибка загрузки на Cloudinary'));
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      photoUrl = result.secure_url;
    } else {
      console.log('Файл не был передан в запросе.');
    }

    const newContact = await Contact.create({
      ...req.body,
      userId: req.user._id,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 'success',
      data: newContact,
    });
  } catch (error) {
    console.error('Ошибка при создании контакта:', error.message);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const existingContact = await contactService.getContactById(
      req.user._id,
      req.params.id
    );
    if (!existingContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    let photoUrl = existingContact.photo;

    if (req.file) {
      if (photoUrl) {
        const publicId = photoUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) {
              reject(new Error('Failed to upload image to Cloudinary'));
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      photoUrl = result.secure_url;
    }

    const updatedContact = await contactService.updateContact(
      req.user._id,
      req.params.id,
      {
        ...req.body,
        photo: photoUrl, // Обновляем ссылку на фото
      }
    );

    res.json({ status: 'success', data: updatedContact });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactService.deleteContact(
      req.user._id,
      req.params.id
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (contact.photo) {
      const publicId = contact.photo.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
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
