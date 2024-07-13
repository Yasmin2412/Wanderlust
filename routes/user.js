const express = require("express");
const app = express();
const router=express.Router()


router.get("/",(req,res)=>{
    res.send("User")
})

router.get("/:id",(req,res)=>{
    res.send("ID")
})

router.get("/:id/edit",(req,res)=>{
    res.send("Edit")
})
module.exports=router;