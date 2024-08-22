import User from "./UserSchema.mjs";
import Candidate from "./CandidateSchema.mjs";
import jsonwebtoken from "jsonwebtoken";
import {isFuture} from "date-fns"

const registerUser=async function(body){
    try{
        const user=new User(body);
        await user.save();
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const login=async function(body){
    const user=await User.findOne({email:body.email});
    if(!user?._id){
        return [404,"user not found"];
    }
    if(!user.isValidPassword(body.password)){
        return [401,"incorrect password"]
    }
    return [200,await getJwtToken(user._id,user.email)];
}

const getJwtToken=async function (id,email){
    return await jsonwebtoken.sign({email,id},process.env.JWT_SECRET_KEY||"adfXNegvptYHMURuY12",{expiresIn:"5d"});
}
const verifyJwtToken=async function(req,res,next){
    let token=req.headers.authorization;
    if(!token || !token.startsWith("Bearer"))
        return res.status(401).json({error:"Authorization token requried"});
    try{
        token=token.split(' ')[1];
        const jwt=jsonwebtoken.verify(token,process.env.JWT_SECRET_KEY||"adfXNegvptYHMURuY12");
        if(!isFuture(jwt.exp*1000)){
            return res.status(400).json({error:"Invalid JWT token is given"});
        }
        req.user_id=jwt.id;
    }
    catch(err){
        return res.status(401).json({error:"Invalid JWT token"});
    }
    next();
}

const getUsers=async function (pageNumber,size){
    const skip=Math.max(pageNumber-1,0)*size;
    return await User.find({},{_id:0,password:0}).skip(skip).limit(size);
}

const getCandidates=async (id,page,size) => {
    const skip=Math.max(page-1,0)*size;
    return await Candidate.find({user_id:id}).skip(skip).limit(size);
}

const addCandidate=async function (body,id){
    const candidate=new Candidate(body);
    candidate.user_id=id;
    try{
        await candidate.save();
    }
    catch(err){
        throw new Error(err);
    }
}

const getUser=async function(id){
    return User.findOne({_id:id},{password:0,__v:0});
}

export {getUser,addCandidate,registerUser,login,getJwtToken,verifyJwtToken,getUsers,getCandidates}