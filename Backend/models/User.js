import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
  name: {type:String, required:true, trim:true },
  email: {type:String, required:true, unique:true,trim:true, match: [/.+\@.+\..+/, "Please enter a valid email address"]},
  password: {type:String, required:true, minLength:6,},
  role: {type:String, enum:["customer", "admin"], default: "customer"}  
},
{timestamps: true}

)

// Password Hash middleware

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) 
  return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password , salt);
  next() 
})

// match user enterd password to Hashed password
userSchema.method.matchPassword = async function (enteredPasword) {
  return await bcrypt.compare(enteredPasword, this.password)
}

export default mongoose.model("User", userSchema);