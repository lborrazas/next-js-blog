const { PrismaClient } =  require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { address } = req.query;
  if (address === "admin") {
    try {
      const result = await prisma.$queryRaw`SELECT p.*, h.*
            FROM "Parcela" p
            LEFT JOIN (
              SELECT pid, MAX(date) AS max_date
              FROM "History"
              GROUP BY pid
            ) latest ON p.id = latest.pid
            LEFT JOIN "History" h ON latest.pid = h.pid AND latest.max_date = h.date`;

            for(let i = 0; i<result.length; i++){
                const user = await prisma.user.findMany({
                    where:{
                        address: result[i].address,
                    },
                  });
                result[i].userName = user[0].name;
            }
            res.status(200).json(result);
        }
        catch(err){
            console.log(err);
            res.status(508).json({ err: "Error occured while adding a new food." });
        }
    }else{
        try{
            const result = await prisma.$queryRaw`SELECT p.*, h.*
            FROM "Parcela" p
            LEFT JOIN (
              SELECT pid, MAX(date) AS max_date
              FROM "History"
              WHERE address = ${address}
              GROUP BY pid
            ) latest ON p.id = latest.pid
            LEFT JOIN "History" h ON latest.pid = h.pid AND latest.max_date = h.date
            WHERE p.address = ${address}`
            res.status(200).json(result);
        }
        catch(err){
            console.log(err);
            res.status(508).json({ err: "Error occured while adding a new food." });
        }
    }
    



  // try {
  //     const parcelas = await prisma.parcela.findMany({where:
  //         {address:address}
  //         }
  //     )
  //     const post = await parcelas.map(async(parcela)=>{
  //         const hist = await prisma.history.findMany({
  //             orderBy:{date:'desc'},
  //             take: 1,
  //             where:{pid:parcela.id}
  //         })
  //         const token=Object.assign({}, parcela, hist[0]);
  //         console.log(token)
  //         return token
  //     })
  //
  //     res.status(200).json(post);
  // }
  // catch (err) {
  //     console.log(err);
  //     res.status(508).json({ err: "Error occured while adding a new food." });
  // }
}
