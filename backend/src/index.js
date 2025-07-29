const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const cors = require('cors');

// ✅ Must be placed before any `app.use(...)` routes
const allowedOrigins = [
  'http://localhost:5173',                    // local dev frontend
  'https://leetcode-frontend.netlify.app'    // your Netlify frontend URL (check spelling carefully)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ These should come after CORS
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use("/video", videoRouter);

// Start server
const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Server listening at port number: " + PORT);
    });
  } catch (err) {
    console.log("Error: " + err);
  }
};

InitalizeConnection();


