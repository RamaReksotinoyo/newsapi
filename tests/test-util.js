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

module.exports = { removeTestUser, createTestUser };