const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    const result = await prisma.$queryRaw`SELECT p.*, h.*
          FROM "Parcela" p
          LEFT JOIN (
            SELECT pid, MAX(date) AS max_date
            FROM "History"
            GROUP BY pid
          ) latest ON p.id = latest.pid
          LEFT JOIN "History" h ON latest.pid = h.pid AND latest.max_date = h.date`;

    for (let i = 0; i < result.length; i++) {
      console.log(result[i].address);
      const user = await prisma.user.findMany({
        where: {
          address: result[i].address,
        },
      });
      if (user.length > 0) {
        result[i].userName = user[0].name;
      }
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(508).json({ err: "Error occured while adding a new food." });
  }
}
