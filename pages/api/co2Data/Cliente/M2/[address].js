const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  console.log(req.query);
  const { address } = req.query;
  try {
    const result = await prisma.$queryRaw`SELECT p.*, h.*
            FROM "Parcela" p
            LEFT JOIN (
              SELECT pid, MAX(date) AS max_date
              FROM "History"
              WHERE address = ${address}
              GROUP BY pid
            ) latest ON p.id = latest.pid
            LEFT JOIN "History" h ON latest.pid = h.pid AND latest.max_date = h.date
            WHERE p.address = ${address}`;

    let val = 0;
    result.forEach((element) => {
      val = val + (element.m2 * element.m2used) / 100;
    });

    res.status(200).json(val);
  } catch (err) {
    console.log(err);
    res.status(508).json({ err: "Error occured while adding a new food." });
  }
}
