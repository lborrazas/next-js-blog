const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  try {
    const result = await prisma.parcela.update({
      where: { id: data.pid },
      data: { address: data.history_address },
    });
    const temp_hist = await prisma.history.findUnique({
      where: { pid },
    });
    const hist = {
      data: {
        pid: temp_hist.id,
        address: data.toAdd,
        m2used: temp_hist.m2used,
        m3: temp_hist.m3,
      },
    };
    const result2 = await prisma.history.create(hist);
    res.status(200).json(result);
    result = "ok";

    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
