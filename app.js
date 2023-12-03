require('dotenv').config()
const express = require('express');
const connectDB = require('./DB/connection');
const app = express();
const path = require(`path`)
const port = process.env.PORT
const indexRouter = require('./modules/index.router')

app.use('/uploads' , express.static(path.join(__dirname , './uploads')))
app.use(express.json())

app.use('/api/v1/auth' , indexRouter.authRouter)
app.use('/api/v1/user' , indexRouter.userRouter)
app.use("/api/v1/post" , allRouter.postRouter)

connectDB()
app.listen(port, ()=> console.log(`server running on port ${port}`))