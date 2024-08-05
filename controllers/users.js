const User=require("../models/user.js")
module.exports.renderSign=(req,res)=>{
    res.render("./users/signup.ejs")
}
module.exports.signRoute=async(req,res)=>{
    try{
        let { username,email,password} =req.body;
    const newUser= new User({email,username});
    const registeredUser=await User.register(newUser,password)
    // console.log(registeredUser);
    req.flash("Done","Welcome to Wanderlust")
    res.redirect("/listings")
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
}
module.exports.renderLogin=(req,res)=>{
    res.render("./users/login.ejs")
}
module.exports.loginRoute=async(req,res)=>{
    req.flash("Done","Welcome to wanderlust")
    res.redirect(res.locals.redirectUrl||"/listings");
}
module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            nrxt(err)
        }
        req.flash("Done","Logout Successfully")
        res.redirect("/listings")
    })
}