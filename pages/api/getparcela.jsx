const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;

  const posts = await prisma.parcela.findMany({
    where:{
        latitud:Number(data.latitud),
        longitud:Number(data.longitud)
    },
  });
  res.status(200).json(posts);
}
