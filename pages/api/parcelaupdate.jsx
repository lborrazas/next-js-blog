const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;

  try {
    //const result = await prisma.parcela.create({
    // data,
    //});
    //const result = await prisma.history.create({
    // data,
    //});
    result = "ok";
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
