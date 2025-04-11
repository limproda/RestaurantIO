import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import { createSecretToken } from "../util/SecretToken.js";

export const Signup = async (req, res, next) => {
    try {
      const {
        email,
        password,
        name,
        lastName,
        role,
        phone,
        bornDate,
        createAt,
        employeesNumber,
        hireDate,
        paymentDate,
        timeRecord,
        payRoll,
      } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ message: "User already exists" });
      }
      const user = await User.create({ email, password, name, lastName, role, phone, bornDate, createAt, employeesNumber, hireDate, paymentDate, timeRecord, payRoll });
      const token = createSecretToken(user._id);
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      res
        .status(201)
        .json({ message: "User signed up successfully", success: true, user });
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  export const Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if(!email || !password ){
        return res.status(400).json({message:'All fields are required'})
      }
      const user = await User.findOne({ email });
      if(!user){
        return res.json({message:'Incorrect password or email' }) 
      }
      const auth = await bcrypt.compare(password,user.password)
      if (!auth) {
        return res.json({message:'Incorrect password or email' }) 
      }
       const token = createSecretToken(user._id);
       res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
       });
       res.status(201).json({ message: "User logged in successfully", success: true });
       next()
    } catch (error) {
      console.error(error);
    }
  }