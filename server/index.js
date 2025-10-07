import express, {json} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { userRoute } from './Route/userRoute.js';
import { incomeRoute } from './Route/incomeRoute.js';
import { budgetRoute } from './Route/budgetRoute.js';
import { expenseRoute } from './Route/expenseRoute.js';
import { goalRoute } from './Route/goalRoute.js';
import { notifyRoute } from './Route/notification.js';
import { authenticate } from './MiddleWare/auth.js';
import { savingRoute } from './Route/savings.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3838",
    credentials:true
}))

app.use(json())

app.use('/', userRoute)
app.use('/',authenticate, incomeRoute)
app.use('/',authenticate, budgetRoute)
app.use('/',authenticate, expenseRoute)
app.use('/',authenticate, goalRoute)
app.use('/',authenticate, savingRoute)
app.use('/',authenticate, notifyRoute)

mongoose.connect("mongodb://localhost:27017/SaveSage").then(() => {
        console.log("MongoDB is connected successfully to SaveSage");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

app.listen(process.env.PORT,()=>{
    console.log(`Sever is listening to port ${process.env.PORT}`);    
});
