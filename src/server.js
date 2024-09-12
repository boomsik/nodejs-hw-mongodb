const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routes/contacts');

async function setupServer() {
  const app = express();

  app.disable('etag');

  app.use(cors());
  app.use(pino);
  app.use(express.json());

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { setupServer };
