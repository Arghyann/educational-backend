import { mongoose } from "mongoose"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session= await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password 
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{
            name,   
            email, 
            password: hashedPassword
        }], { session });

        const token = jwt.sign(
            { userId: newUser[0]._id },
            process.env.JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser[0]._id,
                name: newUser[0].name,
                email: newUser[0].email
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {

}

export const signOut = async (req, res, next) => {

}