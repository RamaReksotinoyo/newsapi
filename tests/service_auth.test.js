const supertest = require("supertest");
const { app } = require("../app.js");
const { logger } = require("../config/logger.js");
const { createTestUser, removeTestUser } = require("./test-util.js");



describe('POST /v1/auth/login', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(app)
            .post('/v1/auth/login')
            .send({
                username: "test",
                password: "rahasia"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe("test");
    });

    it('should reject login if request is invalid', async () => {
        const result = await supertest(app)
            .post('/v1/auth/login')
            .send({
                username: "",
                password: ""
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(app)
            .post('/v1/auth/login')
            .send({
                username: "test",
                password: "salahsalah"
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Incorrect password");
    });

    it('should reject login if username is wrong', async () => {
        const result = await supertest(app)
            .post('/v1/auth/login')
            .send({
                username: "salahhhh",
                password: "salahhhh"
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Invalid username");

    });

});
