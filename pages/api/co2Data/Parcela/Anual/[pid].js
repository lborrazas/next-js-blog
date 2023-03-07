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
      date: "asc",
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
      month = event.date.getMonth();
      lastEvent = event;
    }
    //caso cambio de mes
    if (event.date.getMonth() !== month) {
      while (Math.abs(event.date.getMonth() - month) > 1) {
        month = month + 1;
        if (month === 12) month = 0;
        data.push({
          month: getMonthName(month - 1),
          value: value,
        });
      }
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
      value = value + (event.date - primerDia) * event.m2used * event.m3;
      data.push({
        month: getMonthName(month),
        value: value,
      });
      month = event.date.getMonth();
      value = 0;
    }
    value = value + (event.date - lastEvent.date) * event.m2used * event.m3; //todo hacer bien el calculo
    lastEvent = event;
  });
  //ultimo caso
  const currentDate = new Date();
  value =
    value + (currentDate - lastEvent.date) * lastEvent.m2used * lastEvent.m3;
  data.push({
    month: getMonthName(month),
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
