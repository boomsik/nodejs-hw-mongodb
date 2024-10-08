const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
    default: null,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Автоматически добавляем дату создания
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
