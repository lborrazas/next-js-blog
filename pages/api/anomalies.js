const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const data = req.body;
  console.log(data);
  try {
    const parcelas = await prisma.$queryRaw`
    SELECT p.*, h.m2used, h.m3,h.pid, h.id As history_id, h.address AS history_address, p.address AS parcela_address
    FROM "Parcela" p
    JOIN "History" h ON p."id" = h."pid"
    WHERE h."date" = (
      SELECT MAX("date")
      FROM "History"
      WHERE "pid" = p."id"
    )`;

    const innerdata_anomalies = innerDataAnalize(parcelas);
    const [blockchain_anomalies, external_anomalies] = await blockchainAnalize(
      data
    );
    res.status(200).json({
      inner: innerdata_anomalies,
      block: blockchain_anomalies,
      exter: external_anomalies,
    });
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
  const externalfilter = [];
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
    } else {
      externalfilter.push(nft[0].id);
    }
  }

  const externarAnomalies = await prisma.parcela.findMany({
    where: {
      NOT: {
        id: {
          in: externalfilter,
        },
      },
    },
  });

  // const ret = nfts.filter(async (parcela) => {
  //   const nft = await prisma.parcela.findMany({
  //     where: {
  //       latitud: Number(parcela.data.latitud),
  //       longitud: Number(parcela.data.longitud),
  //       address: parcela.owner,
  //     },
  //   });
  //
  //   return !nft[0];
  // });

  return [ret, externarAnomalies];
}
