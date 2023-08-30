const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDb');
const userRouter = require('./routes/userRoute');
const transactionRouter = require('./routes/transactionRoutes');

// configure dotenv file
dotenv.config();

const app = express();
// middlewares connection
app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/transaction', transactionRouter);

app.get('/', (req, res) => {
    res.send('Server Is Running');
})

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        const PORT = 8080 | process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();