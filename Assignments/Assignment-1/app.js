const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) => {
    if(req.url === '/'){
        res.setHeader("Content-Type", "text/html");
        res.write('<html>')
        res.write('<head><title>Assignment1</title></head>')
        res.write('<body><h1>Hello! How are you?</h1><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Submit</button></from></body>')
        res.write('</html>')
        return res.end();
    }
    if(req.url === '/users'){
        res.write('<html>')
        res.write('<head><title>Assignment1 - User List</title></head>')
        res.write('<body><ul><li>user1</li><li>user2</li></body>')
        res.write('</html>')
        return res.end();
    }
    if(req.url === '/create-user' && req.method === 'POST'){
        console.log("jj");
        const body = [];
        req.on("data" , chunk => {
            // console.log(chunk);
            body.push(chunk)
        })
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const username = parsedBody.split("=")[1]
            // res.write(parsedBody)
            fs.writeFile('users.txt', username, (err) => {
                res.statusCode = 201;
                res.setHeader('Location', '/');
                res.end();
            })
        })
    }
})

server.listen(3000)