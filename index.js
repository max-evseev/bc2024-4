const { program } = require('commander');
const superagent = require('superagent');
const nodemon = require('nodemon');
const http = require('http');
program
.option('-h, --host <server host>')
.option('-p, --port <server port>')
.option('-c, --cache <cache directory>');
program.parse();
const options = program.opts();
    const server = http.createServer(function (req, res) {
    res.write("currently running");
    res.end();
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