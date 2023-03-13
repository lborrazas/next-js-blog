const { PrismaClient } = require("./../../../node_modules/.prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

export default async function handle(req, res) {
  const { address } = req.query;
  try {
    const result = await prisma.$queryRaw`SELECT *
      FROM "History"
      INNER JOIN "Parcela"
      ON "Parcela".id = "History".pid
      WHERE "History".address = ${address};`;
    console.log(address);
    const k = 0.1;
    const time = 1;
    const createCsvWriter = require("csv-writer").createObjectCsvWriter;
    const headers = Object.keys(result[0]).join(",") + ",CO2 Absorvido" + "\n";
    const rows = result.map((obj) => Object.values(obj).join(",")+ "," + (obj.m2used*obj.m3*k*time)).join("\n");
    console.log(headers)
    console.log(rows)
    const csv = headers + rows;
    fs.writeFile("public/reportes/" + address + ".csv", csv, (err) => {
      if (err) throw err;
      console.log("CSV file saved!");
    });

    res.status(200).json("/reportes/" + address + ".csv");
  } catch (err) {
    res
      .status(400)
      .json({ err: "Error occured while adding a new food." + err });
  }
}
