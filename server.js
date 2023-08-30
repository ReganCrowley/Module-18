const express = require('express')
const db = require('./config/connection');
const app = express()
const PORT = 3001
//const routes = require('./routes');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(routes);

app.use("/api", require("./routes/route"));

db.connect();
app.listen(PORT, () => {
  console.log(`Example app listening on port HTTP://localhost:${PORT}`)
})