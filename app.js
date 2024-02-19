const express = require('express');
const app = express();
const port = 3000

const createError = require('http-errors');
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017")
        console.log('connection has been established successfully.');
    }catch (error) {
        console.error('unable to connect to the database:', error);
    } 
})()

const router = require('./routes/index');
app.use('/', router);


app.use(function (req, res, next) {
    next(createError(404));
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})