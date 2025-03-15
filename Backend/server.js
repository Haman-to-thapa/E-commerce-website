import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import subscribeRoute from './routes/subscriberRoute.js'

const app = express()
// app.use(express.json())
app.use(cors())
app.use(cors({ origin: '*' }))

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

dotenv.config();


const PORT = process.env.PORT || 3000;


//connected to be mongoDb
connectDB();

app.get('/', (req, res) => {
  res.send("Welcom to new Page");
})

// API Routes 
app.use("/api/users", userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload',uploadRoutes)
app.use('/api',subscribeRoute )



app.listen(PORT, () => {
  console.log(`server is runing on http://localhost:${PORT}`);
})
