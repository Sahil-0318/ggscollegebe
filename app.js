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



// Importing Students's Auth Routes
import authRoute from './routes/authRoutes/authRoute.js'
import recoverCredentialRoute from './routes/authRoutes/recoverCredential.js'

// Importing Admin's Auth Routes
import adminAuthRoute from './routes/adminAuthRoutes.js/adminAuthRoute.js'

// Importing User Routes
import userDashboardRoute from './routes/studentRoutes/dashboardRoute.js'
import studentSem1Route from './routes/studentRoutes/sem1Route.js'
import studentSem2Route from './routes/studentRoutes/sem2Route.js'

// Importing Admin Routes
import adminDashboardRoute from './routes/adminRoutes/dashboardRoute.js'
import noticeRoute from './routes/noticeRoutes/noticeRoute.js'

// Importing UG Reg Admission Admin Routes
import ugReg25_29AdminRoute from './routes/ugRegAdmAdminRoutes/ugRegAdmListRoute.js'


// Importing API Routes
import noticeAPIRoute from './routes/noticeRoutes/noticeAPIRoute.js'


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

// Student's Auth Routes
app.use('/student', authRoute)
app.use('/student', recoverCredentialRoute)

// Student's Auth Routes
app.use('/admin', adminAuthRoute)


// User Routes
app.use('/student', userDashboardRoute)
app.use('/student', studentSem1Route)
app.use('/student', studentSem2Route)


// Admin Routes
app.use('/admin', adminDashboardRoute)
app.use('/admin', noticeRoute)

// UG Reg Admission Admin Routes
app.use('/admin', ugReg25_29AdminRoute)

// User Routes
app.use('/api', noticeAPIRoute)


app.use((req, res, next) => {
  res.status(404).render("auth/pageNotFound");
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})