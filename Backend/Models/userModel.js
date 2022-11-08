const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const userInformation=new mongoose.Schema({   // to define attributes of table
    Name:{
        type:String,
    },
    email:{
        type:String,
        validate:[validator.isEmail,"Please enter valid Email"],  //validator
        required:true,
        unique:true
    },
    password:{
        type:String,
        validate:[validator.isStrongPassword,"password not strong"],
        // minlength:[8,"password not strong"],
        select:false,
        required:true
    },
    Role:{
        type:String,
        default:"User"
    }
    // StudentId:Number,
    // Birthday:Date
});

userInformation.pre("save",async function(next){
    if(!this.isModified("password")){ // this is used to prevent the password from again hashing itself while we update the user data.
        next();
    }
    //hashing for encrypting password
    this.password=await bcrypt.hash(this.password,10) // 10 is round 
})


//comparing stored encrypted password value
userInformation.methods.comparePassword=function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)
}


userInformation.methods.getJWTToken=function(){
    return jwt.sign({ id:this._id},process.env.JWT_SECRET_KEY)
}

const  User=new mongoose.model("User",userInformation); // to give name and definition of table

module.exports=User;



