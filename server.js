const express = require('express');
const port = process.env.PORT || 80;

const app = express();

const BASE_PATH = `${__dirname}/dist/`

app.use(express.static(BASE_PATH));

app.get(/.*/, (req, res) => {
  res.sendfile(`${BASE_PATH}/index.html`)
})

app.listen(port);

console.log('Server started on port '+ port);