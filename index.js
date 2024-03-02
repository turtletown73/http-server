const express = require("express");
const fs = require("node:fs");
const {spawn} = require("node:child_process")
const app = express();
const bodyParser = require('body-parser');

app.use('/chat', express.static('/home/scoobis/Documents/http-server/chat/static'));
app.use('/games', express.static('/home/scoobis/Documents/http-server/games/static'));
app.use('/', express.static('/home/scoobis/Documents/http-server/main/static'));
app.use(bodyParser.urlencoded({extended: false}));

spawn("cd /home/scoobis/Documents/http-server/games/backend/eaglercraft/server && sudo sh run_unix.sh", {shell: true});
spawn("cd /home/scoobis/Documents/http-server/games/backend/eaglercraft/bungeecord && sudo sh run_unix.sh", {shell: true});
spawn("cd /home/scoobis/Documents/http-server/games/backend/eaglercraft/relay && sudo sh run.sh", {shell: true});
spawn("sudo playit", {shell: true});

app.post('/chat/text', (req, res) => {
    res.redirect("/chat");

    fs.readFile("/home/scoobis/Documents/http-server/chat/resources/banlist.txt", "utf8", function(err, data) {
        banlist = JSON.parse(data);
        if (!banlist[req.ip.substring(7)] == 1) {
            fs.readFile('/home/scoobis/Documents/http-server/chat/messages/latestmsg.txt', 'utf8', function(err, data) {
                fs.writeFile('/home/scoobis/Documents/http-server/chat/messages/latestmsg.txt', (parseInt(data) + 1).toString(), function() {});
                fs.writeFile(`/home/scoobis/Documents/http-server/chat/messages/msg${parseInt(data) + 1}.txt`, 'someone says "' + req.body.message + '"', function() {});
            });
        }
    });
});

app.get('/chat/text', (req, res) => {
    var text = [];

    fs.readdir('/home/scoobis/Documents/http-server/chat/messages', function(err, files) {
        for (const i in files.reverse()) {
            fs.readFile(`/home/scoobis/Documents/http-server/chat/messages/${files[i]}`, 'utf8', function(err,data) {
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

app.listen(80, () => {
    console.log(`Website running!`);
});