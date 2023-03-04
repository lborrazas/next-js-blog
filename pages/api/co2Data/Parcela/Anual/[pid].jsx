const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const events = await prisma.history.findMany({
    where: {
      pid: req.query.pid,
      date: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // >= 1 year ago
        lte: new Date(), // <= today
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  const data = eventsToData(events);
  res.json(data);
}

function eventsToData(events) {
  let month;
  let value = 0;
  const data = [];
  let lastEvent;
  let primerDia;
  events.forEach((event) => {
    //caso 0
    if (!month) {
      month = getMonthName(event.date.getMonth());
      lastEvent = event;
    }
    //caso cambio de mes
    if (getMonthName(event.date.getMonth()) !== month) {
      // eslint-disable-next-line prettier/prettier
      primerDia = new Date(
        event.date.getFullYear(),
        event.date.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
      value = value + (primerDia - event.date) * event.m2used * event.m3;
      data.push({
        month: month,
        value: value,
      });
      month = getMonthName(event.date.getMonth());
      value = 0;
    }
    value = value + (lastEvent.date - event.date) * event.m2used * event.m3; //todo hacer bien el calculo
    lastEvent = event;
  });
  //ultimo caso
  const currentDate = new Date();
  value =
    value + (currentDate - lastEvent.date) * lastEvent.m2used * lastEvent.m3;
  data.push({
    month: month,
    value: value,
  });
  return data;
}

function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber);

  return date.toLocaleString("en-US", {
    month: "long",
  });
}
