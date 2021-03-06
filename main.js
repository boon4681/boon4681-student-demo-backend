require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(express.json({limit: '8mb'}))

app.use(require('./src/routes'))

app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
})