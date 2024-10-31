const { db } = require('../config/logger') ;
const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../middleware/token');
const { ErrorResponse, BaseResponse } = require('../response/responses');
const Validator = require("fastest-validator");
const v = new Validator();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// POST /v1/auth - Create a new category
router.post('/', VerifyToken, async (req, res) => {
    try {
        const { name } = req.body;

        // Validation schema
        const schema = {
            name: { type: "string", min: 3, max: 50, nullable: false },
        };
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json(BaseResponse(null, 400, 'Validation error'));
        }

        // Create category
        const newCategory = await prisma.category.create({
            data: { name }
        });

        return res.status(201).json(BaseResponse(newCategory, 201, 'Created'));
    } catch (err) {
        if (err.code === 'P2002') { // Prisma's unique constraint error code
            return res.status(400).json(BaseResponse(null, 400, `Category with name '${req.body.name}' already exists`));
        } else {
            return ErrorResponse(err, res);
        }
    }
});

// PUT /v1/auth/:categoryId - Update a category by ID
router.put('/:categoryId', VerifyToken, async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const { name } = req.body;

        // Validation schema
        const schema = {
            name: { type: "string", min: 3, max: 50, nullable: false },
        };
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json(BaseResponse(null, 400, 'Validation error'));
        }

        // Update category
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: { name }
        });

        return res.status(200).json(BaseResponse(updatedCategory, 200, 'Updated'));
    } catch (err) {
        if (err.code === 'P2025') { // Record not found error
            return res.status(404).json(BaseResponse(null, 404, 'Category not found'));
        }
        return ErrorResponse(err, res);
    }
});

// DELETE /v1/auth/:categoryId - Delete a category by ID
router.delete('/:categoryId', VerifyToken, async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);

        const deletedCategory = await prisma.category.delete({
            where: { id: categoryId }
        });

        return res.status(200).json(BaseResponse(deletedCategory, 200, 'Deleted'));
    } catch (err) {
        if (err.code === 'P2025') { // Record not found error
            return res.status(404).json(BaseResponse(null, 404, 'Category not found'));
        }
        return ErrorResponse(err, res);
    }
});

// GET /v1/auth/:categoryId - Retrieve a category by ID
router.get('/:categoryId', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);

        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(404).json(BaseResponse(null, 404, 'Not Found'));
        }

        return res.status(200).json(BaseResponse(category, 200, 'Ok'));
    } catch (err) {
        return ErrorResponse(err, res);
    }
});

// GET /v1/auth - Retrieve all categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();

        if (categories.length === 0) {
            return res.status(404).json(BaseResponse(null, 404, 'Not Found'));
        }

        return res.status(200).json(BaseResponse(categories, 200, 'Ok'));
    } catch (err) {
        return ErrorResponse(err, res);
    }
});

module.exports = router;