const fs = require("fs");

const requestHandler = (req,res) => {
    const url = req.url
  if (url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Enter Message</title></head>");
        res.write(
        '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
        );
        res.write("</html>");
        // res.end()
        return res.end(); //return bcz niche aapde fri res.end no use krelo 6
    }
  if (url === "/message" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      // console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      // fs.writeFileSync('message.txt',message);
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
//   res.setHeader("Content-Type", "text/html");
//   // res.write('<h1>Hello</h1>');
//   res.write("<html>");
//   res.write("<head><title>My First Page</title></head>");
//   res.write("<body><h1>Hello</h1></body>");
//   res.write("</html>");
//   res.end();
}

// exporting
// module.exports = requestHandler;
// module.exports = {
//     handler:requestHandler,
//     someText: 'Some hard coded text'
// };
// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hard coded text';
exports.handler = requestHandler;
exports.someText = 'Some hard coded text';