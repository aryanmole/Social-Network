import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import postRoute from './routes/posts.routes.js'
import userRoute from './routes/user.routes.js'

const app=express()

app.use(cors())
app.use(express.json())
app.use(postRoute)
app.use(userRoute)
app.use("/uploads", express.static("uploads"))


const start = async()=>{
    const connectDB = await mongoose.connect("mongodb+srv://aryanmole_db_user:Pass123@socialnetwork.ekgzhqe.mongodb.net/?appName=SocialNetwork")


    app.listen(8000,()=>[
        console.log("server is running")
        
    ])
}

start()