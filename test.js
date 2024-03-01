const https = require("https");
const fs = require("fs");

https.request(new URL("https://www.robotevents.com/api/seasons/180/skills?post_season=0&grade_level=Middle%20School"), function(res) {
    res.setEncoding("utf8");

    var string = "";

    res.on('data',function (chunk) {
        string = string + chunk
    });

    res.on("end", function() {
        var scores = JSON.parse(string);
        var qualifying = [];

        for (var i in scores) {
            if (scores[i].team.team.startsWith("1024V")) {
                qualifying.push({team:scores[i].team.team,distance_to_worlds:scores[i].rank - 420,point_distance_to_worlds:(scores[419].scores.score - scores[i].scores.score) + 1,score:scores[i].scores.score,driving:scores[i].scores.driver,coding:scores[i].scores.programming});
            }
        }

        fs.writeFile("./skills.txt", JSON.stringify(qualifying), function() {})
    });
}).end();
