const UserModel = require('../Models/UserModel');
const crypto = require('crypto');
const  sendEmail  = require('../Utils/mails/RegisterMail');
const bcrypt = require('bcryptjs');
const generateToken = require('../Utils/Jwt/Token');
//User Registration
const userRegisterController = async (req, res) => {
    const {firstName , lastName , email , password ,avatar } = req.body;

    //check if user already exists
    const UserExists = await UserModel.findOne({email});

    if(UserExists){
       return res.status(400).json({
        sucess:false,
        message:"useralredyexists"
       })
    }

    //set new user
    const newUser = await UserModel.create({
        firstName,lastName,email,password,avatar
    })
    
    //after that generate token 
    const verificationToken  = crypto.randomBytes(32).toString("hex") + newUser._id;
    const verificationTokenExpiration = Date.now() + 3600000;

    //sendmail
    const verifyLink = `${process.env.Client_url}user/verify?token=${verificationToken}&id=${newUser._id}`;
    sendEmail(newUser.email, newUser.firstName , verifyLink); 

    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpiration = verificationTokenExpiration;
    await newUser.save();

    res.status(201).json({
      message: "Registered. Check your email to verify.",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, avatar: newUser.avatar },
    });


}

//User Login
const userLoginController = async (req,res) => {
   const {email , password} = req.body;
    //check if user exists
    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"usernotfound"
        })
    }

    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password , user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({
            success:false,
            message:"passwordincorrect"
        })
    }
    //check if user is verified
    if(!user.isVerified){
        return res.status(400).json({
            success:false,
            message:"emailnotverified"
        })
    }
    
    //generate token 
    const token = generateToken(user._id , user.firstName , user.email);
    //Approve login
    res.status(200).json({
        sucess:true,
        message:"Login successful",
        token:token
    })
}

// Verify Email
const verifyEmailController = async (req, res) =>{
    const { token , id } = await req.query;
    
        try {
             if (!token) {
          return res.status(400).json({ message: 'Invalid token' });
        }
        if (!id) {
          return res.status(400).json({ message: 'Invalid ID' });
        }
            const user = await UserModel.findById(id);
             if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.verificationToken !== token) {
                return res.status(400).json({ message: 'Invalid token' });
            }
            if (user.verificationTokenExpiration < Date.now()) {
                return res.status(400).json({ message: 'Token expired' });
            }
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiration = undefined;
            await user.save();
            res.status(200).json({ message: 'Email verified successfully' });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
}

module.exports = {
    userRegisterController,
    userLoginController , 
    verifyEmailController
}