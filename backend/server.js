import express from 'express'
import dotenv from 'dotenv'
import { connectdb } from './connectdb.js'
import cors from 'cors'
import donorRoutes from './route/donor.js'

const app = express()

app.use(express.json())
app.use(cors())
dotenv.config()

const port = process.env.PORT || 8000
const URI = process.env.MONGO_URI



async function start(URI){
    try{
        await connectdb(URI)
        app.listen(port,()=>{
        console.log("Server has started at port num 8000")
        }) 
    }
    catch(err){
        console.log("Connection failed")
        console.log(err)
    }
}

start(URI)

// Routes
app.use('/api/donor', donorRoutes) 