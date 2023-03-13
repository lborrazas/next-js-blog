import { eventsToData } from "../../../../../utils/Co2GraphUtils";
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
  if (events.length === 0) return [];
  const data = eventsToData(events);
  res.json(data);
}
