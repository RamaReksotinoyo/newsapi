const app = require('./app');
const { logger } = require('./config/logger.js');

const PORT = process.env.PORT || 3000;

app.app.listen(PORT, () => {
    logger.info(`App started on port ${PORT}`);
});
