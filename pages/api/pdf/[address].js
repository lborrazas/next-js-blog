import { eventsToData } from "../../../utils/Co2GraphUtils";

const { PrismaClient } = require("./../../../node_modules/.prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

export default async function handle(req, res) {
  const { address } = req.query;
  try {
    const result = await prisma.$queryRaw`SELECT p.*, h.*
            FROM "Parcela" p
            LEFT JOIN (
              SELECT pid, MAX(date) AS max_date
              FROM "History"
              WHERE address = ${address}
              GROUP BY pid
            ) latest ON p.id = latest.pid
            LEFT JOIN "History" h ON latest.pid = h.pid AND latest.max_date = h.date
            WHERE p.address = ${address}`;
    const headers = Object.keys(result[0]).join(",") + "\n";
    const rows = result.map((obj) => Object.values(obj).join(",")).join("\n");
    const csv = headers + rows;
    fs.writeFile("public/reportes/" + address + 1231 + ".csv", csv, (err) => {
      if (err) throw err;
      console.log("CSV file saved!");
    });

    console.log("la concha de la lora");
    res.status(200).json("/reportes/" + address + ".csv");
  } catch (err) {
    res
      .status(400)
      .json({ err: "Error occured while adding a new food." + err });
  }
}
