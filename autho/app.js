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
app.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      // Find user by email
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.sendStatus(401); // User not found
      }

      // Compare hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
          return res.sendStatus(401); // Incorrect password
      }

      // User exists and password matches
      res.sendStatus(200);

  } catch (error) {
      console.error("Login error:", error);
      res.sendStatus(500); // Internal server error
  }
});
app.get("/getcases", async (req, res) => {
  try {
    const cases = await casesModel.find();
    
    // Transform cases to match frontend expectations
    const formattedCases = cases.map(c => ({
      ...c.toObject(),  // Convert Mongoose document to plain object
      next_hearing: c.nextHearing  // Ensure field matches frontend key
    }));

    res.status(200).json(formattedCases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.sendStatus(500);
  }
});


 app.post('/register', async (req,res)=>{
    let { name, age, email,password}= req.body;//so that you dont have to write req.body with variables again and again

    let user = await userModel.deleteOne({email});
    // if(user) return res.status(500).send("user already registered");
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(password, salt, async (err, hash)=>{
          let user = await userModel.create({
               name,
               age,
                email,
                password: hash
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
 });
 app.get('/toknowc',async(req,res)=>{
  let contents= await casesModel.find();
  res.send(contents);
  });
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
app.post("/createcase", async (req, res) => {
  try {
      const { case_ref_no, caseTitle, clientName, status, next_hearing, fees, pending_fees } = req.body;

      // Create a new case
      const newCase = await casesModel.create({
          case_ref_no,
          caseTitle,
          clientName,
          status,
          nextHearing: next_hearing, // Match field name in schema
          fees,
          pending_fees,
      });

      res.status(201).json({ success: true, message: "Case created successfully", case: newCase });
  } catch (error) {
      console.error("Error creating case:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.put("/updatecase/:case_ref_no", async (req, res) => {
  try {
    const updatedCase = await casesModel.findOneAndUpdate(
      { case_ref_no: req.params.case_ref_no }, // Match by case_ref_no from URL
      {
        caseTitle: req.body.caseTitle,
        clientName: req.body.clientName,
        status: req.body.status,
        nextHearing: req.body.next_hearing,
        fees: req.body.fees,
        pending_fees: req.body.pending_fees,
      },
      { new: true } // Ensure the updated document is returned
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, message: "Case updated successfully", case: updatedCase });
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ success: false, message: "An error occurred while updating the case" });
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
app.delete("/deletecases/:caseTitle", async(req,res)=>{
  const { caseT } = req.params;
  let result = await casesModel.deleteOne({caseT});
if(result){
  res.send("deleted");
}
else{
  res.send("eroor");
}
});
app.delete("/deletecase/:case_ref_no", async (req, res) => {
  const { case_ref_no } = req.params;

  if (isNaN(case_ref_no)) {
    return res.status(400).json({ success: false, message: "Invalid case reference number" });
  }

  try {
    const result = await casesModel.deleteOne({ case_ref_no: Number(case_ref_no) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, message: "Case deleted successfully" });
  } catch (error) {
    console.error("Error deleting case:", error);
    res.status(500).json({ success: false, message: "Failed to delete case" });
  }
});
app.delete("/deleteadv/:email", async (req, res) => {
  const { email } = req.params;  // ✅ Correctly extract "email"
  
  try {
    const deletedUser = await userModel.deleteOne({ email }); // ✅ Use email to find and delete user

    if (deletedUser.deletedCount === 0) {
      return res.status(404).send("User not found");  // ✅ Handle case where user isn't found
    }

    res.send("User deleted successfully"); 
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

app.get("/hearings", async (req, res) => {
  try {
    const cases = await casesModel.find({}, "hearingDate"); // Fetch only hearingDate
    res.json(cases.map((c) => c.hearingDate)); // Convert to JSON array
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hearing dates" });
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});






