const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;

  try {
    const parcelas = await prisma.$queryRaw`
    SELECT p.*, h.m2used, h.m3, h.address AS history_address, p.address AS parcela_address
    FROM "Parcela" p
    JOIN "History" h ON p."id" = h."pid"
    WHERE h."date" = (
      SELECT MAX("date")
      FROM "History"
      WHERE "pid" = p."id"
    )`;

    const innerdata_anomalies = innerDataAnalize(parcelas);
    const blockchain_anomalies = await blockchainAnalize(data);

    res
      .status(200)
      .json({ inner: innerdata_anomalies, block: blockchain_anomalies });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Error occured." });
  }
}

function innerDataAnalize(parcelas) {
  return parcelas.filter((anomalie) => {
    return anomalie.history_address !== anomalie.parcela_address;
  });
}

async function blockchainAnalize(nfts) {
  const ret = [];
  for (let i = 0; i < nfts.length; i++) {
    const parcela = nfts[i];
    const nft = await prisma.parcela.findMany({
      where: {
        latitud: Number(parcela.data.latitud),
        longitud: Number(parcela.data.longitud),
        address: parcela.owner,
      },
    });
    if (!nft[0]) {
      ret.push(parcela);
    }
  }
  // const ret = nfts.filter(async (parcela) => {
  //   const nft = await prisma.parcela.findMany({
  //     where: {
  //       latitud: Number(parcela.data.latitud),
  //       longitud: Number(parcela.data.longitud),
  //       address: parcela.owner,
  //     },
  //   });
  //   console.log(nft[0]);
  //   return !nft[0];
  // });

  return ret;
}
