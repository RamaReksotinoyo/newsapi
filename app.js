const express = require('express');
const { Pool } = require('pg');
const { HashPasswrod } = require('./middleware/hash');
const { db } = require('./config/logger') ;
const { CreateToken, ParseToken, VerifyToken } = require('./middleware/token');
const { ErrorResponse, BaseResponse } = require('./response/responses');
const Validator = require("fastest-validator");
const v = new Validator();
const morgan = require('morgan')


const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = 3000;

// app.listen(3000, () => {
//     logger.info("App start");
// });

app.get('/', (req, res) => {
  res.send('Hello World!')
});

var auth = require("./services/auth");
var categories = require("./services/categories");
const news = require("./services/news");

app.use("/v1/auth", auth);
app.use("/v1/categories", categories);
app.use("/v1/news", news);





// const isAdmin = (id_user) => id_user === 1;

// app.post('/v1/auth/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         const schema = {
//             username: { type: "string", nullable: false },
//             password: { type: "string", min: 6, nullable: false },
//         };
//         const validationResponse = v.validate(req.body, schema);
//         if (validationResponse !== true) {
//             return res.status(400).json(BaseResponse(null, 400, 'Validation error'));
//         }

//         const checkUser = `SELECT * FROM users WHERE username = $1`;
//         const values = [username];

//         const result = await db.query(checkUser, values);

//         if (result.rows.length === 0) {
//             return res.status(400).json(BaseResponse(null, 400, "Invalid username"));
//         }

//         if (DecryptPassword(password, result.rows[0].password)) {
//             const accessToken = CreateToken({ id: result.rows[0].id, isAdmin: isAdmin(result.rows[0].role_id) });

//             const user = {
//                 id: result.rows[0].id,
//                 usernmae: result.rows[0].username,
//             }

//             return res.status(200).json(BaseResponse({ token: accessToken, user: user }, 200, "Login successful"));
//         } else {
//             return res.status(400).json(BaseResponse(null, 400, "Password salah"));
//         }
//     } catch (err) {
//         return ErrorResponse(err, res);
//     }
// });

// app.post('/v1/auth/logout', (req, res) => {
//     try {
//         return res.status(200).json(BaseResponse(null, 200, "Logout successful"));
//     } catch (err) {
//         return ErrorResponse(err, res);
//     }
// });

// app.post('/v1/categories', VerifyToken, async(req, res) => {
//     try{
//         const {name} = req.body;

//         const schema = {
//             name: { type: "string", min: 3, max: 50, nullable: false },
//         };
//         const validationResponse = v.validate(req.body, schema);
//         if (validationResponse !== true) {
//             return res.status(400).json(BaseResponse(null, 400, 'Validation error'));
//         }

//         const query = `INSERT INTO categories (name) VALUES ($1) RETURNING *`;
//         const values = [name];
//         const result = await db.query(query, values);

//         return res.status(201).json(BaseResponse(result.rows[0], 201, 'Created'));
//     } catch(err){
//         if (err.code === '23505') {
//             return res.status(400).json(BaseResponse(null, 400, `Category with name '${req.body.name}' already exists`));
//         } else {
//             return ErrorResponse(err, res);
//         }
//     }
// });

// app.put('/v1/categories/:categoryId', VerifyToken, async(req, res) => {
//     try{
//         const categoryId = req.params.categoryId;
//         const { name } = req.body;

//         const schema = {
//             name: { type: "string", min: 3, max: 50, nullable: false },
//         };
//         const validationResponse = v.validate(req.body, schema);
//         if (validationResponse !== true) {
//             return res.status(400).json(BaseResponse(null, 400, 'Validation error'));
//         }

//         const query = `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *` ;
//         const values = [name, categoryId];
//         const result = await db.query(query, values);

//         if (result.rows.length === 0) {
//             return res.status(404).json(BaseResponse(null, 404, 'Not Found'));
//         }

//         return res.status(201).json(BaseResponse(result.rows[0], 201, 'Updated'));
//     } catch(err){
//         return ErrorResponse(err, res);
//     }
// });

// app.delete('/v1/categories/:categoryId', VerifyToken, async (req, res) => {
//     try {
//         const categoryId = req.params.categoryId;

//         const query = `DELETE FROM categories WHERE id = $1 RETURNING *`;
//         const values = [categoryId];
//         const result = await db.query(query, values);

//         if (result.rows.length === 0) {
//             return res.status(404).json(BaseResponse(null, 404, 'Category not found'));
//         }

//         return res.status(200).json(BaseResponse(result.rows[0], 200, 'Deleted'));
//     } catch (err) {
//         return ErrorResponse(err, res);
//     }
// });


// app.get('/v1/categories/:categoryId', async(req, res) => {
//     try{
//         const categoryId = req.params.categoryId;

//         const query = `SELECT * FROM categories WHERE id = ($1)` ;
//         const values = [categoryId];
//         const result = await db.query(query, values);

//         if (result.rows.length === 0) {
//             return res.status(404).json(BaseResponse(null, 404, 'Not Found'));
//         }

//         return res.status(200).json(BaseResponse(result.rows[0], 200, 'Ok'));
//     } catch(err){
//         return ErrorResponse(err, res);
//     }
// });

// app.get('/v1/categories', async (req, res) => {
//     try {
//         const query = 'SELECT * FROM categories';
//         const result = await db.query(query);

//         if (result.rows.length === 0) {
//             return res.status(404).json(BaseResponse(null, 404, 'Not Found'));
//         }

//         return res.status(200).json(BaseResponse(result.rows, 200, 'Ok'));
//     } catch (err) {
//         return ErrorResponse(err, res);
//     }
// });

module.exports = { app };