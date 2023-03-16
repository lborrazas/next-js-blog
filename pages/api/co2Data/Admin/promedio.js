const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();


export default async function handle(req, res) {
  const data = req.body;
  try {
    const lastRecords = await prisma.$queryRaw`SELECT DISTINCT ON (pid) *
    FROM "History"
    ORDER BY pid, date DESC;`;
    let mean = 0;
    lastRecords.forEach((log) => {
      mean = mean + log.m2used;
    });
    res.status(200).json(mean / lastRecords.length);
  } catch (err) {
    res.status(500).json({ err: "Error occured." });
  }
}
