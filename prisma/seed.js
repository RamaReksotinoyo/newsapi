const { prismaClient } = require("../config/db");
// const prismaClient = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
    // Seed users
    const Admin = await prismaClient.user.create({
        data: {
            username: "test_admin",
            password: await bcrypt.hashSync("rahasia", 10),
            role: { connect: { name: "Admin" } },
        },
    });

    const User = await prismaClient.user.create({
        data: {
            username: "test_user",
            password: await bcrypt.hashSync("rahasia", 10),
            role: { connect: { name: "User" } },
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });

    // node prisma/seed.js