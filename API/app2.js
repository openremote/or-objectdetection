const express = require('express')
const app = express()
const port = 3000

var fs = require("fs");

console.log("Started");

var config = JSON.parse(fs.readFileSync("/home/openremote/Desktop/darknet-master/data.json"));

console.log("Initial config: ", config);  

fs.watchFile("/home/openremote/Desktop/darknet-master/data.json", function(current, previous){  

    console.log("Config Changed");  
    config = JSON.parse(fs.readFileSync("/home/openremote/Desktop/darknet-master/data.json"));  
    app.get('/', (_req, res) => res.json(config))
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
