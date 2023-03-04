const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  const parcela = {
    data: {
      address: data.address,
      latitud: data.latitud,
      longitud: data.longitud,
      m2: data.m2,
    },
  };

  try {
    const posts = await prisma.parcela.findMany({
      where: {
        latitud: Number(data.latitud),
        longitud: Number(data.longitud),
      },
    });
    if (posts[0]) {
      res.status(201).json(-1);
    } else {
      const result = await prisma.parcela.create(parcela);
      const hist = {
        data: {
          pid: result.id,
          address: data.address,
          m2used: data.m2used,
          m3: data.m3,
        },
      };
      const result2 = await prisma.history.create(hist);
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
