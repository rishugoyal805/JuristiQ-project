const express = require('express');
const app= express();
const nodemailer = require('nodemailer');
const bcrypt= require('bcrypt');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const userModel = require("./models/user");
const clientModel= require("./models/client");
 const moment = require('moment');
 const twilio = require('twilio');
  const cors = require("cors");
 app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Update with your frontend URL

const postModel= require("./models/post");
const casesModel= require("./models/cases");
const cookieParser= require('cookie-parser');
const path=require('path');
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.get('/',(req,res)=>{
   res.render("index");
});
app.get('/login',(req,res)=>{
    res.render("login");
})
app.post('/login', async(req,res)=>{
   let {email, password} = req.body;
   let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("something went wrong");

    bcrypt.compare(password, user.password, function(err,result){
        let token=  jwt.sign({email: email, userid: user._id},"secretkey");
          res.cookie("token", token);
        if(result) res.status(200).redirect("/profile");
        else res.redirect('/login');
    });
 });
 app.post('/register', async (req,res)=>{
    let {email, password, username, name, age}= req.body;//so that you dont have to write req.body with variables again and again

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("user already registered");
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(password, salt, async (err, hash)=>{
          let user = await userModel.create({
                username,
                email,
                password: hash,
                age
            });
          let token=  jwt.sign({email: email, userid: user._id},"secretkey");
          res.cookie("token", token);
          res.send("registered");
        })
    })
});
 app.post('/post',isLoggedIn, async(req,res)=>{
      let user= await userModel.findOne({email: req.user.email});
      let {content} = req.body;

      let post= await postModel.create({
        user: user._id,
        content
      });
      user.posts.push(post._id);
      await user.save();
      res.redirect("/profile");
 });
 app.get('/improvising',async(req,res)=>{
    await userModel.deleteOne({username: "dev"});
    res.redirect("/");
 });
 app.get('/toknow',async(req,res)=>{
 let contents= await userModel.find();
 res.send(contents);
 })
app.get('/logout',(req,res)=>{
    res.cookie("token", "");
    //making the cookie blank
    res.redirect("/");
});
 
 //protected middleware
 function isLoggedIn(req,res, next){
if(req.cookies.token ==="") res.redirect("/login");
else{
 let data = jwt.verify(req.cookies.token, "secretkey");
 req.user=data;
 next();
}
 }
 app.get('/read',async(req,res)=>{
  const user= await userModel.findOne({username:"xyz"});
  res.send(user);
 })
 //protected routes work only when logged in
 app.get('/profile', isLoggedIn,async(req,res)=>{
   let user= await userModel.findOne({email: req.user.email }).populate("posts");
   res.render('profile',{user});
});
app.get("/like/:id", isLoggedIn, async(req,res)=>{
  let post= await postModel.findOne({_id: req.params.id}).populate("user");
  if(post.likes.indexOf(req.user.userid)=== -1){
    post.likes.push(req.user.userid);
  }
  else{
    post.likes.splice( post.likes.indexOf(req.user.userid), 1);
  }ƒ
  
  await post.save();
  res.redirect("/profile");
});
app.get("/edit/:id", isLoggedIn, async(req,res)=>{
  let post =await postModel.findOne({_id: req.params.id}).populate("user");    
  res.render("edit", {post});
});
app.post("/update/:id", isLoggedIn, async(req,res)=>{
  let post =await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content})

  res.redirect("/profile",otp);
});

// POST endpoint to create user and send OTP
app.post("/advocate", async (req, res) => {
  const { name, email, age } = req.body;

  try {
    // Generate OTP
    const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otp = generateOtp();

    // Save user with OTP in the database
    const adv = await userModel.create({
      name,
      email,
      age,
      otp,
    });

    console.log("Generated OTP:", otp); // Optional: For debugging purposes

    // Configure the transporter for nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP server
      port: 587, // 587 for TLS, 465 for SSL
      secure: false, // true for SSL
      auth: {
        user: "devyani04sh@gmail.com", // Sender email
        pass: "fbgt bbyv bote ldri", // App password (not your email password)
      },
    });

    // Email options
    const mailOptions = {
      from: "devyani04sh@gmail.com", // Sender email
      to: email, // Recipient email
      subject: "Your OTP Code",
      text: `Hello, your OTP code is: ${otp}`, // Message with the OTP
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error:", err);
        return res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.status(200).send("OTP sent successfully");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error creating advocate");
  }

});

// POST endpoint to verify OTP
app.post("/verifyotp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare the OTPs
    if (user.otp === parseInt(otp, 10)) {
      console.log("OTP verified successfully");
      res.status(200).send("OTP verified successfully");
    } else {
      console.log("Incorrect OTP");
      await userModel.deleteOne({email });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error verifying OTP");
  }
});
app.get("/casesinfo",isLoggedIn,async(req,res)=>{
  let info= await casesModel.find();
  res.send(info);
});
app.post("/createcase",isLoggedIn,async(req,res)=>{
  const {caseTitle, clientName, fees}= req.body;
  let user = await casesModel.create({
    caseTitle,
    clientName,
    fees
});
res.send("created");
});
app.put("/updatecase/:caseTitle", isLoggedIn, async (req, res) => {
  try {
    const updatedCase = await casesModel.findOneAndUpdate(
      { caseTitle: req.params.caseTitle }, // Match by caseTitle from URL
      {
        clientName: req.body.clientName,
        fees: req.body.fees
      }, 
      { new: true } // Ensure the updated document is returned
    );

    if (!updatedCase) {
      return res.status(404).send("Case not found");
    }

    res.status(200).send(updatedCase); // Respond with the updated case
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).send("An error occurred while updating the case");
  }
});
app.get("/getclient/:case_ref_no",async(req,res)=>{
  const { case_ref_no } = req.params;
  const clientDatabase = await clientModel.findOne({ case_ref_no });
  res.send(clientDatabase);
});
app.post("/createclient",async(req,res)=>{
  const {client_name, phone, case_ref_no}= req.body;
  let user = await clientModel.create({
    client_name,
    phone,
    case_ref_no
});
res.send("created");
});
app.delete("/deletecase/:caseTitle", async(req,res)=>{
  const { caseTitle }= req.params;
   await casesModel.deleteOne({caseTitle });
  res.send("deleted");
}); 
app.delete("/deleteadv/:name", async(req,res)=>{
  const { name }= req.params;
   await userModel.deleteOne({name });
  res.send("deleted");
}); 
app.listen(3000);
