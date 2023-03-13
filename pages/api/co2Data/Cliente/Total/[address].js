const { PrismaClient } = require(".prisma/client");
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const events = await prisma.history.findMany({
    where: {
      address: req.query.address,
      date: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // >= 1 year ago
        lte: new Date(), // <= today
      },
    },
    orderBy: [{ pid: "desc" }, { date: "asc" }],
  });
  const data = eventsToData(events);
  res.json(data);
}

function eventsToData(events) {
  let month;
  let year;
  let value = 0;
  let data = [];
  const dataTotal = [];
  let lastEvent;
  let primerDia;
  let pid;
  if (events.length === 0) return "0";
  events.forEach((event) => {
    console.log(event);
    //todo hacer por evento y agregar ahi a data va a quedar un vector de vectores recorro los vectores y ahi agrego a un total data
    if (!pid) pid = event.pid;
    if (pid === event.pid) {
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
          month: ` ${getMonthName(month)} ${event.date.getFullYear()} `,
          value: value,
        });
        month = event.date.getMonth();
        value = 0;
      }
      value = value + (event.date - lastEvent.date) * event.m2used * event.m3;
      month = event.date.getMonth(); //todo hacer bien el calculo
      lastEvent = event;
    } else {
      //ultimo caso del anterior
      const currentDate = new Date();
      value =
        value +
        (currentDate - lastEvent.date) * lastEvent.m2used * lastEvent.m3;
      data.push({
        month: ` ${getMonthName(month)} ${lastEvent.date.getFullYear()} `,
        value: value,
      });
      //primer caso del actualr
      dataTotal.push({ data });
      month = event.date.getMonth();
      lastEvent = event;
      pid = event.pid;
      value = 0;
      data = [];
    }
  });

  const currentDate = new Date();
  value =
    value + (currentDate - lastEvent.date) * lastEvent.m2used * lastEvent.m3;
  data.push({
    month: ` ${getMonthName(month)} ${lastEvent.date.getFullYear()} `,
    value: value,
  });
  dataTotal.push({ data });

  const finalData = mergeData(dataTotal);
  let lastValue = 0;
  finalData.forEach((montht) => {
    lastValue = lastValue + montht.value;
  });
  return lastValue;
}

function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber);

  return date.toLocaleString("en-US", {
    month: "long",
  });
}

function mergeData(data) {
  const mergedData = {};

  data.forEach((obj) => {
    obj.data.forEach((entry) => {
      const { month, value } = entry;

      if (mergedData[month]) {
        mergedData[month] += value;
      } else {
        mergedData[month] = value;
      }
    });
  });

  const result = [];

  Object.keys(mergedData).forEach((month) => {
    result.push({ month, value: mergedData[month] });
  });
  return result;
}
