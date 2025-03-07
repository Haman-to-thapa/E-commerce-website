import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

const app = express()
app.use(express.json())
app.use(cors())

dotenv.config();


const PORT = process.env.PORT || 3000;


//connected to be mongoDb
connectDB();

app.get('/', (req, res) => {
  res.send("Welcom to new Page");
})

app.listen(PORT, () => {
  console.log(`server is runing on http://localhost:${PORT}`);
})