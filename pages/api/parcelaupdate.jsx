const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    const result = await prisma.history.create({ data: req.body });
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
