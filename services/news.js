const express = require('express');
const router = express.Router();
const { VerifyToken, ParseToken } = require('../middleware/token');
const { ErrorResponse, BaseResponse } = require('../response/responses');
const Validator = require("fastest-validator");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const v = new Validator();

// GET /v1/news/search - Search for news by title or content
router.get('/search', async (req, res) => {
    const { query } = req.query; // Mengambil query dari parameter URL
    try {
        const news = await prisma.news.findMany({
            where: {
                OR: [
                    {
                        title: { contains: query, mode: 'insensitive' },
                    },
                    {
                        content: { contains: query, mode: 'insensitive' },
                    },
                ]
            },
            take: 10 // Mengambil 10 berita
        });

        // Jika tidak ada berita ditemukan
        if (news.length === 0) {
            return res.status(404).json(BaseResponse(null, 404, 'No news found'));
        }

        return res.status(200).json(BaseResponse(news, 200, 'Ok'));
    } catch (err) {
        return ErrorResponse(err, res);
    }
});

// POST /v1/news - Create a new news article
router.post('/', VerifyToken, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json(BaseResponse(null, 401, "Token missing or invalid"));
        }
        
        
        // Ekstrak token dan decode menggunakan ParseToken

        // Ekstrak token dan decode menggunakan ParseToken
        const token = authHeader.split(" ")[1];
        const userData = ParseToken(token);

        const { title, content, category_id } = req.body;

        // Validation schema
        const schema = {
            title: { type: "string", min: 5, max: 255, nullable: false },
            content: { type: "string", nullable: false },
            category_id: { type: "number", integer: true, positive: true, nullable: false }
        };
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json(BaseResponse(null, 400, 'Validation error'));
        }

        // Check if category exists
        const categoryExists = await prisma.category.findUnique({
            where: { id: category_id }
        });
        if (!categoryExists) {
            return res.status(404).json(BaseResponse(null, 404, 'Category not found'));
        }

        // Create news
        const newNews = await prisma.news.create({
            data: { title, content, published_by: userData.id, category_id }
        });

        return res.status(201).json(BaseResponse(newNews, 201, 'Created'));
    } catch (err) {
        if (err.code === 'P2002') { // Prisma's unique constraint error code
            return res.status(400).json(BaseResponse(null, 400, `News with title '${req.body.title}' already exists`));
        }
        return ErrorResponse(err, res);
    }
});

// PUT /v1/news/:newsId - Update a news article by ID
router.put('/:newsId', VerifyToken, async (req, res) => {
    try {
        const newsId = parseInt(req.params.newsId);
        const { title, content, category_id } = req.body;

        // Validation schema
        const schema = {
            title: { type: "string", min: 5, max: 255, nullable: false },
            content: { type: "string", nullable: false },
            category_id: { type: "number", integer: true, positive: true, nullable: false }
        };
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json(BaseResponse(null, 400, 'Validation error'));
        }

        // Check if category exists
        const categoryExists = await prisma.category.findUnique({
            where: { id: category_id }
        });
        if (!categoryExists) {
            return res.status(404).json(BaseResponse(null, 404, 'Category not found'));
        }

        // Update news
        const updatedNews = await prisma.news.update({
            where: { id: newsId },
            data: { title, content, category_id }
        });

        return res.status(200).json(BaseResponse(updatedNews, 200, 'Updated'));
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json(BaseResponse(null, 404, 'News not found'));
        }
        return ErrorResponse(err, res);
    }
});

// DELETE /v1/news/:newsId - Delete a news article by ID
router.delete('/:newsId', VerifyToken, async (req, res) => {
    try {
        const newsId = parseInt(req.params.newsId);

        const deletedNews = await prisma.news.delete({
            where: { id: newsId }
        });

        return res.status(200).json(BaseResponse(deletedNews, 200, 'Deleted'));
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json(BaseResponse(null, 404, 'News not found'));
        }
        return ErrorResponse(err, res);
    }
});

// GET /v1/news/:newsId - Retrieve a news article by ID
router.get('/:newsId', async (req, res) => {
    try {
        const newsId = parseInt(req.params.newsId);

        const news = await prisma.news.findUnique({
            where: { id: newsId }
        });

        if (!news) {
            return res.status(404).json(BaseResponse(null, 404, 'Not Found'));
        }

        return res.status(200).json(BaseResponse(news, 200, 'Ok'));
    } catch (err) {
        return ErrorResponse(err, res);
    }
});

// GET /v1/news - Retrieve all news articles
router.get('/', async (req, res) => {
    try {
        const newsList = await prisma.news.findMany();

        if (newsList.length === 0) {
            return res.status(404).json(BaseResponse(null, 404, 'Not Found'));
        }

        return res.status(200).json(BaseResponse(newsList, 200, 'Ok'));
    } catch (err) {
        return ErrorResponse(err, res);
    }
});


module.exports = router;