const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.query;
  console.log(data.address)
  try {
    const lastRecords = await prisma.$queryRaw`SELECT DISTINCT ON (pid) *
    FROM "History"
    where "address" = ${data.address}
    ORDER BY "pid", "date" DESC;`;
    let mean=0;
    lastRecords.forEach((log) => {
        mean=mean+log.m2used
    });
    res.status(200).json(mean/lastRecords.length);
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: "Error occured." });
  }
}