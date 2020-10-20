const http = require("http");
const static = require("node-static");
const fs = require("fs");
const port = 3000;

var file = new static.Server("./dist");

let server = require("http").createServer(function (request, response) {
  request
    .addListener("end", function () {
      //
      // Serve files!
      //
      file.serve(request, response);
    })
    .resume();
});

// let server = http.createServer((req, res) => {
//   console.log(req.url);

//   switch (req.url) {
//     case "/":
//       res.writeHead(200, { "Content-Type": "text/html" });
//       fs.readFile("dist/index.html", (error, data) => {
//         if (error) {
//           res.writeHead(404);
//           res.write("file not found. Get out !!");
//         } else {
//           res.write(data);
//         }
//         res.end();
//       });
//       //   res.write("hello !!!");

//       break;
//     case "/style.97fcb138.css":
//       res.writeHead(200, { "Content-Type": "text/css" });
//       fs.readFile("dist/style.97fcb138.css", (error, data) => {
//         if (error) {
//           res.writeHead(404);
//           res.write("file not found. Get out !!");
//         } else {
//           res.write(data);
//         }
//         res.end();
//       });
//       break;
//     case "/style.97fcb138.js":
//       res.writeHead(200, { "Content-Type": "application/javascript" });
//       fs.readFile("dist/style.97fcb138.js", (error, data) => {
//         if (error) {
//           res.writeHead(404);
//           //   res.write("file not found. Get out !!");
//         } else {
//           res.write(data);
//         }
//         res.end();
//       });
//       break;
//     case "/script.221c08a2.js":
//       res.writeHead(200, { "Content-Type": "application/javascript" });
//       fs.readFile("dist/script.221c08a2.js", (error, data) => {
//         if (error) {
//           res.writeHead(404);
//           //   res.write("file not found. Get out !!");
//         } else {
//           res.write(data);
//         }
//         res.end();
//       });
//       break;
//     case "/textures/2k_earth_daymap.jpg":
//       res.writeHead(200, { "Content-Type": "image/jpeg" });
//       fs.readFile("dist/textures/2k_earth_daymap.jpg", (error, data) => {
//         if (error) {
//           res.writeHead(404);
//           //   res.write("file not found. Get out !!");
//         } else {
//           res.write(data);
//         }
//         res.end();
//       });
//       break;

//     case "/tle_data/spacex.txt":
//       res.writeHead(200, { "Content-Type": "text/plain" });
//       fs.readFile("dist/tle_data/spacex.txt", (error, data) => {
//         if (error) {
//           res.writeHead(404);
//           //   res.write("file not found. Get out !!");
//         } else {
//           res.write(data);
//         }
//         res.end();
//       });
//       break;
//     default:
//       break;
//   }
// });

server.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server listening on port ${port} Sir.`);
  }
});
