import 'dotenv/config'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'
import flash from 'connect-flash'

const app = express()
const port = process.env.PORT || 3003

//DB Connection
mongoose.connect(process.env.DB_CONNECTION).then(() => {
  console.log('DB Connected Successfully');
}).catch((err) => {
  console.log(err);
})



// Importing Auth Routes
import authRoute from './routes/authRoutes/authRoute.js'

// Importing User Routes
import userDashboardRoute from './routes/studentRoutes/dashboardRoute.js'
import studentSem1Route from './routes/studentRoutes/sem1Route.js'

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        cookie: { maxAge: 6000 },
        resave: true,
        saveUninitialized: false
    })
)

app.use(flash())

// Set template engine
app.set("view engine", "ejs");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// Auth Routes
app.use('/student', authRoute)

// User Routes
app.use('/student', userDashboardRoute)
app.use('/student', studentSem1Route)

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})