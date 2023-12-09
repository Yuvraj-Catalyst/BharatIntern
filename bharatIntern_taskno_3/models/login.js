const mongoose = require("mongoose");
const loginSchema = mongoose.Schema({
    fname:{
        type:String,
        required:true,
    },
    lname:{
        type:String,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    userType:{
        type:String,
    },
    createDate:{
        type:String,
    },
});
const Login = mongoose.model("Login",loginSchema);
module.exports = Login;