const express = require("express");
const app = express();
const ExpressError = require("./ExpressError");

const checkToken=(req,res,next)=>{
    let {token}=req.query;
    if(token==="giveaccess"){
        next();
    }
    throw new ExpressError(401,"Access denied!")
}
app.get("/api",checkToken,(req,res)=>{
    res.send("data");
})
app.use((err,req,res,next)=>{
    console.log("--Error--")
    next(err);
})
app.use((err,req,res,next)=>{
    let {status,message}=err;
    res.status(status).send(message)
})
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
  });
  