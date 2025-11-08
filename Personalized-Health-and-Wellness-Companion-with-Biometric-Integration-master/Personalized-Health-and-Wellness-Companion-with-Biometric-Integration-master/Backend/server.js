require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



app.use(cors({
    origin: "http://localhost:5173",  // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    credentials: true, // if using cookies/auth
  }));
// ✅ Handle OPTIONS preflight requests manually (important!)
//app.options("*", cors());

  app.get("/", (req, res) => {
    res.send("Backend is running.");
  });

  

app.use(bodyParser.json());
app.use(express.json());



mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("mongodb connected"))
.catch( err => console.log(err));
const  authRoutes =require('./routes/Auth')
const healthProfile =require('./routes/HealthProfileRoute')
const UserRoute =require('./routes/userRoute')

app.use('/api/auth', authRoutes);
app.use('/api/UserData',healthProfile)
app.use('/api/users', UserRoute);
