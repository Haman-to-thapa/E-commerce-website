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
import adminRoutes from './routes/adminRoutes.js'
import productAdminRoutes from './routes/productAdminRoutes.js'
import adminOrderRoutes from './routes/adminOrderRoutes.js'

const app = express()
// app.use(express.json())
// Configure CORS to allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

dotenv.config();


const PORT = process.env.PORT || 3000;


//connected to be mongoDb
connectDB();

app.post('/', (req, res) => {
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


// Admin User
app.use('/api/admin/users', adminRoutes)
app.use('/api/admin/products',productAdminRoutes)
app.use('/api/admin/orders',adminOrderRoutes)

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`server is runing on http://localhost:${PORT}`);
})
