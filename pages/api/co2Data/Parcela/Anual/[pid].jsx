const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  console.log(req.query)
  const posts = await prisma.history.findMany({
    where: {
      pid: req.query.pid,
    },
  });
  res.json(posts);
}
