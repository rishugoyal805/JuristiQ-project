const express = require('express');
const app= express();
const nodemailer = require('nodemailer');
const bcrypt= require('bcrypt');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const userModel = require("./models/user");
const clientModel= require("./models/client");
const FeesModel = require("./models/fees");

 const moment = require('moment');
 const twilio = require('twilio');
  const cors = require("cors");
 app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Update with your frontend URL

const postModel= require("./models/post");
const casesModel= require("./models/cases");
const cookieParser= require('cookie-parser');
const path=require('path');
app.set("view engine", "ejs");
app.use(express.json({ limit: "50mb" })); // Adjust size as needed
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
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
      return res.status(401).json({ message: "User not found" });
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, "secretString", { expiresIn: "1h" });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax", // Change to "none" if frontend & backend are on different domains
    });

    res.json({ message: "Login successful" });

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
      nextHearing: c.nextHearing  // Ensure field matches frontend key
    }));

    res.status(200).json(formattedCases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.sendStatus(500);
  }
});


 app.post('/register', async (req,res)=>{
    let { name, age, email,password,secretString}= req.body;//so that you dont have to write req.body with variables again and again

    let user = await userModel.deleteOne({email});
    // if(user) return res.status(500).send("user already registered");
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(password, salt, async (err, hash)=>{
          let user = await userModel.create({
               name,
               age,
                email,
                password: hash,
                secretString
            });
          let token=  jwt.sign({email: email, userid: user._id},"secretString");
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
 app.get('/toknowcl',async(req,res)=>{
  let contents= await clientModel.find();
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
//  function isLoggedIn(req,res, next){
// if(req.cookies.token ==="") res.redirect("/login");
// else{
//  let data = jwt.verify(req.cookies.token, "secretString");
//  req.user=data;
//  next();
// }
//  }
 app.get('/read',async(req,res)=>{
  const user= await userModel.findOne({username:"xyz"});
  res.send(user);
 })
 //protected routes work only when logged in
// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  console.log("Cookies:", req.cookies);
  if (!req.cookies.token) {
    console.log("Token missing");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let data = jwt.verify(req.cookies.token, "secretString");
    console.log("Token verified:", data);
    req.user = data;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}






// GET Profile Data
app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure default values for missing fields
    res.json({
      name: user.name || "",
      email: user.email || "",
      age: user.age || "",
      contact: user.contact || "",
      casesHandled: user.casesHandled || 0,
      casesWon: user.casesWon || 0,
      profilePic: user.profilePic || "",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT Update Profile Data
app.put("/updateProfile", isLoggedIn, async (req, res) => {
  try {
    const { name, age, contact, profilePic } = req.body;

    const updatedUser = await userModel.findOneAndUpdate(
      { email: req.user.email },
      { $set: { name, age, contact, profilePic } }, // Ensure update is correctly applied
      { new: true } // Return updated user
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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
      const { case_ref_no, caseTitle, clientName, status, nextHearing, fees, pending_fees } = req.body;

      // Create a new case
      const newCase = await casesModel.create({
          case_ref_no,
          caseTitle,
          clientName,
          status,
          nextHearing: nextHearing, // Match field name in schema
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
      { case_ref_no: req.params.case_ref_no },
      {
        caseTitle: req.body.caseTitle,
        clientName: req.body.clientName,
        status: req.body.status,
        nextHearing: req.body.nextHearing ? new Date(req.body.nextHearing) : null, // Convert to Date
        fees: req.body.fees,
        pending_fees: req.body.pending_fees,
      },
      { new: true }
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

// Get client details by case reference number
app.get("/clients/:case_ref_no", async (req, res) => {
  try {
    const { case_ref_no } = req.params;
    const client = await clientModel.findOne({ case_ref_no });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all clients
app.get("/clients", async (req, res) => {
  try {
    const clients = await clientModel.find();
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new client
app.post("/createclient", async (req, res) => {
  try {
    const { client_name, phone, case_ref_no } = req.body;

    const existingClient = await clientModel.findOne({ case_ref_no });
    if (existingClient) {
      return res.status(400).json({ message: "Case reference number already exists" });
    }

    const newClient = new clientModel({ client_name, phone, case_ref_no });
    await newClient.save();

    res.status(201).json(newClient); // Send back the created client
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Server error" });
  }
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
    const cases = await casesModel.find({}, "nextHearing"); // Fetch only hearingDate
    res.json(cases.map((c) => c.nextHearing)); // Convert to JSON array
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hearing dates" });
  }
});
app.get("/pendingcases", async (req, res) => {
  try {
    const pendingCases = await casesModel.find({ status: "Pending" }, "caseTitle clientName nextHearing");
    res.json(pendingCases);
  } catch (error) {
    console.error("Error fetching pending cases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Create Fee Record
app.post("/createfee", async (req, res) => {
  try {
    const newFee = new FeesModel(req.body);
    await newFee.save();
    res.status(201).json({ message: "Fee record created successfully!" });
  } catch (error) {
    console.error("Error creating fee record:", error);
    res.status(500).json({ message: "Failed to create fee record" });
  }
});

// ✅ Get All Fees
app.get("/getfees", async (req, res) => {
  try {
    const fees = await FeesModel.find();
    res.json(fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).json({ message: "Failed to retrieve fees" });
  }
});

app.post("/existing", async (req, res) => {
  const { email, secretString } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.secretString !== secretString) {
      return res.status(401).json({ message: "Incorrect secret key" });
    }

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/updatefee/:id", async (req, res) => {
  try {
    const updatedFee = await FeesModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFee) return res.status(404).json({ message: "Fee record not found" });
    res.json({ message: "Fee record updated successfully!", updatedFee });
  } catch (error) {
    console.error("Error updating fee record:", error);
    res.status(500).json({ message: "Failed to update fee record" });
  }
});


app.delete("/deletefee/:id", async (req, res) => {
  try {
    const deletedFee = await FeesModel.findByIdAndDelete(req.params.id);
    if (!deletedFee) return res.status(404).json({ message: "Fee record not found" });
    res.json({ message: "Fee record deleted successfully!" });
  } catch (error) {
    console.error("Error deleting fee record:", error);
    res.status(500).json({ message: "Failed to delete fee record" });
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



















































































































































































