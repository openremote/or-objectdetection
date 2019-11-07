const express = require('express')
const app = express()
const port = 3000


var json_data = require('/home/openremote/Desktop/darknet-master/data.json');


app.get('/', (_req, res) => res.json(json_data))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
