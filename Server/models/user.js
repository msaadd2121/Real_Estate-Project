const mongoose = require("mongoose");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter your Username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter your Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter your Password"],
      minLength: [8, "password should be greater than 8 characters"],
      select:false,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
  },
  { timestamps: true },
);
//Hash Password
UserSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password=await bcrypt.hash(this.password,10)
})

//token
UserSchema.methods.getJWTToken=function(){
  return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Comapre Password

UserSchema.methods.comparePassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword ,this.password)

}

const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
};
