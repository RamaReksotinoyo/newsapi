// const { Pool } = require('pg');

// const db = new Pool({
//     user: 'ramaido',
//     host: 'localhost',
//     database: 'news',
//     password: 'fafifu',
//     port: 5432,
// });

// db.connect((err) => {
//     if (err) throw err; 
//         console.log('Connected to database')
// });

// module.exports = { db };


const { PrismaClient } = require('@prisma/client');
const winston = require('winston');

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({})
    ]
});

const prismaClient = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});

prismaClient.$on('error', (e) => {
    logger.error(e);
});

prismaClient.$on('warn', (e) => {
    logger.warn(e);
});

prismaClient.$on('info', (e) => {
    logger.info(e);
});

prismaClient.$on('query', (e) => {
    logger.info(e);
});

module.exports = {logger, prismaClient};