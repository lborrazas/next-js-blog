const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  const address = data.address;

  console.log(data);
  try {
    const result = await prisma.user.create({
      data,
    });
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
