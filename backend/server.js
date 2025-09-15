import express from 'express'
import cors from "cors"
import { connectDB } from './config/db.js';
import dotenv from 'dotenv'
dotenv.config()
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

//app config
const app = express()
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(express.json());


//DB connection
connectDB();

//api endPoint
app.use('/api/food', foodRouter)
app.use('/images', express.static('uploads'))
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter)

app.listen(port, () => {
    console.log(`server started on http://localhost:${port}`)

})