const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const cookieParser = require('cookie-parser');
const contactsRouter = require('./routes/contacts');
const authRouter = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

async function setupServer() {
  const app = express();

  app.disable('etag');

  app.use(cors());
  app.use(pino);
  app.use(express.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  // Swagger documentation route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { setupServer };
