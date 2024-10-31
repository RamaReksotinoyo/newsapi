const { db } = require('../config/logger') ;
const express = require('express');
const router = express.Router();
const { CreateToken, ParseToken, VerifyToken } = require('../middleware/token');
const { ErrorResponse, BaseResponse } = require('../response/responses');
const Validator = require("fastest-validator");
const v = new Validator();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
const { prismaClient } = require('../config/logger')


const isAdmin = (id_user) => id_user === 1;

// POST /v1/auth/login - User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const schema = {
            username: { type: "string", nullable: false },
            password: { type: "string", min: 6, nullable: false },
        };
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            return res.status(400).json(BaseResponse(null, 400, 'Validation error'));
        }

        // Find user by username
        const user = await prismaClient.user.findUnique({
            where: { username: username },
        });

        if (!user) {
            return res.status(401).json(BaseResponse(null, 401, "Invalid username"));
        }

        if (DecryptPassword(password, user.password)) {
            const accessToken = CreateToken({ id: user.id, isAdmin: isAdmin(user.role_id) });

            return res.status(200).json(BaseResponse({ token: accessToken, user: { id: user.id, username: user.username } }, 200, "Login successful"));

        } else {
            return res.status(401).json(BaseResponse(null, 401, "Incorrect password"));
        }
    } catch (err) {
        console.log(err)
        return ErrorResponse(err, res);
    }
});

// POST /v1/auth/logout - User logout
router.post('/logout', (req, res) => {
    try {
        return res.status(200).json(BaseResponse(null, 200, "Logout successful"));
    } catch (err) {
        return ErrorResponse(err, res);
    }
});


module.exports = router;