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
  let year;
  let value = 0;
  const data = [];
  let lastEvent;
  let primerDia;
  events.forEach((event) => {
    if (!month) {
      month = event.date.getMonth();
      lastEvent = event;
    }
    //caso cambio de mes
    if (event.date.getMonth() !== month) {
      while (Math.abs(event.date.getMonth() - month) > 1) {
        year = lastEvent.date.getFullYear();
        if (month === 12) {
          month = 0;
          year++;
        }
        data.push({
          month: ` ${getMonthName(month)} ${year} `,
          value: value,
        });
        month = month + 1;
      }
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
        month: ` ${getMonthName(month)} ${event.date.getFullYear()} `,
        value: value,
      });
      month = event.date.getMonth();
      value = 0;
    }
    value = value + (event.date - lastEvent.date) * event.m2used * event.m3;
    month = event.date.getMonth(); //todo hacer bien el calculo
    lastEvent = event;
  });
  const currentDate = new Date();
  value =
    value + (currentDate - lastEvent.date) * lastEvent.m2used * lastEvent.m3;
  data.push({
    month: ` ${getMonthName(month)} ${lastEvent.date.getFullYear()} `,
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
