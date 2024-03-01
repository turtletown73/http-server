var refresh = function() {

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        document.getElementById("text").textContent = "";
        for (i in JSON.parse(xmlHttp.response)) {
            var li = document.createElement("li");
            li.innerText = JSON.parse(xmlHttp.response)[i];
            document.getElementById("text").appendChild(li);
        }
    }
}
xmlHttp.open("GET", window.location.href + 'text', true);
xmlHttp.send(null);
}

var run = function() {
    refresh();
    setTimeout(function() {run();}, 500);
}

run();