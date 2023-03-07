const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  try {
    const posts = await prisma.parcela.findMany({
      where: {
        latitud: Number(data.latitud),
        longitud: Number(data.longitud),
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ err: "Error occured." });
  }
}
