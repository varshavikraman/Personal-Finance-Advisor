import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { user } from "../Model/userSchema.js";
import { authenticate } from "../MiddleWare/auth.js";

const userRoute = Router();

userRoute.post('/signup',async(req,res)=>{
    try {
        const { Name, Email, Password } = req.body;

        const User = await user.findOne({ email:Email });
        if (User) {
            return res.status(400).json({ msg: "This email already exists" });
        }

        console.log("Incoming signup:", req.body);

        const newPassword = await bcrypt.hash(Password,10) ;
        console.log(`New Password : ${newPassword}`);

        const newUser = new user({
            name:Name,
            email:Email,
            password:newPassword
        });

        await newUser.save();

        res.status(201).json({msg:"Sucessfully created"})

    } catch (error) {
        console.error("Error in signup: ", error);
        res.status(500).json({error:'Internal Server Error'});
    }
        
});

userRoute.post('/login',async(req,res)=>{
    try {
        const { Email,Password } = req.body;
        const result = await user.findOne({ email:Email });
        if (!result) {
            res.status(404).json({msg:`This ${Email} not registered`});
        }
        const valid = await bcrypt.compare(Password,result.password)
        console.log(valid);

        if (valid) {
            const token = jwt.sign({Email,Name:result.name},process.env.SECRET_KEY);
            console.log('Token:',token);
            if (token) {
                res.cookie('authToken',token,{
                    httpOnly:true
                })
                res.status(200).json({msg:'logged in Sucessfully'});
            } else {
                res.status(400).json({msg:"something went wrong in token generation"});
            }
        }
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({error:'Internal Server Error'});
    }
});

userRoute.post('/logout',authenticate,(req,res)=>{
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ msg: "Logged out successfully" });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({error:'Internal Server Error'});
    }
});

userRoute.get("/profile", authenticate, async (req, res) => {
  try {
      const Email = req.email;
      const userProfile = await user.findOne({ email: Email }).select("-password");

      if (!userProfile) {
          return res.status(404).json({ message: "Profile not found" });
      }

      res.status(200).json({
        Name: userProfile.name,  
        Email: userProfile.email,
    });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
  
userRoute.patch('/editProfile', authenticate, async (req, res) => {
    try {
        const { Name } = req.body;

        const email = req.email;

        const updatedProfile = await user.findOneAndUpdate(
            { email }, 
            { $set: { name: Name } },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        res.status(200).json({ 
            msg: 'Profile updated successfully', 
            result: {
                name: updatedProfile.name,  
                email: updatedProfile.email,
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Internal Server Error");
    }
});

export { userRoute }