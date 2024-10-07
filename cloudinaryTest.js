require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Настраиваем Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Загружаем изображение на Cloudinary
cloudinary.uploader.upload('test-image.jpg', (error, result) => {
  if (error) {
    console.log('Ошибка загрузки:', error);
  } else {
    console.log('Результат загрузки:', result);
  }
});
