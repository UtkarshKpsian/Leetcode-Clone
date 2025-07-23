const express = require('express');
const app = express();
require('dotenv').config();

const main = require('./config/db');
const cookieParser = require('cookie-parser');

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
const authRouter = require('./routes/userAuth');
app.use('/auth', authRouter);  // /auth/register, /auth/login

// Optional: default route
app.get('/', (req, res) => {
    res.send("🚀 Server is running");
});

// DB connect and server start
main()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("✅ Server listening at port:", process.env.PORT);
    });
})
.catch(err => console.log("❌ Error Occurred:", err));





