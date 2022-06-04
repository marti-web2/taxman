import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express()
const PORT = 5001

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const publicDir = path.join(__dirname, '../client/public')

// app.use(express.static(publicDir, {extensions: ['html']}))

// app.use(function (req, res) {
//   res.status(404).sendFile(publicDir + '/404.html')
// })


app.listen(PORT, _ => {
  console.log(`Server is up and running on PORT ${PORT}.`)
})