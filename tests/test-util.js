const { prismaClient } = require("../config/logger");
const bcrypt = require("bcrypt");


const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    })
}

const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hashSync("rahasia", 10),
            role_id: 1
        }
    })
}

const removeTestCategory = async () => {
    await prismaClient.category.deleteMany({
        where: {
            name: "TestCategory"
        }
    });
};

const createTestCategory = async () => {
    await prismaClient.category.create({
        data: {
            name: "TestCategory"
        }
    });
};

const removeTestNews = async () => {
    await prismaClient.news.deleteMany({
        where: {
            title: "TestNews"
        }
    });
};

const createTestNews = async () => {
    // Ensure the test user and category exist
    const user = await prismaClient.user.findFirst({ where: { username: "test" } });
    const category = await prismaClient.category.findFirst({ where: { name: "TestCategory" } });

    if (!user || !category) {
        throw new Error("User or Category not found. Ensure both are created before creating News.");
    }

    await prismaClient.news.create({
        data: {
            title: "TestNews",
            content: "TestNewsContent.",
            published_by: user.id,
            category_id: category.id
        }
    });
};

module.exports = { removeTestUser, createTestUser, removeTestCategory, createTestCategory };