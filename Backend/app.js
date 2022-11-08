const express = require("express");
const bodyParser= require("body-parser");
const cookieParser=require("cookie-parser");
const errorMiddleware = require("./Middleware/error")

const app = express();

app.use(express.json({
    limit: "50mb"
}))

app.use(bodyParser.urlencoded({
    limit:"50mb",
    extended:true //to recieve more mb data 
}))

app.use(cookieParser());

const User = require("./Routes/userRoutes")
const Product = require("./Routes/productRoutes")
const  Review= require("./Routes/reviewRoutes")

app.use("/api/v1",User)  //user table
app.use("/api/v1",Product) //product table
app.use("/api/v1",Review) //review table

app.use(errorMiddleware)

module.exports=app;

