const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  const addess = data.addess;
  const user_exist = await prisma.user.findMany({
    where: {
      address: addess,
    },
  });
  console.log(user_exist);
  console.log(data);
  try {
    if (user_exist[0]) {
      const result = "ya existe";
      console.log(result);
      res.status(200).json(result);
    } else {
      const result = await prisma.user.create({
        data,
      });
      console.log(result);
      res.status(200).json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
