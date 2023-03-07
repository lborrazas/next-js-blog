// // const PDFDocument = require('pdfkit');
// // const fs = require('fs');
// import { useState, useEffect } from "react";
// import { useUser } from "../../contexts/AppContext";
// import { useAddress } from "../../blockchain/BlockchainContext";
// import { useRouter } from "next/router";
// import useSWR from "swr";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import { DataGrid } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";


export default function home({ users }) {
//     const router = useRouter();
//     const address = useAddress();
//     const user = useUser();
//     const [errora, setError] = useState(null);
//     const [rows, setRows] = useState();
//     const [inputValue, setInputValue] = useState('');

//     const fetcher = (url) => fetch(url).then((res) => res.json());

//     const { data, error, isLoading } = useSWR(address ? `/api/pdf/${address}` : null, fetcher)

//     // Generar el documento PDF
//     // const doc = new PDFDocument();

//     // Escribir los datos en el PDF
//     // data.forEach((item, index) => {
//         // doc.text(`Item ${index + 1}: ${JSON.stringify(item)}`);
//     // });

//     // Escribir el archivo PDF en el sistema de archivos
//     // doc.pipe(fs.createWriteStream('data.pdf'));

//     // Descargar el archivo PDF
//     // res.setHeader('Content-Type', 'application/pdf');
//     // res.setHeader('Content-Disposition', 'attachment; filename=data.pdf');
//     // doc.pipe(res);
//     // doc.end();

//     // const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// // Definir el array de objetos JSON

// // Definir las columnas del archivo CSV
// // const csvWriter = createCsvWriter({
// //   path: 'output.csv',
// //   header: [
// //     { id: 'name', title: 'Name' },
// //     { id: 'age', title: 'Age' },
// //     { id: 'city', title: 'City' },
// //     { id: 'a', title: 'City' },
// //     { id: 'c', title: 'City' },
// //     { id: 'd', title: 'City' },
// //     { id: 'f', title: 'City' },
// //     { id: 'g', title: 'City' },
// //     { id: 'j', title: 'City' },
// //   ],
// // });

// // Escribir los datos en el archivo CSV
// csvWriter.writeRecords(data)
//   .then(() => console.log('The CSV file was written successfully'));


//   const http = require('http');

//   const archivo = 'contenido del archivo';
  
//   http.createServer((req, res) => {
//     res.setHeader('Content-disposition', 'attachment; filename=output.csv');
//     res.setHeader('Content-type', 'text/CSV');
//     res.write(csvWriter);
//     res.end();
//   }).listen(3000, () => {
//     console.log('Servidor iniciado en el puerto 3000');
//   });

// csvWriter.download

//     return (<div className="App">PDF</div>)

}  

