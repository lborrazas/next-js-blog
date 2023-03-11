const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    const data = req.body;
    result = await prisma.parcela.delete({
      where: {
        id: data.id,
      },
    });
    res.status(200).json(result);
  } catch (er) {
    console.log(er)
    res.status(500).json({ er: "Error occured." });
  }
}
