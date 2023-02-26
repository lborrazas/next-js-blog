const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  console.log(data)
  console.log(data.latitud)
  try{


    const posts = await prisma.parcela.findMany({
      where:{
          latitud:Number(data.latitud),
          longitud:Number(data.longitud)
      },
    });
    console.log('xxxxxxxxx');
    res.status(200).json(posts);
}
catch(err){
    console.log('xxxxerrroo');
    console.log(err);
    res.status(500).json({ err: "Error occured." });
}
}
