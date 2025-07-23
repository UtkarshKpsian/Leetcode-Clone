const jwt=require("jsonwebtoken")
const User=require("../models/user");
const redisclient=require("../config/redis");
const adminMiddleware=async(req,res,next)=>{

    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("Token not present");
        }

        const payload=jwt.verify(token,process.env.JWT_KEY);



        const {_id}=payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        const result=await User.findById(_id);

        if(payload.role!='admin'){
            throw new Error("invalid token");
        }


        if(!result){
            throw new Error("user Doesn't Exist");
        }

        // Redis ke bloclist mei toh nhi hai
         
        const isBlocked =await redisclient.exists(`token:${token}`);

        if(isBlocked){
            throw new Error("Invalid Token");
        }

        req.result=result;

        next();
    }
    catch(err){
        res.send("Error: "+err.message);
    }
}
module.exports=adminMiddleware;