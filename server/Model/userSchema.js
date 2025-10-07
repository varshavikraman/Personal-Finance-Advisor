import { Schema} from "mongoose";
import {model}  from "mongoose"

const userSchema = new Schema({
    name : {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true} 
});

const user = model('Users',userSchema);

export {user}