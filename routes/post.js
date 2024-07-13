const express = require("express");
const app = express();
const router=express.Router()

router.get("/post",(req,res)=>{
    res.send("Cookie!")
})
router.get("/post/:id",(req,res)=>{
    res.send("Post-Id")
})
router.get("/post/new",(req,res)=>{
    res.send("working post")
})
router.post("/post",(req,res)=>{
    res.send("Cookie!")
})
router.post("/post/:id",(req,res)=>{
    res.send("Post-Id")
})
router.post("/post/new",(req,res)=>{
    res.send("working post")
})
module.exports=router;