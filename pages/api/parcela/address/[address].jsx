const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { address } = req.query;
  try {
    const result = await prisma.parcela.findMany({
      where: { address: address },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(508).json({ err: "Error occured while adding a new food." });
  }
}
