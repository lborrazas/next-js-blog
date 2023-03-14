const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  const parcela = {
    data: {
      address: data.address,
      latitud: Number(data.latitud),
      longitud: Number(data.longitud),
      m2: Number(data.m2),
      blockId:Number(data.blockId)
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
      res.status(200).json(result2);
    }
  } catch (err) {
    console.log(err )
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
