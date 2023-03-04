const { PrismaClient } = require("./../../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { id } = req.query;
  try {
    const posts = await prisma.$queryRaw`SELECT *
    FROM "Parcela"
    INNER JOIN "History" ON "Parcela".id = "History".pid
    WHERE "Parcela".id = ${id};`;


    const users = await prisma.user.findMany({
      where: {
        address: posts[0].address,
      },
    });
    posts[0].userName = users[0].name;
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ err: "Error occured." });
  }
}
