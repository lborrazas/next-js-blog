const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const address = req.body.address;

  const user_exist = await prisma.user.findMany({
    where: {
      address: address,
    },
  });
  res.status(200).json(user_exist);
}
