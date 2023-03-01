const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const posts = await prisma.user.findMany();
  res.json(posts);
}
