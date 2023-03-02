const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const events = await prisma.history.findMany({
    where: {
      pid: req.query.pid,
    },
  });
  data = eventsToData(events);
  res.json(data);
}

function eventsToData(events) {
  console.log(events);
  events.forEach((event) => {});
}
