const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();
const constante = 0.1*1619/(15*1000*24*60*60*1000)
export default async function handle(req, res) {
  const events = await prisma.history.findMany({
    where: {
      pid: req.query.pid,
    },
    orderBy: {
      date: "desc",
    },
  });
  const data = eventsToValue(events);
  res.json(data);
}

function eventsToValue(events) {
  let value = 0;
  const data = [];
  let lastEvent;
  events.forEach((event) => {
    if (!lastEvent) {
      lastEvent = event;
    }
    value = value + (lastEvent.date - event.date) * event.m2used * event.m3*constante; //todo hacer bien el calculo
    lastEvent = event;
  });
  //ultimo caso
  const currentDate = new Date();
  value =
    value + (currentDate - lastEvent.date) * lastEvent.m2used * lastEvent.m3*constante;
  return value;
}
