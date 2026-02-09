import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import brrypt from "bcryptjs";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup =async (req,res)=> {
    const {fullName,email,password} = req.body;

    try{
        //validation
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length< 6){
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Please enter a valid email address"});
        }

        const user = await User.findOne({email})
        if(user) return res.status(400).json({message: "User with this email already exists"});

        //hash password
        const salt = await brrypt.genSalt(10);
        const hashedPassword = await brrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if(newUser){
            const savedUser = await newUser.save();
            generateToken(savedUser._id,res);
            
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });

        //to do: send welcome email
        try {
            await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
        } catch (error) {
            console.error("Failed to send welcome email:", error);
        }

        } else {
            res.status(400).json({message: "Invalid user data"});
        }

    } catch(error){
        console.error("Error in signup controller:", error);
        res.status(500).json({message: "Interval Server error"});
    }
}

export const login = async (req,res)=> {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }

    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid credentials"});

        const isPasswordMatch = await brrypt.compare(password,user.password);
        if(!isPasswordMatch) return res.status(400).json({message: "Invalid credentials"});

        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login controller:", error);
        res.status(500).json({message: "Internal Server error"});
    }
}

export const logout =  (_,res)=> {
    res.cookie("jwt","",{maxAge : 0});
    res.status(200).json({message: "Logged out successfully"});
}

export const updateProfile = async (req,res) => {
    try {
        const {profilePic} = req.body;
        if(!profilePic) return res.status(400).json({message: "Profile picture is required"});

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);
        } catch (error) {
        console.log("Error in updateProfile controller:", error);
        res.status(500).json({message: "Internal Server error"});
    }
}