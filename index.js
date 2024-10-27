const { program } = require('commander');
const superagent = require('superagent');
const nodemon = require('nodemon');
const http = require('http');
const fs = require('fs').promises;
program
.option('-h, --host <server host>')
.option('-p, --port <server port>')
.option('-c, --cache <cache directory>');
program.parse();
const options = program.opts();
    const server = http.createServer(async (req, res) => {
        if (req.method === 'GET') {
            try {
            const contents = await fs.readFile(options.cache + '/' + req.url.slice(1) + '.jpg');
            res.writeHead(200, "OK", { "Content-Type": "image/jpeg" });
            res.end(contents);
            }
            catch {
                try {
                const request = await superagent.get("https://http.cat/" + req.url.slice(1));
                const contents = await request.body;
                await fs.writeFile(options.cache + '/' + req.url.slice(1) + '.jpg', contents);
                res.writeHead(200, "OK", { "Content-Type": "image/jpeg" });
                res.end(contents);
                }
                catch {
                res.writeHead(404, "Not found", { "Content-Type": "text/plain" });
                res.write("not found");
                res.end();
                }
            }
        } 
        else if (req.method === 'PUT') {
        const data = [];
            req.on('data', chunk => {
            data.push(chunk);
            });
            req.on('end', async () => {
                const contents = Buffer.concat(data);
                try {
                await fs.writeFile(options.cache + '/' + req.url.slice(1) + '.jpg', contents);
                res.writeHead(201, "Created", { "Content-Type": "text/plain" });
                res.end("picture was successfuly uploaded");
                }
                catch {
                res.writeHead(404, "Not found", { "Content-Type": "text/plain" });
                res.write("not found");
                res.end();
                }
            });
        }
        else if (req.method === 'DELETE') {
            try {
            await fs.unlink(options.cache + '/' + req.url.slice(1) + '.jpg');
            res.writeHead(200, "OK", { "Content-Type": "text/plain" });
            res.end("picture was successfuly deleted");
            }
            catch {
            res.writeHead(404, "Not found", { "Content-Type": "text/plain" });
            res.write("not found");
            res.end();
            }
        }
        else {
        res.writeHead(405, "Method not allowed", { "Content-Type": "text/plain" });
        res.write("method not allowed");
        res.end();
        }
    });
    if (options.host === undefined || options.port === undefined || options.cache === undefined) {
    console.log("please specify host, port and cache if u want server to work");
    return;
    }   
    else {
        server.listen(options.port, function (error) {
            if (error) {
            console.log("cannot load server", error);
            }
            else {
            console.log("server has successfully started");
            }
        });
    }