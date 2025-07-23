console.log("📦 Inside userAuthent.js");

const redisclient = require("../config/redis.js");
const User = require("../models/user.js");
const validate = require('../utils/validator.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission=require("../models/submission.js");

// Register
const register = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    req.body.role='user'
    const user = await User.create(req.body);

    const token = jwt.sign({ _id: user._id, emailId:emailId,role:'user' }, process.env.JWT_KEY, {
      expiresIn: 60 * 60, // 1 hour
    });

       const reply={
      firstName:user.firstName,
      emailId:user.emsilId,
      _id:user._id

    }

    res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user:reply,
      message:"Login successfully"
    })
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

// Login
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Invalid Credentials");
    }

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid Credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Credentials");



    const reply={
      firstName:user.firstName,
      emailId:user.emsilId,
      _id:user._id

    }


    const token = jwt.sign({ _id: user._id, emailId:emailId,role:user.role }, process.env.JWT_KEY, {
      expiresIn: 60 * 60, // 1 hour
    });

    res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user:reply,
      message:"Login successfully"
    })
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

// Logout
const logout = async (req, res) => {
  try {

       const {token}=req.cookies;
       const payload=jwt.decode(token);


       await redisclient.set(`token:${token}`,'Blocked');
       await redisclient.expireAt(`token:${token}`,payload.exp);


       res.cookie("token",null,{expires:new Date(Date.now())});

       res.send("Logged out successfully");
   
  } catch (err) {
    res.status(503 ).send("Error during logout: " + err.message);
  }
};

const adminRegister=async(req,res)=>{
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    req.body.role='admin'
    const user = await User.create(req.body);

    const token = jwt.sign({ _id: user._id, emailId:emailId,role:'user' }, process.env.JWT_KEY, {
      expiresIn: 60 * 60, // 1 hour
    });

    res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("User Registered Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }

}


const deleteProfile=async(req,res)=>{
  try{

    const userId=req.result._id;


    await User.findByIdAndDelete(userId);


   await Submission.deleteMany({userId});
   res.status(200).send("Deleted Successfully");



  }
  catch(err){

    res.status(500).send("Internal Server Error"); 

  }
}

console.log("📤 Exporting from userAuthent.js");
module.exports = {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile
};
