const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;

  console.log('dsfdsddd');
  console.log(data);
  try {
   
    let data = {
      pid: data.id,
      m2used: data.m2used,
      m2used: data.address,
      m3: data.m3,
      date: new Date().toISOString()
    }

    const result = await prisma.$queryRaw
    `INSERT INTO "History" (pid, m2used, m3, address, date) VALUES (${data.pid}, ${data.m2used}, ${data.m3},${data.address},${data.date})',`;

            res.status(200).json(result);

    result = "ok";
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
