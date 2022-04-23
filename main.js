require('dotenv').config()
const express = require('express')
const app = express()

require('./routes/api')(app)

app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
})