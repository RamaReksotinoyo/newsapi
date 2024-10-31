const supertest = require("supertest");
const { app } = require("../app.js");
const { createTestUser, removeTestUser, createTestCategory, removeTestCategory } = require("./test-util.js");
const { logger } = require("../config/logger.js");
const { prismaClient } = require("../config/logger.js");

let authToken;
let testCategoryId;

beforeAll(async () => {
    await createTestUser();
    await createTestCategory(); // Ensure there's a category for the news

    // Login to obtain a token
    const loginResponse = await supertest(app)
        .post('/v1/auth/login')
        .send({
            username: "test",
            password: "rahasia"
        });
    authToken = loginResponse.body.data.token;

    // Retrieve the test category ID
    const category = await prismaClient.category.findFirst({ where: { name: "TestCategory" } });
    testCategoryId = category.id;
});

afterAll(async () => {
    await removeTestUser();
    await removeTestCategory();

    // Clean up any test news articles after all tests
    await prismaClient.news.deleteMany({
        where: {
            title: { startsWith: "Test News" } // Delete only test news
        }
    });
});

describe("News API Tests", () => {
    it("should create a new news article", async () => {
        const uniqueTitle = `Test News ${Date.now()}`;
        const result = await supertest(app)
            .post("/v1/news")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: uniqueTitle,
                content: "This is a test news article.",
                published_by: 1, // Ensure this corresponds to your test user ID
                category_id: testCategoryId // Use the test category ID
            });

        logger.info(result.body);

        expect(result.status).toBe(201);
        expect(result.body.data.title).toBe(uniqueTitle);
    });

    it("should retrieve a news article by ID", async () => {
        const uniqueTitle = `Test News ${Date.now()}`;
        const newsResponse = await supertest(app)
            .post("/v1/news")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: uniqueTitle,
                content: "This is a test news article.",
                published_by: 1,
                category_id: testCategoryId
            });

        const newsId = newsResponse.body.data.id;

        // Retrieve the news article by ID
        const result = await supertest(app)
            .get(`/v1/news/${newsId}`)
            .set("Authorization", `Bearer ${authToken}`);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe(uniqueTitle);
    });

    it("should retrieve news article by ID Not Found", async () => {
        const result = await supertest(app)
            .get(`/v1/news/999999`) // Assuming this ID does not exist
            .set("Authorization", `Bearer ${authToken}`);

        logger.info(result.body);

        expect(result.status).toBe(404);
    });

    it("should retrieve all news articles", async () => {
        const result = await supertest(app)
            .get("/v1/news")
            .set("Authorization", `Bearer ${authToken}`);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });

    it("should update a news article by ID", async () => {
        const uniqueTitle = `Test News ${Date.now()}`;
        const newsResponse = await supertest(app)
            .post("/v1/news")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: uniqueTitle,
                content: "This is a test news article.",
                published_by: 1,
                category_id: testCategoryId
            });

        const newsId = newsResponse.body.data.id;

        // Update the news article by ID
        const updatedTitle = `Updated Test News ${Date.now()}`;
        const result = await supertest(app)
            .put(`/v1/news/${newsId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: updatedTitle,
                content: "This is an updated test news article."
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe(updatedTitle);
    });

    it("should delete a news article by ID", async () => {
        const uniqueTitle = `Test News ${Date.now()}`;
        const newsResponse = await supertest(app)
            .post("/v1/news")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: uniqueTitle,
                content: "This is a test news article.",
                published_by: 1,
                category_id: testCategoryId
            });

        const newsId = newsResponse.body.data.id;

        // Delete the news article by ID
        const result = await supertest(app)
            .delete(`/v1/news/${newsId}`)
            .set("Authorization", `Bearer ${authToken}`);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(newsId);
    });
});
