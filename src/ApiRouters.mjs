import {Router} from "express";
import { body,validationResult } from "express-validator";

import { getUser, login, registerUser,verifyJwtToken ,addCandidate,getCandidates} from "./utils.mjs";

const router=Router();

router.post("/register",[

    body("email")
        .isEmail().withMessage("Invalid email address"),
    body("first_name")
    .isString().withMessage('First name must be a string')
    .isAlpha().withMessage('First name must contain only letters'),
    body("last_name")
        .optional()
        .isString().withMessage('Last name must be a string')
        .isAlpha().withMessage('Last name must contain only letters'),
    body("password")
        .isString()
        .isStrongPassword()
        .withMessage("invalid password")
    ],async (req,res,next)=>{

        const errors=validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({erros:errors.array()});

        try{
            await registerUser(req.body);
        }
        catch(err){
            return res.status(400).json({error:err.message});
        }
        res.status(201).json({message:"user created"});
});

router.post("/login",[
    body("email")
        .isEmail().withMessage("invalid email"),
    body("password")
        .isStrongPassword().withMessage("invalid pasword")

],async (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors:errors.array()});
    const result=await login(req.body);
    if(result[0]==200)
        return res.status(200).json({token:result[1]});
    return res.status(result[0]).json({message:result[1]});
});

router.get("/candidate",verifyJwtToken,async (req,res,next)=>{
    const pageNumber=req.query.pageNumber||1,size=req.query.size||10;
    const user_id=req.user_id;
    const result=await getCandidates(user_id,pageNumber,size);
    return res.status(200).json({candidates:result});
});

router.post("/candidate",verifyJwtToken,[
    body("email")
        .isEmail().withMessage("Invalid email address"),
    body("first_name")
    .isString().withMessage('First name must be a string')
    .isAlpha().withMessage('First name must contain only letters'),
    body("last_name")
        .optional()
        .isString().withMessage('Last name must be a string')
        .isAlpha().withMessage('Last name must contain only letters'),
],async (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({erros:errors.array()});

    try{
        await addCandidate(req.body,req.user_id);
    }catch(err){
        return res.status(400).json({error:err.message});
    }
    return res.status(201).json({message:"candidate added"});
});

router.get("/public/profile",verifyJwtToken,async (req,res,next)=>{
    const data=await getUser(req.user_id);
    return res.status(200).json({user:data});
});


router.post("/public/candidate",verifyJwtToken,async (req,res)=>{
    const pageNumber=req.query.pageNumber||1,size=req.query.size||10;
    const user_id=req.user_id;
    const result=await getCandidates(user_id,pageNumber,size);
    return res.status(200).json({candidates:result}); 
});


export default router;