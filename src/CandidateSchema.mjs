import { Schema,model } from "mongoose";

const candidateSchema=new Schema({
    first_name:{
        type:String,
        requried:true,
    },
    last_name:{
        type:String,
        requried:false,
        default:null,
    },
    user_id:{
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

export default model("candidates",candidateSchema);