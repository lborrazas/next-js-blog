const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    const data = req.body;
    const result = await prisma.parcela.update({
      where: { id: data.id },
      data: { address: data.toAdd },
    });

    res.status(200).json(result);
  } catch (er) {
    res.status(500).json({ er: "Error occured." });
  }
}
