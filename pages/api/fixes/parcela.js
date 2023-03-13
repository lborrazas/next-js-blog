const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    const data = req.body;
    console.log(data)
    console.log("//////////////////////////////////////////")
    console.log("//////////////////////////////////////////")
    console.log("/////////////////WARNING//////////////////")
    console.log("//////////////////////////////////////////")
    console.log("//////////////////////////////////////////")
    const result = await prisma.parcela.update({
      where: { id: data.id },
      data: { address : data.toAdd },
    });

    console.log(data);

    res.status(200).json(result);
  } catch (er) {
    res.status(500).json({ er: "Error occured." });
  }
}
