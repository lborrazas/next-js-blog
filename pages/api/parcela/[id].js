const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { id } = req.query;
  try {
    // const posts =
    // await prisma.$queryRaw`SELECT *
    // FROM "Parcela"
    // INNER JOIN "History" ON "Parcela".id = "History".pid
    // WHERE "Parcela".id = ${id};`;

    const parcela = await prisma.parcela.findMany({
      where: {
        id: id,
      },
    });

    const history = await prisma.history.findMany({
      where: {
        pid: id,
      },
      orderBy: {
        date: "desc",
      },
    });

    const users = await prisma.user.findMany({
      where: {
        address: parcela[0].address,
      },
    });

    parcela[0].userName = users[0].name;
    parcela[0].m2used = history[0].m2used;
    parcela[0].m3 = history[0].m3;

    res.status(200).json(parcela);
  } catch (err) {
    res.status(500).json({ err: "Error occured." });
  }
}
