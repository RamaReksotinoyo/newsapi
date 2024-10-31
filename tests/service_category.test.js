const supertest = require("supertest");
const { app } = require("../app.js");
const { createTestUser, removeTestUser } = require("./test-util.js");
const { logger } = require("../config/logger.js");
const { prismaClient } = require("../config/logger.js");

let authToken;

beforeAll(async () => {
    await createTestUser();

    // Login to obtain a token
    const loginResponse = await supertest(app)
        .post('/v1/auth/login')
        .send({
            username: "test",
            password: "rahasia"
        });
    authToken = loginResponse.body.data.token;
});

afterAll(async () => {
    await removeTestUser();

    // Clean up any test categories after all tests
    await prismaClient.category.deleteMany({
        where: {
            name: { startsWith: "TC" } // Delete only test categories
        }
    });
});

describe("Category API Tests", () => {
    it("should create a new category", async () => {
        const uniqueCategoryName = `TC_${Date.now()}`;
        const result = await supertest(app)
            .post("/v1/categories")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: uniqueCategoryName
            });

        logger.info(result.body);
        console.log(result.body.message);

        expect(result.status).toBe(201);
        expect(result.body.data.name).toBe(uniqueCategoryName);
    });

    it("should retrieve a category by ID", async () => {
        // Create a category first
        const uniqueCategoryName = `TC_${Date.now()}`;
        const categoryResponse = await supertest(app)
            .post("/v1/categories")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: uniqueCategoryName
            });

        const categoryId = categoryResponse.body.data.id;

        // Retrieve the category by ID
        const result = await supertest(app)
            .get(`/v1/categories/${categoryId}`)
            .set("Authorization", `Bearer ${authToken}`);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe(uniqueCategoryName);
    });

    it("should retrieve category by ID Not Found", async () => {
        // Create a category first
        const uniqueCategoryName = `TC_${Date.now()}`;
        const categoryResponse = await supertest(app)
            .post("/v1/categories")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: uniqueCategoryName
            });

        const categoryId = categoryResponse.body.data.id;

        // Retrieve the category by ID
        const result = await supertest(app)
            .get(`/v1/categories/${categoryId+categoryId}`)
            .set("Authorization", `Bearer ${authToken}`);

        logger.info(result.body);

        expect(result.status).toBe(404);
    });

    it("should retrieve all categories", async () => {
        const result = await supertest(app)
            .get("/v1/categories")
            .set("Authorization", `Bearer ${authToken}`);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });


    it("should update a category by ID", async () => {
        // First, create a unique category to ensure no name conflicts
        const uniqueCategoryName = `UC_${Date.now()}`;
        const category = await supertest(app)
            .post("/v1/categories")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: uniqueCategoryName
            });
    
        const categoryId = category.body.data.id;
    
        // Update the category by ID
        const updatedCategoryName = `UpUC_${Date.now()}`;
        const result = await supertest(app)
            .put(`/v1/categories/${categoryId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: updatedCategoryName
            });
    
        logger.info(result.body);
    
        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe(updatedCategoryName);
        expect(result.body.message).toBe("Updated")
    });
    
    it("should delete a category by ID", async () => {
        // First, create a category
        const uniqueCategoryName = `UD_${Date.now()}`;
        const category = await supertest(app)
            .post("/v1/categories")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: uniqueCategoryName
            });
    
        const categoryId = category.body.data.id;

        // Delete the category by ID
        const result = await supertest(app)
            .delete(`/v1/categories/${categoryId}`)
            .set("Authorization", `Bearer ${authToken}`);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(categoryId);
    });
});
