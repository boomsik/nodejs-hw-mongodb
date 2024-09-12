const { initMongoConnection } = require('./db/initMongoConnection');
const { setupServer } = require('./server');

initMongoConnection().then(setupServer);
