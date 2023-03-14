const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const createHistory = async (_pid, date,address) => {
  const m2used = getRandomInt(30, 70)
  const m3 = getRandomInt(1, 5)
  const pid  = 'clf77gfbf000yf9rkfa6w90y7';
  await prisma.history.create({
    data: {
      pid:pid,
      m2used,
      m3,
      address,
      date,
    }
  })
}
export default async function handle(req, res) {
    try{
    const startDate = new Date('2022-03-13')
    const endDate = new Date('2023-03-13')
    console.log(req.query.pid)
    const _id  = req.query.pid;
    const address= "0x40123b7b3A98A70FE8dD53fbA34938a6a232cf4e"
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 7)) {
      await createHistory(_id, date,address)
    }
    
    res.status(200).json(address);
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: "Error occured." });
  }
}