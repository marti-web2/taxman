const express = require('express')
const app = express()
const PORT = 4000

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.listen(PORT, (error) => {
  if (!error) { console.log("Server is Successfully Running, and App is listening on port " + PORT) }
  else { console.log("Error occurred, server can't start", error); }
}
)