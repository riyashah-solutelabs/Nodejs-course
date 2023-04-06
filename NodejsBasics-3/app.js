const http = require('http');

const routes = require('./routes')

// function rqListener(req, res) {

// }
// http.createServer(rqListener);

// http.createServer((req,res) => {
//     console.log(req);
// }).listen(3000,() => {
//     console.log('listening on 3000...');
// })
console.log(routes.someText);
const server = http.createServer(routes.handler)
server.listen(4000,() => {
    console.log('listening on 4000...');
})