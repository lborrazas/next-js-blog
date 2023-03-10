const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  const address = data.address;

  try {
    const result = await prisma.user.create({
      data,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
