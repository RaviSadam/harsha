import { Schema,model,Types } from "mongoose";
import bcrypt from "bcrypt";

const userSchema=new Schema({
    _id:{
        type:String,
        default:()=>(new Types.ObjectId())
    },
    first_name:{
        type:String,
        requried:true,
    },
    last_name:{
        type:String,
        requried:false,
        default:null,
    },
    password:{
        type:String,
        requried:true,
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        require:true,
        match:[/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,"invalid email"]
    }
});

userSchema.pre("save",async function(next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});

userSchema.methods.isValidPassword=async function(password) {
    return await bcrypt.compare(password,this.password);
}

export default model("User",userSchema);