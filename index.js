const express = require("express");
const fs = require("node:fs");
const {spawn} = require("node:child_process")
const app = express();
const bodyParser = require('body-parser');

app.use('/chat', express.static('chat/static'));
app.use('/games', express.static('games/static'));
app.use('/', express.static('main/static'));
app.use(bodyParser.urlencoded({extended: false}));

spawn("cd games/backend/eaglercraft/server && sudo sh run_unix.sh", {shell: true});
spawn("cd games/backend/eaglercraft/bungeecord && sudo sh run_unix.sh", {shell: true});
spawn("cd games/backend/eaglercraft/relay && sudo sh run.sh", {shell: true});

app.post('/chat/text', (req, res) => {
    res.redirect("/chat");

    fs.readFile("./chat/resources/aliases.txt", "utf8", function(err, data) {
        ips = JSON.parse(data);
        fs.readFile("./chat/resources/banlist.txt", "utf8", function(err, data) {
            banlist = JSON.parse(data);
            if (!banlist[req.ip.substring(7)] == 1) {
                fs.readFile('./chat/messages/latestmsg.txt', 'utf8', function(err, data) {
                    if ((ips[req.ip.substring(7)] == "Aidan" || req.ip.substring(7) == "127.0.0.1") && req.body.message.startsWith("/")) {
                        if (req.body.message.substring(1).startsWith("say")) {
                            fs.writeFile('./chat/messages/latestmsg.txt', (parseInt(data) - 1).toString(), function() {});
                            fs.writeFile(`./chat/messages/msg${parseInt(data) - 1}.txt`, '[SERVER] ' + req.body.message.substring(5), function() {});
                        }
                    }
                    else {
                        fs.writeFile('./chat/messages/latestmsg.txt', (parseInt(data) - 1).toString(), function() {});
                        if (ips[req.ip.substring(7)]) {
                            fs.writeFile(`./chat/messages/msg${parseInt(data) - 1}.txt`, ips[req.ip.substring(7)] + ' says "' + req.body.message + '"', function() {});
                        }
                        else {
                            fs.writeFile(`./chat/messages/msg${parseInt(data) - 1}.txt`, req.ip.substring(7) + ' says "' + req.body.message + '"', function() {});
                        }
                    }
                });
            }
        });
    });
});

app.get('/chat/text', (req, res) => {
    var text = [];

    fs.readdir('./chat/messages', function(err, files) {
        for (const i in files) {
            fs.readFile(`./chat/messages/${files[i]}`, 'utf8', function(err,data) {
                if (files[i] != "latestmsg.txt") {
                    text.push(data);
                }

                if (i == files.length - 1) {
                    res.send(text);
                }
            });
        }
    });
});

console.log("Games' backends running!")

app.listen(80, () => {
    console.log(`Website listening on port 80`);
});

app.listen(8080, () => {
    console.log(`Website listening on port 8080`);
});