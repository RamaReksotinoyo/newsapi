const jwt = require("jsonwebtoken");
const { CreateToken, ParseToken, VerifyToken } = require("../middleware/token");
const { BaseResponse } = require('../response/responses');
const request = require("supertest");
const express = require("express");

const rahasia = "ini_adalah_rahasia"; // use the same secret as in token.js

describe("Token Functions", () => {

  describe("CreateToken", () => {
    it("should create a valid token", () => {
      const payload = { username: "testuser", isAdmin: true };
      const token = CreateToken(payload);
      
      expect(typeof token).toBe("string");
      
      const decoded = jwt.verify(token, rahasia);
      expect(decoded.username).toBe("testuser");
      expect(decoded.isAdmin).toBe(true);
    });
  });

  describe("ParseToken", () => {
    it("should parse a valid token", () => {
      const payload = { username: "testuser", isAdmin: true };
      const token = jwt.sign(payload, rahasia, { expiresIn: '10m' });
      
      const parsed = ParseToken(token);
      expect(parsed.username).toBe("testuser");
      expect(parsed.isAdmin).toBe(true);
    });

    it("should throw an error for an invalid token", () => {
      const invalidToken = "invalid.token.value";

      expect(() => ParseToken(invalidToken)).toThrow(jwt.JsonWebTokenError);
    });
  });
});


// describe("VerifyToken Middleware for Protected Routes", () => {
//     let app;
  
//     beforeAll(() => {
//       app = express();
//       app.use(express.json());
      
//       // Protected routes
//       app.post("/v1/categories", VerifyToken, (req, res) => res.status(200).json({ message: "Category created" }));
//       app.put("/v1/categories/:categoryId", VerifyToken, (req, res) => res.status(200).json({ message: "Category updated" }));
//       app.delete("/v1/categories/:categoryId", VerifyToken, (req, res) => res.status(200).json({ message: "Category deleted" }));
      
//       // Public routes
//       app.get("/v1/categories/:categoryId", (req, res) => res.status(200).json({ message: "Category details" }));
//       app.get("/v1/categories", (req, res) => res.status(200).json({ message: "Categories list" }));
//     });
  
//     // Test cases for routes requiring token authentication
//     const protectedRoutes = [
//       { method: 'post', path: '/v1/categories' },
//       { method: 'put', path: '/v1/categories/1' },
//       { method: 'delete', path: '/v1/categories/1' },
//     ];
  
//     protectedRoutes.forEach(route => {
//       it(`should return 401 if Authorization header is missing for ${route.method.toUpperCase()} ${route.path}`, async () => {
//         const response = await request(app)[route.method](route.path);
//         expect(response.statusCode).toBe(401);
//         expect(response.body.message).toBe("Unauthorized, token is missing");
//       });
  
//       it(`should return 401 if token is missing for ${route.method.toUpperCase()} ${route.path}`, async () => {
//         const response = await request(app)[route.method](route.path).set("Authorization", "Bearer ");
//         expect(response.statusCode).toBe(401);
//         expect(response.body.message).toBe("Unauthorized, token is missing");
//       });
  
//       it(`should return 401 for an invalid token for ${route.method.toUpperCase()} ${route.path}`, async () => {
//         const response = await request(app)[route.method](route.path).set("Authorization", "Bearer invalid.token");
//         expect(response.statusCode).toBe(401);
//         expect(response.body.message).toBe("Invalid Token");
//       });
  
//       it(`should return 403 if user is not an admin for ${route.method.toUpperCase()} ${route.path}`, async () => {
//         const payload = { username: "testuser", isAdmin: false };
//         const token = CreateToken(payload);
  
//         const response = await request(app)[route.method](route.path).set("Authorization", `Bearer ${token}`);
//         expect(response.statusCode).toBe(403);
//         expect(response.body.message).toBe("Forbidden: Only admin can access this site");
//       });
  
//       it(`should allow access if user is an admin for ${route.method.toUpperCase()} ${route.path}`, async () => {
//         const payload = { username: "testuser", isAdmin: true };
//         const token = CreateToken(payload);
  
//         const response = await request(app)[route.method](route.path).set("Authorization", `Bearer ${token}`);
//         expect(response.statusCode).toBe(200);
//       });
//     });
  
//     // Test cases for public routes (no token required)
//     it("should allow access to GET /v1/categories/:categoryId without token", async () => {
//       const response = await request(app).get("/v1/categories/1");
//       expect(response.statusCode).toBe(404);
//     });
  
//     it("should allow access to GET /v1/categories without token", async () => {
//       const response = await request(app).get("/v1/categories");
//       expect(response.statusCode).toBe(200);
//     });
// });