import { User } from "../models/users.models.js";
import httpStatus from 'http-status';
import crypto from "crypto";
import bcrypt from "bcrypt"; 
import { Meeting } from "../models/meeting.models.js";

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password" });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }
        if (await bcrypt.compare(password, user.password)) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }
    } catch (e) {
        return res.status(500).json({ message: `Something went wrong! ${e}` });
    }
};

const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
    } catch (e) {
        res.status(500).json({ message: `Something went wrong! ${e}` });
    }
};

const getUserHistory=async(req,res)=>{
    const {token}=req.query;
    try{
        const user=await User.findOne({token:token});
        const meetings=await Meeting.find({user_id:user.username});
        res.json(meetings);
    }catch(e){
        res.json({message:`Something went wrong! ${e}`});
    }

}

const addToHistory=async (req,res)=>{
    const {token,meetingCode}=req.body;
    try{
        const user=await User.findOne({token:token});
        const newMeeting=new Meeting({
            user_id:user.username,
            meeetingCode:meetingCode,
        });
        await newMeeting.save();
        res.status(httpStatus.CREATED).json({message:"Meeting added to history"});
        
}catch(e){
    res.json({message:`Something went wrong! ${e}`});
}

}
export { login, register , getUserHistory, addToHistory };
