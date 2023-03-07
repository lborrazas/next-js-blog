const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const events = await prisma.history.findMany({
    orderBy: [
      {
        pid: "asc"
      },
      { date: "desc" },
    ],
  });
  const data = eventsToValue(events);
  res.json(data);
}

function eventsToValue(events) {
  let value = 0;
  const data = [];
  let lastEvent;
  let actualPid;
  events.forEach((event) => {
    if (!actualPid) {
      actualPid = event.pid;
    }
    if (actualPid !== event.pid) {
      lastEvent = undefined;
    }
    if (!lastEvent) {
      lastEvent = event;
    }
    value = value + (lastEvent.date - event.date) * event.m2used * event.m3; //todo hacer bien el calculo
    lastEvent = event;
  });
  //ultimo caso
  const currentDate = new Date();
  value =
    value + (currentDate - lastEvent.date) * lastEvent.m2used * lastEvent.m3;
  console.log(value);
  return value;
}
