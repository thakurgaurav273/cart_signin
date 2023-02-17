require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require("mongoose");

const md5=require('md5');
const app=express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine","ejs");

mongoose.connect(process.env.URL);


const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    contact:Number,
    dob:Date,
    password:String,

});



const user=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/register",function(request,response){
    var email=request.body.email_id;
    var password=md5(request.body.password);
    var user_name=request.body.name;
    var user_dob=request.body.birthday;
    var mob=request.body.mob_number;
    const new_user=new user({
        name:user_name,
        email:email,
        contact:mob,
        dob:user_dob,
        password:password
    });
    new_user.save();
    response.render("cart",{name:user_name});
});

app.post("/login",function(request,response){
    var email=request.body.email_id;
    var password=md5(request.body.password);
    user.findOne({email:email},function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    response.render("cart",{name:foundUser.name});
                }
                else{
                    response.render("register");
                }
            }
        }
    });
})


app.listen(3000,function(){
    console.log("Server running on port 3000");
});