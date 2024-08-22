import express from "express";
import dotenv from "dotenv";

import router from "./ApiRouters.mjs";
import mongoose from "mongoose";

dotenv.config({path:"./.env"})

const app=express();
const port=process.env.PORT||8080;

app.use(express.json());


app.use("/api",router);
app.all("*",(req,res)=>{
    return res.status(404).json({error:"Page Not found"});
});

app.listen(port,()=>{
    const mongoUrl=process.env.MONGO_URL||"mongodb://localhost:27017";
    mongoose.connect(mongoUrl)
            .then(()=>console.log("connected to mongoose"))
            .catch((err)=>console.log(err));

    console.log("server listining on 8080");

});